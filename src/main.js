import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/global.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/iconfont/iconfont.css'
import {postRequest, postKeyValueRequest, putRequest, deleteRequest, getRequest} from "./utils/api";
import {initMenu} from "./utils/menus";
import axios from "axios";


Vue.prototype.postRequest = postRequest;
Vue.prototype.postKeyValueRequest = postKeyValueRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.deleteRequest = deleteRequest;
Vue.prototype.getRequest = getRequest;

Vue.prototype.$axios = axios
// axios.defaults.baseURL = 'http://localhost:8081'

Vue.use(ElementUI)

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
    if (to.path === '/') {
        next();
    } else {
      if (window.sessionStorage.getItem('user')) {
            initMenu(router, store);
            // console.log(to)
            // console.log(from)
            next();
        } else {
            next('/?redirect=' + to.path)
        }
    }
})
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
