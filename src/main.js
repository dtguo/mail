import Vue from 'vue'
import App from './App.vue'
// eidt-quill
 
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
 
// re.css
import './assets/re.css'
// 导入router
import router from './router/main.js'
// ZkTable
import ZkTable from 'vue-table-with-tree-grid'
Vue.use(ZkTable)
// element-ui
import './element/main.js'
import 'element-ui/lib/theme-chalk/index.css';
// axios
import axios from 'axios'
const axiosIns = axios.create({
  baseURL: 'http://127.0.0.1:8888/api/private/v1/',
  timeout: 5000,
  headers: {'Authorization': window.sessionStorage.getItem('token')},
});
Vue.prototype.$http = axiosIns
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  return response;
}, function (error) {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  return Promise.reject(error);
});

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
