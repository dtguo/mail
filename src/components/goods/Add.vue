<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
  <el-breadcrumb-item>添加商品</el-breadcrumb-item>
</el-breadcrumb>
<!-- card -->
<el-card>
    <el-row>
    <el-alert
    center
    title="添加商品信息"
    :closable="false"
    type="info"
    show-icon>
  </el-alert>
    </el-row>
    <!-- step -->
    <el-steps align-center :space="200" :active="activeIndex" finish-status="success">
  <el-step title="基本信息"></el-step>
  <el-step title="商品参数"></el-step>
  <el-step title="商品属性"></el-step>
  <el-step title="商品图片"></el-step>
  <el-step title="商品内容"></el-step>
  <el-step title="完成"></el-step>
</el-steps>
<!-- 标签页 -->
<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="top" label-width="100px" class="demo-ruleForm">
<el-tabs tab-position="left" :before-leave="beforeTabLeave" refs="elTabs" @tab-click="tabClick">
    <el-tab-pane label="基本信息">
        <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="ruleForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
            <el-input type="number" v-model="ruleForm.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
            <el-input type="number" v-model="ruleForm.goods_weight"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
            <el-input type="number" v-model="ruleForm.goods_number"></el-input>
        </el-form-item>
        <el-form-item label="商品分类">
        <el-cascader
    v-model="ruleForm.goods_cat"
    :options="cateList"
    :props="props"
    clearable
    @change="handleChange"></el-cascader>
        </el-form-item>
    </el-tab-pane>
    <el-tab-pane label="商品参数">
        <el-form-item v-for="item in ruleForm.goods_attr" :key="item.attr_id" :label="item.attr_name" prop="goods_name">
            <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox v-for="(valitem,index) in item.attr_vals" :label="valitem" :key="index">{{valitem}}</el-checkbox>
            </el-checkbox-group>
        </el-form-item>
    </el-tab-pane>
    <el-tab-pane label="商品属性">
        <el-form-item v-for="item in onlyTableData" :key="item.attr_id" :label="item.attr_name">
            <el-input v-model="item.attr_vals"></el-input>
        </el-form-item>
    </el-tab-pane>
    <el-tab-pane label="商品图片">
        <el-upload
  class="upload-demo"
  action="http://127.0.0.1:8888/api/private/v1/upload"
  :on-preview="handlePreview"
  :on-remove="handleRemove"
  :headers="headerObj"
  :on-success="uploadSuccess"
  list-type="picture">
  <el-button size="small" type="primary">点击上传</el-button>
</el-upload>
    </el-tab-pane>
    <el-tab-pane label="商品内容">
        <quillEditor v-model="ruleForm.goods_introduce"></quillEditor>
        <el-button type="primary" @click="add">添加商品</el-button>
    </el-tab-pane>
  </el-tabs>
</el-form>
</el-card>
<!-- dialog -->
<el-dialog
  title="预览图片"
  :visible.sync="dialogVisible"
  width="50%"
 >
  <el-image :src="priviewPath"></el-image>
</el-dialog>
  </div>
</template>

