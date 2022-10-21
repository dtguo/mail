import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter)
import Home from '../components/Home.vue'
import Login from '../components/Login.vue'
import Welcome from '../components/Welcome.vue'
import User from '../components/User.vue'
import Rights from '../components/Rights.vue'
import Roles from '../components/roles/Roles.vue'
import Categories from '../components/goods/Categories.vue'
import Params from '../components/goods/Params.vue'
import Goods from '../components/goods/Goods.vue'
import Add from '../components/goods/Add.vue'
const router =  new VueRouter({
    routes:[
        {
            path:'/home',
            name:'Home',
            component:Home,
            redirect:'/welcome',
            children:[
                {
                    path:'/welcome',
                    name:'Welcome',
                    component:Welcome
                },
                {
                    path:'/users',
                    name:'User',
                    component:User
                },
                {
                    path:'/rights',
                    name:'Rights',
                    component:Rights
                },
                {
                    path:'/roles',
                    name:'Roles',
                    component:Roles
                },
                {
                    path:'/categories',
                    name:'Categories',
                    component:Categories
                },
                {
                    path:'/params',
                    name:'Params',
                    component:Params
                },
                {
                    path:'/goods',
                    name:'Goods',
                    component:Goods
                },
               
                {
                    path:'/goods/add',
                    name:'Add',
                    component:Add
                },
               
            ]
        },
        {
            path:'/Login',
            name:'Login',
            component:Login,
            
        },
        {
            path:'/',
           redirect:'/login'
        },
    ]
})

// 导航守卫

router.beforeEach((to, from, next) => {
    if(to.path === '/login' || to.path === '/') return next()
    // next()
   const tokenVal = window.sessionStorage.getItem('token')
   if(!tokenVal) return next('/login')
   next()
})

export default router