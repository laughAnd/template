<template>
  <div>
    <el-card shadow="hover" style="height:100% ;">
      <div class="Echarts">
        <div id="line" style="width: 98%;height:300px;"></div>
      </div>
    </el-card>
  </div>
</template>

<script>

  //折线图
  export default {
    name: 'vLine',
    methods: {
      myEchartsLine() {
        this.$api.dashboard.lineTotal().then((res) => {
          var myChart = this.$echarts.init(document.getElementById('line'));
          // 指定图表的配置项和数据
          var option = {
            color: ['#242f42', '#91c7ae'],
            title: {
              text: '上周发送短信总数趋势图',
              left: 'center'
            },
            tooltip: {
              trigger: 'axis'
            },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: res.data.xAxis
            },
            yAxis: {
              type: 'value'
            },
            series: [{
              data: res.data.series[0].data,
              type: 'line',
              areaStyle: {}
            }]
          };
          // 使用刚指定的配置项和数据显示图表。
          myChart.setOption(option);
        })
      },

      myEchartsLineTest() {

        var myChart = this.$echarts.init(document.getElementById('line'));
        // 指定图表的配置项和数据
        var option = {
          color: ['#242f42', '#91c7ae'],
          title: {
            text: 'Last Week Total Trend',
            left: 'center'
          },
          tooltip: {
            trigger: 'axis'
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line',
            areaStyle: {}
          }]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
      }

    },
    mounted() {
      //this.myEchartsLine();
       this.myEchartsLineTest(); //测试数据
      this.resizefun = () => {
        this.$echarts.init(document.getElementById("line")).resize();
      };
      window.addEventListener("resize", this.resizefun);
    },
    beforeDestroy() {
      window.removeEventListener("resize", this.resizefun);
      this.resizefun = null;
    },
  }




</script>