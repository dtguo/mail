<template>
  <el-container>
  <el-header>
    <el-row>
        <el-col :span="1">
            <img width="50px" src="../assets/logo.png" alt="">
        </el-col>
        <el-col :span="22"><span>电商后台管理系统</span></el-col>
        <el-col :span="1">
            <el-button type="primary" @click="quit">退出</el-button>
        </el-col>
    </el-row>
  </el-header>
  <el-container>
    <el-aside :width="isCollapse?'64px':'200px'">
        
        
        <el-menu
        unique-opened
      :collapse="isCollapse"
      :default-active="dactive+''"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
      
        <div @click="changeColl" class="coll"><span>|||</span></div>
        <!-- index只接收字符串不接受数值 -->
      <el-submenu :index="list1.id+''" v-for="list1 in asideMenu" :key="list1.id">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>{{list1.authName}}</span>
        </template>      
          <el-menu-item @click="changeRouter(list2.path,list2.id)" :index="list2.id+''" v-for="list2 in list1.children" :key="list2.id">
            <i class="el-icon-location"></i>
          <span>{{list2.authName}}</span>
          </el-menu-item>        
      </el-submenu>
      
    </el-menu>
    </el-aside>
    <el-main>
        <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
</template>

<script>
export default {
    data(){
        return {
            // aside
            isCollapse:false,
            asideWidth:'200px',
            asideMenu:[],
            dactive:''
        }
    },
    created(){
        this.getAsideData()
        this.dactive = window.sessionStorage.getItem('index')
    },
    methods:{
        // 退出
        quit(){
            window.sessionStorage.clear()
            this.$router.push('/login')
        },
        // 折叠侧边栏
        changeColl(){
            this.isCollapse = !this.isCollapse
           
        },
       async getAsideData(){
           const {data:res} = await this.$http.get('menus')
        //    console.log(res)
           if(res.meta.status !== 200){
            return this.$message.error('获取菜单列表失败')
           }
           this.asideMenu = res.data
        },
        changeRouter(path,da){
            this.dactive = da
            window.sessionStorage.setItem('index',da)
            this.$router.push(`/${path}`)
        }
    }
}
</script>

<style lang="less" scoped>
.el-container{
    height: 100%;
    background-color: #bfa;
}
.el-header{
    background-color: gray;

}
.el-aside{
    background-color: #373041;
.coll{
    width: 100%;
    text-align: center;
    line-height: 30px;
    cursor: pointer;
}

}
.el-main{
    background-color: #f1f1f1;

}
.el-menu{
   border: 0px;
}
</style>