<script>
import { quillEditor } from 'vue-quill-editor'
import _ from 'lodash'
export default {
    components:{
        quillEditor
    },
    data(){
        return {
            activeIndex:0,
            ruleForm:{
                goods_name:'',
                goods_weight:0,
                goods_number:0,
                goods_price:0,
                goods_cat:[1,3,6],
                goods_attr:[],
                pics:[],
                goods_introduce:'',
                attrs:[]
            },
            onlyTableData:[],
            rules:{
                goods_name:[
                    { required: true, message: '请输入商品名称', trigger: 'blur' },
                ],
                goods_price:[
                    { required: true, message: '请输入商品价格', trigger: 'blur' },
                ],
                goods_weight:[
                    { required: true, message: '请输入商品重量', trigger: 'blur' },
                ],
                goods_number:[
                    { required: true, message: '请输入商品数量', trigger: 'blur' },
                ],
            },
            cateList:[],
            props:{
                expandTrigger: 'hover' ,
                children:'children',
                label:'cat_name',
                value:'cat_id'
            },
            headerObj:{
                'Authorization': window.sessionStorage.getItem('token')
            },
            priviewPath:'',
            dialogVisible:false,
        }
    },
    created(){
        this.getCateList()
    },
    methods:{
       async tabClick(){
            if(this.activeIndex === 1){
              const {data:res} =  await this.$http.get(`categories/${this.ruleForm.goods_cat[2]}/attributes`,{
                    params:{
                        sel:'many'
                    }
                })
                if(res.meta.status!== 200){
                return this.$message.error('获取商品属性失败')
            }
            res.data.forEach(item=>{
                if(item.attr_vals!== ' '){
                    item.attr_vals =   item.attr_vals.split(' ')
                }else{
                    item.attr_vals =[]
                }
            })
            this.ruleForm.goods_attr = res.data
                // console.log(res,'tabclick')
            }
            if(this.activeIndex === 2){
              const {data:res} =  await this.$http.get(`categories/${this.ruleForm.goods_cat[2]}/attributes`,{
                    params:{
                        sel:'only'
                    }
                })
                if(res.meta.status!== 200){
                return this.$message.error('获取商品属性失败')
            }
            // res.data.forEach(item=>{
            //     if(item.attr_vals!== ' '){
            //         item.attr_vals =   item.attr_vals.split(' ')
            //     }else{
            //         item.attr_vals =[]
            //     }
            // })
            this.onlyTableData = res.data
                console.log(res,'onlyTab')
            }
        },
        async getCateList(){
            const {data:res} = await this.$http.get('categories')
            // console.log(res,'cate')
            if(res.meta.status!== 200){
                return this.$message.error('获取商品列表失败')
            }
            this.cateList = res.data
        },
        handleChange(){},
        beforeTabLeave(activeName, oldActiveName){
            // console.log(activeName, oldActiveName)
            if(oldActiveName === '0' && this.ruleForm.goods_cat.length !== 3){
                 this.$message.error('请选择商品分类')
                 return false
            }
            this.activeIndex = +activeName

        },
        handlePreview(res){
            this.dialogVisible = true
           this.priviewPath =  res.response.data.url
            console.log(res,'pre')
        },
        handleRemove(removeFile){
            const path = removeFile.pic
          const index =   this.ruleForm.pics.indexOf(path)
            this.ruleForm.pics.splice(index,1)
            // console.log(this.ruleForm.pics,'removeFile')

        },
        uploadSuccess(res){
            // console.log(res,'upload')
            const picPath = {"pic":res.data.tmp_path}
            this.ruleForm.pics.push(picPath)
        },
      async  add(){
          const cloneData =   _.cloneDeep(this.ruleForm)
          cloneData.goods_cat = cloneData.goods_cat.join(',')
        //   attrs处理
            cloneData.goods_attr.forEach(item=>{
                cloneData.attrs.push({
                "attr_id":item.attr_id,
                "attr_value":item.attr_vals.join(' ')
            })
        })
            this.onlyTableData.forEach(item=>{
                cloneData.attrs.push({
                "attr_id":item.attr_id,
                "attr_value":item.attr_vals
            })
            })
          const {data:res} = await  this.$http.post('goods',cloneData)
          if(res.meta.status!== 201){
            return this.$message.error('添加商品失败')
          }
          this.$message.success('添加商品成功')
        this.$router.push('/goods')
            // console.log(cloneData,res,'cd')

        }

    }
}
</script>

<style>
.el-steps{
    margin-top: 20px;
}
.el-tabs{
    margin-top: 20px;
}
.el-cascader{
    width: 20%;
}
.el-checkbox{
    border:1px solid #bfa;
    padding: 0 10px;
}
.ql-editor{
    height: 300px;
}
</style>