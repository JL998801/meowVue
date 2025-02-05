//導入SVG核心
import { library } from '@fortawesome/fontawesome-svg-core'
//導入Vue元件
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
//導入特定圖示
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

//將圖示加入函式庫
library.add(fas)
library.add(far)
library.add(fab)
//導出Font AwesomeVue元件
export default FontAwesomeIcon