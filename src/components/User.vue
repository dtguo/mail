<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>用户管理</el-breadcrumb-item>
  <el-breadcrumb-item>用户列表</el-breadcrumb-item>
</el-breadcrumb>
<!-- 卡片 -->
<el-card class="box-card">
    <!-- 搜索条 -->
  <el-row>
    <el-col :span="8">
        <el-input placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select">
    <el-button slot="append" icon="el-icon-search" @click="searchInfo"></el-button>
  </el-input>
    </el-col>
    <el-col :span="3">
    <el-button type="primary" style="margin-left:20px;" @click="dialogVisible = true">添加用户</el-button>

    </el-col>
  </el-row>
  <!-- 表格 -->
  <el-table
    :data="userTableData"
    stripe
    border
    style="width: 100%">
    <el-table-column
      type="index"
      >
    </el-table-column>
    <el-table-column
      prop="id"
      label="ID"
      width="100"
      >
    </el-table-column>
    <el-table-column
      prop="email"
      label="邮箱"
     >
    </el-table-column>
    <el-table-column
      prop="username"
      label="用户名">
    </el-table-column>
    <el-table-column
      prop="create_time"
      label="create_time">
    </el-table-column>
    <el-table-column   
      label="状态">
      <template slot-scope="scope">
        <el-switch
  v-model="scope.row.mg_state"
  active-color="#13ce66"
  @change="changeStatus(scope.row)"
  inactive-color="#ff4949" >
</el-switch>
      </template>
    </el-table-column>
    <el-table-column
      label="操作">
      <template slot-scope="scope">
        <div>
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="editUser(scope.row)"></el-button>
            <el-button type="primary" size="mini" icon="el-icon-delete" @click="userDel(scope.row)"></el-button>
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
                <el-button type="primary" size="mini" icon="el-icon-s-tools"></el-button>
    </el-tooltip>
        </div>
      </template>
    </el-table-column>
  </el-table>
  <!-- 翻页器 -->
  <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 3, 4]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
</el-card>
<!-- dialog -->
<el-dialog
  title="添加用户"
  :visible.sync="dialogVisible"
  width="50%"
  >
 
  <el-form :model="userForm" :rules="userRules" ref="userForm" label-width="100px" class="demo-ruleForm">
  <el-form-item label="用户名" prop="username">
    <el-input v-model="userForm.username"></el-input>
  </el-form-item>
  <el-form-item label="密码" prop="password">
    <el-input type="password" v-model="userForm.password"></el-input>
  </el-form-item>
  <el-form-item label="邮箱" prop="email">
    <el-input v-model="userForm.email"></el-input>
  </el-form-item>
  <el-form-item label="手机" prop="mobile">
    <el-input v-model="userForm.mobile"></el-input>
  </el-form-item>
  
 
</el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="canceDl">取 消</el-button>
    <el-button type="primary" @click="commitDl">确 定</el-button>
  </span>
</el-dialog>
<!-- 删除 -->
<el-dialog
  title="提示"
  :visible.sync="dialogVisibleDel"
  width="50%"
  >
  <span>此操作将永久删除该用户，是否继续</span>
  <span slot="footer" class="dialog-footer">
    <el-button @click="cancelDel">取 消</el-button>
    <el-button type="primary" @click="doneDel">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
    data(){
        return {
            // 取消删除
            dialogVisibleDel:false,
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:4
            },
            userTableData:[],
            // page
            total:1,
            dialogVisible:false,
            // form
            userForm:{
                username:'',
                password:'',
                email:'',
                mobile:'',
                id:''
            },
            userRules:{
                username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 15, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
                password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 3, max: 15, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
                email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { min: 3, max: 15, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: '请输入电话', trigger: 'blur' },
            { min: 3, max: 15, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
            },
            edit:false,
            delData:[]
        }
        
    },
    created(){
        this.getUserInof()
},
methods: {
   async getUserInof(){
      const {data:res} =  await this.$http.get('users',{
            params:this.queryInfo
        })
        if(res.meta.status!==200){
            return this.$message.error('用户列表获取失败')
        }
        this.total = res.data.total
        this.userTableData = res.data.users
        console.log(res,'user')
    },
    searchInfo(){
        this.getUserInof()
    },
    // pageSize改变
    handleSizeChange(size){
        console.log(size,'pagesizes')
        this.queryInfo.pagesize = size
        this.getUserInof()

    },
    // pageNum改变
    handleCurrentChange(num){
        this.queryInfo.pagenum = num
        this.getUserInof()

    },
    // 改变状态
   async changeStatus(data){
        // const change = !data.mg_state
    // console.log(change,'mg_state')

       const res = await this.$http.put(`users/${data.id}/state/${data.mg_state}`)
    //    console.log(res)
       if(res.status!==200){
            return this.$message.error('更改状态失败')
        }
    //    this.getUserInof()
       this.$message.success('更改状态成功')
    },
    canceDl(){
        this.dialogVisible = false
        this.$refs.userForm.resetFields();
    },
    commitDl(){
        this.$refs.userForm.validate(async vali =>{
            if(!vali){
                return this.message.error('请输入正确用户信息')
            }
            console.log(this.edit)
            if(this.edit){
                const res = await this.$http.put(`users/${this.userForm.id}`,{
                email:this.userForm.email,
                mobile:this.userForm.mobile
        })
        if(res.status!==200){
            return this.message.error('修改失败')
        }
        this.getUserInof()
        this.edit = false
        this.dialogVisible = false
        console.log(res,'edit')
            }else{
                const res = await  this.$http.post('users',this.userForm)
          if(res.status!== 200){
            return this.message.error('添加用户失败')

          }
        //   console.log(res,'adduser')
          this.getUserInof()
          this.dialogVisible = false

            }
          
        })
    },
  async  editUser(data){
        this.dialogVisible = true
        this.userForm.username = data.username
        this.userForm.email = data.email
        this.userForm.mobile = data.mobile
        this.userForm.id = data.id
        this.edit = true
     
    },
    // 取消删除
    cancelDel(){
        this.dialogVisibleDel = false
        this.$message('取消删除');
    },
    userDel(data){
        this.dialogVisibleDel = true
        this.delData = data
    },
    // 确定删除
   async doneDel(){
      const res = await  this.$http.delete(`users/${this.delData.id}`)
      if(res.status!== 200){
        return this.$message.error('删除失败')
      }
      console.log(res,'delres')
      this.$message.success('删除成功')
        this.dialogVisibleDel = false
        this.getUserInof()
    }
},
}
</script>

<style>

</style>