<template>
  <div>
    <el-card shadow="hover" style="height:100% ;">
      <div class="Echarts">
        <div id="bar" style="width: 98%;height:300px;"></div>
      </div>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'vBar',
    methods: {
      myEchartsBar() {
        this.$api.dashboard.bar().then((res) => {
          res.data.series.forEach(item => {
            item.type = 'bar';
            item.barWidth = '60%';
          })

          // Bar
          var myChart4 = this.$echarts.init(document.getElementById('bar'));

          // 指定图表的配置项和数据
          var option4 = {
            color: ['#ff7c7c', '#32D3EB', '#60ACFC', '#feb64d', '#9287e7', '#5bc49f'],
            title: {
              text: '客户短信总数图',
              left: 'left'
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            // legend: {
            //   data: res.data.legend
            // },
            xAxis: {
              data: res.data.xAxis,
            },
            yAxis: {},
            series: res.data.series
          };
          // 使用刚指定的配置项和数据显示图表。
          myChart4.setOption(option4);
        });
      },


      //测试数据
      myEchartsBarTest() {
        // Bar
        var myChart4 = this.$echarts.init(document.getElementById('bar'));

        // 指定图表的配置项和数据
        var option4 = {
          color: ['#ff7c7c', '#32D3EB', '#60ACFC', '#feb64d', '#9287e7', '#5bc49f'],
          title: {
            text: 'Total',
            left: 'left'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          legend: {
            data: ['Example1', 'Example2']
          },
          xAxis: {
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          },
          yAxis: {},
          series: [
            {
              name: 'Example1',
              type: 'bar',
              data: [5, 20, 36, 10, 10, 20, 24]
            },
            {
              name: 'Example2',
              type: 'bar',
              data: [5, 20, 36, 10, 10, 20, 32]
            }]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart4.setOption(option4);
      }
    },
    mounted() {
      //this.myEchartsBar();
      this.myEchartsBarTest();  //测试数据
      this.resizefun = () => {
        this.$echarts.init(document.getElementById("bar")).resize();
      };
      window.addEventListener("resize", this.resizefun);
    },
    beforeDestroy() {
      window.removeEventListener("resize", this.resizefun);
      this.resizefun = null;
    },
  }




</script>