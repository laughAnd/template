<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator-class="el-icon-arrow-right" style="padding-left: 10px;">
        <el-breadcrumb-item>
          <i class="el-icon-date"></i> 系统设置
        </el-breadcrumb-item>
        <el-breadcrumb-item>系统日志</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="query.name" placeholder="" size="small" class="handle-input mr10"
          @keyup.enter.native="findPage(null)">
        </el-input>
        <el-date-picker v-model="dateRange" type="daterange" size="small" align="right" unlink-panels
          range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
        <!-- <el-button type="primary" icon="el-icon-search" @click="findPage(null)" size="small">搜索</el-button> -->
        <jtc-button icon="fa fa-search" label="查询" perms="sys:log:view" type="primary" @click="findPage(null)" />
      </div>

      <!--表格内容栏-->
      <JTCTable :data="pageResult" :columns="columns" @findPage="findPage" @handleDelete="handleDelete">
      </JTCTable>
    </div>

  </div>
</template>

<script>
  import JTCTable from "@/views/Core/JTCTable";
  import JtcButton from "@/views/Core/JtcButton";
  import { format } from "@/utils/datetime";

  export default {
    components: {
      JTCTable,
      JtcButton
    },
    name: 'basetable',
    data() {
      return {
        columns: [
          // { prop: "F_ID", label: "ID", minWidth: 180 },
          { prop: "F_UserName", label: "用户", minWidth: 120 },
          { prop: "F_Operation", label: "请求url", minWidth: 120, showTips: true },
          { prop: "F_Url", label: "请求url", minWidth: 120, showTips: true },
          { prop: "F_Params", label: "参数", minWidth: 120, showTips: true },
          { prop: "F_IP", label: "IP", minWidth: 120 },
          { prop: "F_CreateTime", label: "创建日期", minWidth: 150, sortable: "true", formatter: this.dateFormat }
        ],
        pageRequest: { pageIndex: 1, pageSize: 10, Total: 0, search: '', orderField: '', start: '', end: '' },
        pageResult: {},
        query: {
          name: ""
        },
        operation: false, // true:新增, false:编辑
        editDialogVisible: false, // 新增编辑界面是否显示
        editLoading: false,
        dateRange: ''
      };
    },
    methods: {
      findPage: function (data) {
        if (data != null && data.pageRequest !== null && data.pageRequest !== undefined) {
          this.pageRequest = data.pageRequest
        }
        this.pageRequest.search = this.query.name;
        if (this.dateRange != "" && this.dateRange != undefined) {
          this.pageRequest.start = format(this.dateRange[0]);
          this.pageRequest.end = format(this.dateRange[1]);
        }

        this.$api.log.findPage(this.pageRequest).then((res) => {
          this.pageResult = res.data;
        })
      },
      // 删除操作
      handleDelete(rows) {
        let ids = [];
        rows.params.forEach(item => {
          ids.push(item.F_ID);
        })
        let param = { ids: ids };
        this.$api.log.del(param).then((res) => {
          if (res.code == 200) {
            rows.callback();
            this.findPage(null);
          }
          else {
            this.$message({ message: res.msg, type: 'error' })
          }
        })
        //this.$message.success('删除成功');
      },

      //表格数据格式化
      dateFormat: function (row, column, cellValue, index) {
        return format(row[column.property])
      }
    },
    mounted() {
    },
  };
</script>

<style scoped>
  .handle-box {
    margin-bottom: 20px;
  }

  .handle-select {
    width: 120px;
  }

  .handle-input {
    width: 300px;
    display: inline-block;
  }

  .table {
    width: 100%;
    font-size: 14px;
  }

  .red {
    color: #ff0000;
  }

  .mr10 {
    margin-right: 10px;
  }

  .table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
  }
</style>