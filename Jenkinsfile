
pipeline {
    agent any  // 讓 Jenkins 在任意可用節點上執行

    environment {
        FRONTEND_IMAGE = 'leekuanju/Meowfrontend:latest'
        DOCKER_CREDENTIALS_ID = 'petfinder'    //已於在jenkins中設定可以登入dokcer-hub的帳密和使用id
        AZURE_VM = 'KuanJu@20.2.146.70'    //username@vm公開ip
        IMAGE_VOLUME = "petfinder_images"  // VM 中 Docker Volume 名稱，拿來放冠假資料圖片
    }

    stages {
        stage('拉取程式碼') {
            steps {
                script {
                   // Clone 前端專案至JENKINS容器中
                    dir('Meowfrontend') {
                        checkout([
                            $class: 'GitSCM',
                            branches: [[name: '*/dev']],
                            userRemoteConfigs: [[
                                url: 'https://github.com/JL998801/meowVue.git',
                                credentialsId: 'MeowFrontend'  
                                 // 你的前端 GitHub 憑證 ID
                            ]],
                            extensions: [[$class: 'CloneOption', shallow: true, depth: 1]]
                        ])
                    }
                }
                sh "ls -lah" // 確保代碼拉取成功
            }
        }

        stage('清理舊的 Docker Image') {
            steps {
                sh "docker image prune -f"
                sh '''
                IMAGES=$(docker images -q leekuanju/Meowfrontend | tail -n +2)
                if [ -n "$IMAGES" ]; then
                    docker rmi -f $IMAGES
                fi
                '''
            }
        }

        stage('建構前端 Docker 映像檔') {
            steps {
                sh "docker build -t $FRONTEND_IMAGE ./Meowfrontend"   
                // 從jenkins容器中讀取dockerfile，並啟動一個暫時的 Build 容器（這個容器會在 docker build 過程中運行）
            }
        }


      
         stage('登入並推送至 Docker Hub') {
            steps { 
                withDockerRegistry([credentialsId: 'petfinder', url: '']) {
                    sh "docker push $FRONTEND_IMAGE"
                }
            }
        }

        stage('上傳假資料圖片到 Azure VM') {
            steps {
                script {
                    withCredentials([sshUserPrivateKey(credentialsId: 'petFinder', keyFileVariable: 'SSH_KEY')]) {
                        sh """
                        # 上傳本機圖片到 Azure VM 的暫存目錄（只傳輸變更的檔案）
                        # 要在本機 Jenkins 容器內先安裝 rsync
                        # -a：保持檔案權限 -v：顯示傳輸進度 -z：壓縮資料，加速上傳 --ignore-existing：只傳輸新檔案不覆蓋舊檔案
                        rsync -avz -e "ssh -i /var/jenkins_home/.ssh/jenkins_azure_key -o StrictHostKeyChecking=no" --ignore-existing /var/jenkins_home/upload/images/ $AZURE_VM:/tmp/images/
                        
                        # SSH 進入 Azure VM，確保只移動新圖片，避免重複上傳
                        # -r：遞歸複製（確保目錄結構不變）-n：不覆蓋已存在的檔案（確保不會重複塞入相同圖片）
                        ssh -i /var/jenkins_home/.ssh/jenkins_azure_key -o StrictHostKeyChecking=no $AZURE_VM <<EOF
                            sudo mkdir -p /var/lib/docker/volumes/$IMAGE_VOLUME/_data/final/pet/images
                            sudo cp -rn /tmp/images/* /var/lib/docker/volumes/$IMAGE_VOLUME/_data/final/pet/images/
                            sudo rm -rf /tmp/images
EOF"""
                    }
                }
            }
        }

        
        stage('部署到 Azure VM') { 
            steps {
                script {
                    withCredentials([sshUserPrivateKey(credentialsId: 'petFinder', keyFileVariable: 'SSH_KEY')]) {
                        sh """
                        ssh -i /var/jenkins_home/.ssh/jenkins_azure_key -o StrictHostKeyChecking=no $AZURE_VM <<EOF

                            # 創建 Docker 網路 (確保 MSSQL、Redis、後端在同一個網路，可互相連通，其他不在 petfinder_network 內的容器無法存取 MSSQL & Redis)
                            docker network create petfinder_network || true
                            
                            # 拉取最新的 Docker 映像檔
                            docker pull $FRONTEND_IMAGE
                            
                             #  停止並刪除舊容器
                            docker stop frontend || true
                            docker rm frontend || true
                           
                             # 創建放假資料圖的 Docker Volume（如果尚未建立）
                            docker volume create $IMAGE_VOLUME || true


                             #  啟動前端 (Nginx)
                            docker run -d -p 80:80 -p 443:443 --name frontend --network petfinder_network --restart always -v /etc/letsencrypt/live/petfinder.duckdns.org/fullchain.pem:/etc/nginx/certs/fullchain.pem -v /etc/letsencrypt/live/petfinder.duckdns.org/privkey.pem:/etc/nginx/certs/privkey.pem $FRONTEND_IMAGE

EOF"""
            }
        }
    }
}
    }
}
