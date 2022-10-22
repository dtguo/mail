<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>订单管理</el-breadcrumb-item>
  <el-breadcrumb-item>订单列表</el-breadcrumb-item>
</el-breadcrumb>
<!-- card -->
<el-card>
    <div id="main" style="width: 600px;height:400px;">
    </div>
</el-card>
    </div>
</template>

<script>
import _ from 'lodash'
import * as echarts from 'echarts'
export default {
    data(){
        return {
            option:{
			  title: {
				  text: 'ECharts 入门示例'
			  },
			  tooltip: {},
			  legend: {
				  data:['销量']
			  },
			  xAxis: {
				  data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
			  },
			  yAxis: {},
			  series: [{
				  name: '销量',
				  type: 'bar',
				  data: [5, 20, 36, 10, 10, 20]
			  }]
		  }
        }
    },
    async mounted(){
        const {data:res} = await this.$http.get('reports/type/1')
           console.log(res,'rep')
        //    this.option = res.data
        var myChart = echarts.init(document.getElementById('main'));
       const merge = _.merge(res.data,this.option)
        myChart.setOption(merge);
    },
   
}
</script>

<style>

</style>