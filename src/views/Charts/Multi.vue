<template>
  <div>
    <el-card shadow="hover" style="height:100% ;">
      <div class="Echarts">
        <div id="multiLine" style="width: 98%;height:300px;"></div>
      </div>
    </el-card>
  </div>
</template>

<script>

  //复杂折线图
  export default {
    name: 'vMultiLine',
    methods: {

      myEchartsMultiLine() {
        this.$api.dashboard.line().then((res) => {
          res.data.series.forEach(item => {
            item.type = 'line';
            item.smooth = true
          })
          var myChart2 = this.$echarts.init(document.getElementById('multiLine'));
          // 指定图表的配置项和数据
          var option2 = {
            //color: ['#ff7c7c', '#32D3EB', '#60ACFC', '#feb64d', '#9287e7', '#5bc49f'],
            title: {
              text: '上周客户短信趋势图',
              left: 'left'
            },
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              data: res.data.legend,  //['FMC', 'TF', 'JTC', 'Bruker', 'EMC'],
              left: 'center',
              top: '0%'
            },
            grid: {
              top: '12%',
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            toolbox: {
              feature: {
                saveAsImage: {}
              }
            },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: res.data.xAxis,
            },
            yAxis: {
              type: 'value',
              splitLine: { //网格线
                show: false
              }
            },
            series: res.data.series,
          };

          // 使用刚指定的配置项和数据显示图表。
          myChart2.setOption(option2);
        });
      },

      //模拟数据
      myEchartsMultiLineTest() {
        // 基于准备好的dom，初始化echarts实例
        var myChart2 = this.$echarts.init(document.getElementById('multiLine'));

        // 指定图表的配置项和数据
        var option2 = {
          //color: ['#ff7c7c', '#32D3EB', '#60ACFC', '#feb64d', '#9287e7', '#5bc49f'],
          title: {
            text: 'Last Week Client Trend',
            left: 'left'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['Example1', 'Example2', 'Example3', 'Example4', 'Example5'],
            left: 'center',
          },
          grid: {
            top: '12%',
            left: '3%',
            right: '3%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          },
          yAxis: {
            type: 'value',
            splitLine: { //网格线
              show: false
            }
          },
          series: [
            {
              name: 'Example1',
              type: 'line',
              smooth: true,
              data: [1200, 832, 501, 934, 909, 1230, 1210]
            },
            {
              name: 'Example2',
              type: 'line',
              smooth: true,
              data: [720, 1082, 691, 1234, 890, 730, 610]
            },
            {
              name: 'Example3',
              type: 'line',
              smooth: true,
              data: [150, 232, 601, 954, 1000, 1330, 1710]
            },
            {
              name: 'Example4',
              type: 'line',
              smooth: true,
              data: [320, 332, 301, 334, 390, 330, 320]
            },
            {
              name: 'Example5',
              type: 'line',
              smooth: true,
              data: [820, 932, 901, 934, 1290, 1330, 1320]
            }
          ]
        };


        // 使用刚指定的配置项和数据显示图表。
        myChart2.setOption(option2);
      },
    },
    mounted() {
      this.myEchartsMultiLineTest(); //模拟数据
      //this.myEchartsMultiLine();
      this.resizefun = () => {
        this.$echarts.init(document.getElementById("multiLine")).resize();
      };
      window.addEventListener("resize", this.resizefun);
    },
    beforeDestroy() {
      window.removeEventListener("resize", this.resizefun);
      this.resizefun = null;
    },
  }




</script>