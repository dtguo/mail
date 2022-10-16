<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>权限管理</el-breadcrumb-item>
  <el-breadcrumb-item>角色列表</el-breadcrumb-item>
 
</el-breadcrumb>
<!-- card -->
<el-card>
    <el-button type="primary">添加角色</el-button>
    <!-- table -->
    <el-card class="box-card">
    <el-table
    :data="rolesData"
    stripe
    border
    style="width: 100%">
    <el-table-column
     type="expand"
      >
      <template slot-scope="scope">
        <el-row v-for="role1 in scope.row.children" :key="role1.id">
            <!-- 一级权限 -->
            <el-col :span="5">
                <el-tag closable @close="removeRole(scope.row,role1.id)">
                    {{role1.authName}}
                    <!-- {{role1.children}} -->
                </el-tag>
                <i class="el-icon-caret-right"></i>
            </el-col>
            <!-- 二三级权限 -->
            <el-col  :span="19">
                <el-row  v-for="role2 in role1.children" :key="role2.id">
                    <!-- 二级 -->
                    <el-col :span="6" >
                        <el-tag closable=""  type="success" @close="removeRole(scope.row,role2.id)">
                            {{role2.authName}}
                        </el-tag>
                        <i class="el-icon-caret-right"></i>
                    </el-col>
                    <!-- 三级 -->
                    <el-col :span="18" >
                        <el-tag closable v-for="role3 in role2.children" :key="role3.id" @close="removeRole(scope.row,role3.id)">
                            {{role3.authName}}
                        </el-tag>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
            
            <!-- <pre>{{scope.row}}</pre> -->
       
      </template>
    </el-table-column>
    <el-table-column
     type="index"
     label="#"
      >
    </el-table-column>
    <el-table-column
      prop="id"
      label="ID"
      width="100"
      >
    </el-table-column>
    <el-table-column
      prop="roleDesc"
      width="100"

      label="权限名称"
      >
    </el-table-column>
    <el-table-column
      prop="roleName"
      label="权限级别"
      >
    </el-table-column>
    <el-table-column
     
      label="操作"
      >
      <template slot-scope="scope">
        <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
<el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
<el-button type="warning" size="mini" icon="el-icon-setting" @click="showChangeDialog(scope.row)">分配权限</el-button>
      </template>
    </el-table-column>
  
  </el-table>
</el-card>
</el-card>
<!-- 分配权限 -->
<el-dialog
  title="分配权限"
  :visible.sync="dialogVisible"
  width="50%"
  @close="checkKey=[]"
  >
  <el-tree
  :data="rightTree"
  show-checkbox
  node-key="id"
  ref="tree"
  :default-checked-keys="checkKey"
  default-expand-all
  :props="treeProps">
</el-tree>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="commitF">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
    data(){
        return {
            rolesData:[],
            dialogVisible:false,
            rightTree:[],
            treeProps:{
                children:'children',
                label:'authName'
            },
            checkKey:[],
            roleId:''
        }
    },
    created(){
        this.getRolesData()
    },
    methods:{
        async getRolesData(){
           const {data:res} = await this.$http.get('roles')
           if(res.meta.status!==200){
                return this.$message.error('获取权限列表失败')
           }
           this.rolesData = res.data
        //    console.log(res,'rolesData')
        },
       async removeRole(role,right){

       const confirm = await this.$messageBox('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        console.log(confirm,'confirm')
        if(confirm !== 'confirm'){
            return this.$message.info('取消删除')
        }
          const {data:res} = await  this.$http.delete(`roles/${role.id}/rights/${right}`)
          console.log(res,'removerole')
          if(res.meta.status!==200){
            return this.$message.error('删除失败')
          }
          role.children = res.data
        },
        // 分配权限
       async showChangeDialog(data){
         const {data:res} =   await this.$http.get('rights/tree')
         if(res.meta.status !== 200){
            return this.$message.error('获取权限列表失败')
         }
         this.roleId = data.id
         this.rightTree = res.data
        //  console.log(data,'data')
            this.getCheckArr(data,this.checkKey)
            this.dialogVisible = true
        },
        // 循环权限数组
        getCheckArr(node,arr){
            if(!node.children){
                return arr.push(node.id)
            }
            node.children.forEach((item)=>{
                this.getCheckArr(item,arr)
            })
        },
        // 提交权限分配
       async commitF(){
            const keys = [
            ...this.$refs.tree.getCheckedKeys(),
            ...this.$refs.tree.getHalfCheckedKeys(),
            ]
            const strKeys = keys.join(',')
            const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:strKeys})
            if(res.meta.status !== 200){
            return this.$message.error('更新权限失败')
         }
         this.getRolesData()
           this.dialogVisible = false
        }
        
    }
}
</script>

<style scoped>
.el-tag{
    margin-top: 20px;
    
}
.el-row{
    border-bottom:1px solid gray;
    display: flex;
    align-items: center;
}
</style>