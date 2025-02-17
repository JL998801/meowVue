
pipeline {
    agent any  // 讓 Jenkins 在任意可用節點上執行

    environment {
        FRONTEND_IMAGE = 'leekuanju/meowfrontend:latest'
        DOCKER_CREDENTIALS_ID = 'petfinder'    //已於在jenkins中設定可以登入dokcer-hub的帳密和使用id
        AZURE_VM = 'KuanJu@20.2.146.70'    //username@vm公開ip
    }

    stages {
        stage('拉取程式碼') {
            steps {
                script {
                   // Clone 前端專案至JENKINS容器中
                    dir('meowfrontend') {
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
                IMAGES=$(docker images -q leekuanju/meowfrontend)
                if [ -n "$IMAGES" ]; then
                    echo "刪除舊的 Docker 映像檔: $IMAGES"
                    echo "$IMAGES" | xargs -r docker rmi -f
                else
                    echo "沒有舊的映像檔需要刪除"
                fi
                '''
            }
        }

        stage('建構前端 Docker 映像檔') {
            steps {
                sh "docker build -t $FRONTEND_IMAGE ./meowfrontend"   
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


                             #  啟動前端 (Nginx)
                            docker run -d -p 80:80 -p 443:443 --name frontend --network petfinder_network --restart always -v /etc/letsencrypt/live/petfinder.duckdns.org/fullchain.pem:/etc/nginx/certs/fullchain.pem -v /etc/letsencrypt/live/petfinder.duckdns.org/privkey.pem:/etc/nginx/certs/privkey.pem $FRONTEND_IMAGE

EOF"""
            }
        }
    }
}
    }
}
