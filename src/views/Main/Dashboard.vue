<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="16">
        <el-row :gutter="20" class="mgb20">
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{padding: '0px'}">
              <div class="grid-content grid-con-1">
                <i class="el-icon-s-data grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">{{numForm.total}}</div>
                  <div>Total</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{padding: '0px'}">
              <div class="grid-content grid-con-2">
                <i class="el-icon-check grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">{{numForm.rate}}</div>
                  <div>Success</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{padding: '0px'}">
              <div class="grid-content grid-con-3">
                <i class="el-icon-document-delete grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">{{numForm.fail}}</div>
                  <div>Failed</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <vMultiLine></vMultiLine>
          </el-col>
        </el-row>

      </el-col>
      <el-col :span="8">
        <vPie></vPie>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="12">
        <vBar></vBar>
      </el-col>
      <el-col :span="12">
        <vLine></vLine>
      </el-col>
    </el-row>
  </div>
</template>

<script>

  import vLine from "@/views/Charts/Line";
  import vMultiLine from "@/views/Charts/Multi";
  import vPie from "@/views/Charts/Pie";
  import vBar from "@/views/Charts/Bar";
  export default {
    components: {
      vLine,
      vMultiLine,
      vPie,
      vBar
    },
    name: 'dashboard',
    data() {
      return {
        name: sessionStorage.getItem('sms_user'),
        numForm: {
          total: 2301,
          rate: '100%',
          fail: 0
        }
      };
    },
    computed: {
      role() {
        return this.name === 'admin' ? '超级管理员' : '普通用户';
      }
    },
    methods: {
      showNum() {
        this.$api.dashboard.number().then((res) => {
          this.numForm.total = res.data.Total;
          this.numForm.rate = res.data.Rate;
          this.numForm.fail = res.data.Fail;
        })
      },
    },
    mounted() {
      //this.showNum();
    },
  };
</script>

<style scoped>
  .el-row {
    margin-bottom: 10px;
  }

  .grid-content {
    display: flex;
    align-items: center;
    height: 100px;
  }

  .grid-cont-right {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #999;
  }

  .grid-num {
    font-size: 30px;
    font-weight: bold;
  }

  .grid-con-icon {
    font-size: 50px;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    color: #fff;
  }

  .grid-con-1 .grid-con-icon {
    background: #91c7ae;
  }

  .grid-con-1 .grid-num {
    color: rgb(45, 140, 240);
  }

  .grid-con-2 .grid-con-icon {
    background: rgb(100, 213, 114);
  }

  .grid-con-2 .grid-num {
    color: rgb(45, 140, 240);
  }

  .grid-con-3 .grid-con-icon {
    background: #d48265;
  }

  .grid-con-3 .grid-num {
    color: rgb(242, 94, 67);
  }

  .user-info {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 2px solid #ccc;
    margin-bottom: 20px;
  }

  .user-avator {
    width: 120px;
    height: 120px;
    border-radius: 50%;
  }

  .user-info-cont {
    padding-left: 50px;
    flex: 1;
    font-size: 14px;
    color: #999;
  }

  .user-info-cont div:first-child {
    font-size: 30px;
    color: #222;
  }

  .user-info-list {
    font-size: 14px;
    color: #999;
    line-height: 25px;
  }

  .user-info-list span {
    margin-left: 70px;
  }

  .mgb20 {
    margin-bottom: 20px;
  }

  .todo-item {
    font-size: 14px;
  }

  .todo-item-del {
    text-decoration: line-through;
    color: #999;
  }

  .schart {
    width: 100%;
    height: 300px;
  }
</style>