<template>
  <div>
    <el-card shadow="hover" style="height:100% ;">
      <div class="Echarts">
        <div id="pie" style="width: 98%;height:420px;"></div>
      </div>
    </el-card>
  </div>
</template>

<script>

  export default {
    name: 'vPie',
    methods: {
      myEchartsPieTest() {
        // Pie
        var myChart3 = this.$echarts.init(document.getElementById('pie'));

        var option3 = {
          title: {
            text: 'Client Percentage',
            left: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: 'top',
            data: ['Example1', 'Example2', 'Example3', 'Example4', 'Example5']
          },
          series: [
            {
              name: '比例',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: 
              [
                { value: 335, name: 'Example1' },
                { value: 310, name: 'Example2' },
                { value: 234, name: 'Example3' },
                { value: 135, name: 'Example4' },
                { value: 848, name: 'Example5' }
              ],
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart3.setOption(option3);
      },


      myEchartsPie() {
        this.$api.dashboard.pie().then((res) => {
          // Pie
          var myChart3 = this.$echarts.init(document.getElementById('pie'));

          var option3 = {
            title: {
              text: '客户短信占比图',
              left: 'center'
            },
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: {
              orient: 'vertical',
              left: 'top',
              data: res.data.legend
            },
            series: [
              {
                name: '比例',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: res.data.series,
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          };

          // 使用刚指定的配置项和数据显示图表。
          myChart3.setOption(option3);

        })
      },
    },
    mounted() {
      //this.myEchartsPie();
      this.myEchartsPieTest();  //测试数据
      this.resizefun = () => {
        this.$echarts.init(document.getElementById("pie")).resize();
      };
      window.addEventListener("resize", this.resizefun);
    },
    beforeDestroy() {
      window.removeEventListener("resize", this.resizefun);
      this.resizefun = null;
    },

  }




</script>