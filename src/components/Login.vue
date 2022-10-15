<template>
  <div class="container">
    <el-card>
      <img src="../assets/logo.png" class="image">
      <el-form :model="loginRuleForm" :rules="loginRules" ref="loginRuleForm"  class="demo-ruleForm">
  <el-form-item  prop="username">
    <el-input
    placeholder="请输入账号"
    prefix-icon="el-icon-user"
    v-model="loginRuleForm.username">
  </el-input>
  </el-form-item>
  <el-form-item  prop="password">
    <el-input
    placeholder="请输入密码"
    show-password
    prefix-icon="el-icon-lock"
    v-model="loginRuleForm.password">
  </el-input>
  </el-form-item>
</el-form>
<el-button type="primary" @click="login">登录</el-button>
  <el-button type="success" @click="resetLoginForm">重置</el-button>
    </el-card>
  </div>
</template>

<script>
export default {
    data(){
        return {
            loginRuleForm:{
              username:'admin',
              password:'123456'
            },
            loginRules:{
              username: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
              password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
               
        }
    }
    },
    methods:{
      login(){
      this.$refs.loginRuleForm.validate(async val =>{
          if(!val){
            return this.$message.error('校验失败')
          }
          const {data:res}  = await this.$http.post('login',this.loginRuleForm)
//          this.$http.post('login',this.loginRuleForm).then((config)=>{
// console.log(config)
//          })
        if(res.meta.status !== 200){
          return this.$message.error('账号密码验证失败') 
        }
        else{
        window.sessionStorage.setItem('token',res.data.token)

          this.$message.success('登录成功')
        this.$router.push('/home')

        }
      })
        
        // console.log(res)
      },
      resetLoginForm(){
        // console.log(this,'refs')
        this.$refs.loginRuleForm.resetFields()
      }
    }
}

</script>

<style lang="less" scoped>
.el-card{
    position: relative;
    width: 500px;
    height: 300px;
    margin: 0 auto;
    .image{
        position: absolute;
        width: 80px;
        border-radius: 50%;
        background-color: yellowgreen;
       top: 0;
       left: 50%;
       z-index:999;
       transform: translate(-50%,-50%);
       
    }
}
.container{
    margin-top: 150px;
}
.demo-ruleForm{
    margin-top: 50px;
}
</style>