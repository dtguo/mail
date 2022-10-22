<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>订单管理</el-breadcrumb-item>
  <el-breadcrumb-item>订单列表</el-breadcrumb-item>
</el-breadcrumb>
<!-- card -->
<el-card>
    <el-row>
        <el-col :span="8">
            <el-input placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select">
   
   <el-button slot="append" icon="el-icon-search" @click="searchOrder"></el-button>
 </el-input>
        </el-col>
    </el-row>
    
  <el-table
    :data="tableData"
    stripe
    border
    style="width: 100%">
    <el-table-column
      type="index"
      label="#"
      >
    </el-table-column>
    <el-table-column
      prop="order_number"
      label="订单编号"
      width="180">
    </el-table-column>
    <el-table-column
      prop="order_price"
      label="订单价格"
      width="180">
    </el-table-column>
    <el-table-column
      
      label="是否付款">
      <template slot-scope="scope">
        <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>

            <el-tag type="danger" v-else>未付款</el-tag>
      </template>
    </el-table-column>
    <el-table-column
      prop="is_send"
      label="是否发货"
      width="180">
    </el-table-column>
    <el-table-column
      prop="create_time"
      label="下单时间"
      width="180">
    </el-table-column>
    <el-table-column
      
      label="操作">
      <template slot-scope="scope">
        <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
        <el-button type="primary" size="mini" icon="el-icon-location" @click="getTimeLine(scope.row)"></el-button>
      </template>
    </el-table-column>
  </el-table>
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
<!-- dialog -->
<el-dialog
  title="提示"
  :visible.sync="dialogVisible"
  width="50%"
  >
  <el-timeline>
    <el-timeline-item
      v-for="(activity, index) in activities"
      :key="index"
      :icon="activity.icon"
      :type="activity.type"
      :color="activity.color"
      :size="activity.size"
      :timestamp="activity.timestamp">
      {{activity.content}}
    </el-timeline-item>
  </el-timeline>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
    data(){
        return {
            dialogVisible:false,
            activities: [{
          content: '支持使用图标',
          timestamp: '2018-04-12 20:46',
          size: 'large',
          type: 'primary',
          icon: 'el-icon-more'
        }, {
          content: '支持自定义颜色',
          timestamp: '2018-04-03 20:46',
          color: '#0bbd87'
        }, {
          content: '支持自定义尺寸',
          timestamp: '2018-04-03 20:46',
          size: 'large'
        }, {
          content: '默认样式的节点',
          timestamp: '2018-04-03 20:46'
        }],
            tableData:[],
            queryInfo:{
                query:'',
                pagenum:1 ,
                pagesize :5 
            },
            total:0,
            timeLine:[]
        }
    },
    created(){
        this.getOrderInfo()
    },
    methods:{
       async getOrderInfo(){
          const {data:res} = await  this.$http.get('orders',{
                params:this.queryInfo
            })
            console.log(res,'orderlist')
            if(res.meta.status!== 200){
                return this.$message.error('获取订单列表失败')
            }
            this.tableData = res.data.goods
            this.total = res.data.total
        },
        searchOrder(){
            console.log('dddd')
            this.getOrderInfo()
        },
        handleSizeChange(pagesize){
            this.queryInfo.pagesize = pagesize
            this.getOrderInfo()
        },
        handleCurrentChange(pagenum){
            this.queryInfo.pagenum = pagenum
            this.getOrderInfo()
        },
       getTimeLine(row){
            this.dialogVisible = true
            
        }
    }
}
</script>

<style>

</style>