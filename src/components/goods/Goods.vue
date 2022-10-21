<template>
<div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
  <el-breadcrumb-item>商品列表</el-breadcrumb-item>
</el-breadcrumb>
<!-- card -->
<el-card>
    <el-row>
        <el-col :span="6">
            <el-input @clear="searchGoods" clearable placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="searchGoods"></el-button>
        </el-input>

        </el-col>
        <el-col :span="2" style="margin-left:20px;">
        <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
    </el-row>
    <!-- table -->
    <el-table
    :data="goods_list"
    stripe
    border
    style="width: 100%">
    <el-table-column
      type="index"
      label="#"
      >
    </el-table-column>
    <el-table-column
      prop="goods_name"
      label="商品名称"
      width="180">
    </el-table-column>
    <el-table-column
      prop="goods_price"
      label="商品价格"
      width="180">
    </el-table-column>
    <el-table-column
      prop="goods_weight"
      label="商品重量">
    </el-table-column>
    <el-table-column
      prop="add_time"
      label="创建时间">
    </el-table-column>
    <el-table-column
      label="操作">
      <template slot-scope="scope">
        <el-button type="primary" icon="el-icon-edit"></el-button>
        <el-button type="danger" icon="el-icon-delete" @click="deleteGoods(scope.row)"></el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- page -->
  <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
</el-card>
</div>
</template>
<script>
export default{
    data(){
        return {
            goods_list:[],
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:5
            },
            total:0
        }
    },
    created(){
        this.getGoodsList()
    },
    methods:{
      async  getGoodsList(){
          const {data:res} = await  this.$http.get('goods',{
                params:this.queryInfo
            })
            if(res.meta.status!==200){
                return this.$message.error('获取商品列表失败')
            }
            res.data.goods.forEach(item=>{
                item.add_time = item.add_time +'dd'
            })
            this.goods_list = res.data.goods
            this.total = res.data.total
            console.log(res,'goods_list')
        },
        handleSizeChange(pagesize){
            this.queryInfo.pagesize = pagesize
            this.getGoodsList()

        },
        handleCurrentChange(pagenum){
            this.queryInfo.pagenum =pagenum
            this.getGoodsList()


        },
        goAddPage(){
            this.$router.push('/goods/add')
        },
        searchGoods(){
            this.getGoodsList()
        },
      async  deleteGoods(data){
           const res = await this.$messageBox('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
        if(res === 'confirm'){
           const {data:res} = await this.$http.delete(`goods/${data.goods_id}`)
           if(res.meta.status!== 200){
            return this.$message.error('删除失败')
           }
           this.getGoodsList()
              this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }
        console.log(res,'del')
        // .then(() => {
        //     this.$http.delete(`goods/${data.goods_id}`)
        //   this.$message({
        //     type: 'success',
        //     message: '删除成功!'
        //   });
        // })
        }
    }
}
</script>
<style>
</style>