<template>
  <div>
     <!-- 面包屑 -->
     <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
  <el-breadcrumb-item>参数列表</el-breadcrumb-item>
</el-breadcrumb>
<!-- card -->
<el-card>
    <el-row>
        <el-col>
            <el-alert
    title="只允许为三级分类添加参数"
    type="warning"
    show-icon>
  </el-alert>
        </el-col>
    </el-row>
    <el-row>
        <el-col :span="3">选择商品分类</el-col>
        <el-col :span="6">
            <el-cascader
    v-model="value"
    clearable
    :options="cateList"
    :props="props"
    @change="selectChange"
    ></el-cascader></el-col>
    </el-row>
    <!-- tabs -->
    <el-tabs 
    v-model="activeName"
    
     @tab-click="handleClick" >
    <el-tab-pane label="动态参数"  :disabled="isDisable" name="many">
        <el-button type="primary" @click="dialogVisible = true">
            动态参数
        </el-button>
        <el-table :data="manyVal" border stripe>
                <el-table-column type="expand" >
                    <template slot-scope="scope">
                        <el-tag
                    closable
                    v-for="(item,index) in scope.row.attr_vals"
                    :key="index"
                    @close="tagClose(tag)">
                    {{item}}
                    </el-tag>
                    <el-input
                   
                    v-if="isShow"
                    ref="saveTagInput"
                    size="small"
                    >
                    </el-input>
                <el-button v-else  size="small" @click="showInput">+ New Tag</el-button>
                    </template>
                   
                </el-table-column>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column 
                prop="attr_name"
                label="参数名称"
                width="480"
                ></el-table-column>
                <el-table-column
                label="操作"
                width="480"
                >
                <template solt-scope="scope">
                    <el-button type="primary" icon="el-icon-edit"  size="mini">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" >删除</el-button>
                </template>
                </el-table-column>
            </el-table>
    </el-tab-pane>
    <el-tab-pane label="静态属性" :disabled="isDisable" name="only">
        <el-button type="primary" @click="dialogVisible = true">添加属性</el-button>
        <el-table :data="onlyVal" border stripe>
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-tag
                    closable
                    v-for="(item,index) in scope.row.attr_vals"
                    :key="index"
                    @close="tagClose(tag)">
                    {{item}}
                    </el-tag>
                    <el-input
                    class="input-new-tag"
                    style="width:90px;"
                    ref="saveTagInput"
                    size="small"
                    >
                    </el-input>
                <el-button  class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
                    </template>
                   
                </el-table-column>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column 
                prop="attr_name"
                label="属性名称"
                width="180"
                ></el-table-column>
                <el-table-column
                label="操作"
                width="180"
                >
                <template solt-scope="scope">
                    <el-button type="primary" icon="el-icon-edit"  size="mini">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" >删除</el-button>
                </template>
                </el-table-column>
            </el-table>
    </el-tab-pane>
  </el-tabs>
</el-card>
<!-- dislog -->
<el-dialog
  :title="this.activeName === 'many'?'添加动态参数':'添加静态属性' "
  :visible.sync="dialogVisible"
  width="50%"
  @close="dialogClose"
  >
  <el-form  :model="ruleForm" :rules="asrules" ref="ruleForms" label-width="100px" class="demo-ruleForm">
  <el-form-item :label="this.activeName === 'many'?'动态参数':'静态属性'" prop="attr_name">
    <el-input v-model="ruleForm.attr_name"></el-input>
  </el-form-item>
 
</el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addParams">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
    data(){
        return {
            isShow:false,
            cateList:[],
            value:[],
            props:{
                expandTrigger: 'hover',
                label:'cat_name',
                value:'cat_id',
                children:'children',
            },
            activeName:'many',
            manyVal:[],
            onlyVal:[],
            dialogVisible:false,
            ruleForm:{},
            asrules:{
                attr_name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
            }
            
        }
       

    },
    computed:{
        isDisable(){
            return this.value.length === 3?false:true
        },
        selectId(){
            if(this.value.length === 3){
                return this.value[2]
            }else{
                return null
            }
        },
       
    },
    created(){
        this.getCateList()
    },
    methods:{
      async getCateList(){
            const {data:res} = await this.$http.get('categories')
            // console.log(res,'cate')
            if(res.meta.status!== 200){
                return this.$message.error('获取商品列表失败')
            }
            this.cateList = res.data
        },
        selectChange(){
            if(this.value.length!==3){
                this.value = []
                return this.$message.error('请选择三级分类')
            }
            // console.log(this.value)
           this.getSelectVal()
        },  
        handleClick(tab){
            // console.log(tab.name)
           this.getSelectVal()

        },
        async getSelectVal(){
            const {data:res} = await this.$http.get(`categories/${this.selectId}/attributes`,{
                params:{
                    sel:this.activeName
                }
            })
            if(res.meta.status!== 200){
                return this.$message.error('获取商品信息失败')
            }
            
            res.data.forEach(item=>{
                item.attr_vals = item.attr_vals.split(' ')

               
            })
            if(this.activeName === 'only'){
                this.onlyVal = res.data
            }else{
                this.manyVal = res.data
            }
            
            console.log(res,'selectRes')
        },
        dialogClose(){
            // console.log(this.$refs.ruleForms)
            this.$refs.ruleForms.resetFields()
           

        },
       async addParams(){
              const {data:res} = await  this.$http.post(`categories/${this.selectId}/attributes`,{
                    attr_name:this.ruleForm.attr_name,
                    attr_sel:this.activeName
                })
                // console.log(res,'addres')

                if(res.meta.status!== 201){
                return this.$message.error('添加失败')
            }
            this.$message.success('添加成功')
                this.getSelectVal()
            this.dialogVisible  = false
        },
        tagClose(){

        },
        showInput(){
            this.isShow = true
        }


    }
}   
</script>

<style>

</style>