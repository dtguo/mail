<template>
  <div>
     <!-- 面包屑 -->
     <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
  <el-breadcrumb-item>商品分类</el-breadcrumb-item>
</el-breadcrumb>
<!-- 卡片视图 -->
<el-card>
    <el-row>
        <el-col>
            <el-button type="primary" @click="addCate">添加分类</el-button>
        </el-col>
    </el-row>
    <!-- zktable -->
    <zk-table
      ref="zkTable"
      show-index
      index-text="#"
      :data="cateList"
      :columns="columns"
      stripe
      border
      :selection-type="false"
      children-prop="children"
      :expand-type="false"
     >
     <template slot="sort" scope="scope">
        <!-- {{scope.row.cat_level}} -->
        <i class="el-icon-success " v-if="!scope.row.cat_deleted"></i>
        <i class="el-icon-error " v-else></i>
     </template>
     <template slot="delete" scope="scope">
        <!-- {{scope.row.cat_level}} -->
            <el-tag type="success" v-if="scope.row.cat_level ===0">一级</el-tag>
            <el-tag type="warning" v-else-if="scope.row.cat_level ===1">二级</el-tag>
            <el-tag type="danger" v-else>三级</el-tag>
     </template>
     <template slot="edit" scope="scope">
        <!-- {{scope.row.cat_level}} -->
        <el-button type="primary" icon="el-icon-edit" ></el-button>
 
        <el-button type="danger" icon="el-icon-delete" ></el-button>
     </template>
    </zk-table>
    <!-- page -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="5"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
</el-card>
<!-- dialog -->
<el-dialog
  title="添加分类"
  :visible.sync="dialogVisible"
  width="50%"
  >
  <el-form :model="cateRuleForm" :rules="cateRules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
  <el-form-item label="分类名称">
    <el-input v-model="cateRuleForm.cat_name"></el-input>
  </el-form-item>
  <el-form-item label="父级分类">
    <el-cascader
    v-model="fValue"
    :options="cateList2"
    clearable
    :props="props"
    @change="selectChange"
   ></el-cascader>
  </el-form-item>
</el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCateForm">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
    data(){
        return {
            cateList:[],
            cateList2:[],
            queryInfo:{
                type:3,
                pagenum:1,
                pagesize:5
            },
            total:0,
        columns: [
         
          {
            label: '分类名称',
            prop: 'cat_name',
            width: '200px',
          },
         
          {
            label: '是否有效',
            prop: 'cat_level',
            minWidth: '200px',
            type: 'template',
            template: 'sort',
          },
          {
            label: '排序',
            prop: 'cat_level',
            minWidth: '200px',
            type: 'template',
            template: 'delete',
          },
          {
            label: '操作',
            prop: 'cat_level',
            minWidth: '200px',
            type: 'template',
            template: 'edit',
          },
        ],
        dialogVisible:false,
        cateRuleForm:{
            cat_name:'',
            cat_pid:0,
            cat_leave:0
        },
        cateRules:{
            cateName: [
            { required: true, message: '请输入分类名称', trigger: 'blur' },
            // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
           
        },
        fValue:[],
        props:{
            expandTrigger: 'hover',
            label:'cat_name',
            value:'cat_pid',
            children:'children',
            
        }
        }
    },
    created(){
        this.getCateList()
    },
    methods:{
      async getCateList(){
            const {data:res} = await this.$http.get('categories',{
                params:this.queryInfo
            })
            // console.log(res,'cate')
            if(res.meta.status!== 200){
                return this.$message.error('获取商品列表失败')
            }
            this.cateList = res.data.result
            this.total = res.data.total
        },
        handleSizeChange(pagesize){
            this.queryInfo.pagesize = pagesize
            this.getCateList()
        },
        handleCurrentChange(pagenum){
            this.queryInfo.pagenum = pagenum
            this.getCateList()
        },
       async addCate(){
            this.dialogVisible = true
            const {data:res} = await this.$http.get('categories',{
                params:{type:2}
            })
            // console.log(res,'cate2')
            if(res.meta.status!== 200){
                return this.$message.error('获取商品列表失败')
            }
            this.cateList2 = res.data
        },
        // 修改级联选择器选项
        selectChange(){
            if(this.fValue.length>0){
                // console.log(this.fValue[this.fValue.length -1],'len-1')
                this.cateRuleForm.cat_pid = this.fValue[this.fValue.length -1]
                this.cateRuleForm.cat_leave = this.fValue.length
            
                return
            }else{
                this.cateRuleForm.cat_pid = 0
                this.cateRuleForm.cat_leave = 0
                return
            }

        },
       async addCateForm(){
        // console.log(this.cateRuleForm,this.fValue,'cateForm,fValue')
            const {data:res} = await this.$http.post('categories',this.cateRuleForm)
            // console.log(res,'addform')
            if(res.meta.status!== 201){
                return this.$message.error('获取商品列表失败')
            }
            this.$message.success('添加商品分类成功')
            this.dialogVisible = false
        }
    }
}
</script>

<style>
.el-icon-success{
    color: aqua;
}
.el-cascader{
    width: 100%;
}
</style>