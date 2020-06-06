<template>
  <div>
    <!--表格栏-->
    <el-table :data="data.List" :stripe="stripe" highlight-current-row @selection-change="selectionChange"
      @row-click="rowClick" @current-change="currentChange" @sort-change="sortChange" :v-loading="loading" class="table"
      border width="100%" :size="size" :align="align">
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column v-for="column in columns" :prop="column.prop" :label="column.label" :width="column.width"
        :min-width="column.minWidth" :formatter="column.formatter" :sortable="column.sortable" :fixed="column.fixed"
        :align="column.align" :key="column.prop" :type="column.type" :show-overflow-tooltip="column.showTips">
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template slot-scope="scope">
          <jtc-button label="编辑" :perms="permsEdit" size="mini" type="primary"
            @click="handleEdit(scope.$index, scope.row)" />
          <jtc-button label="删除" :perms="permsDelete" size="mini" type="danger"
            @click="handleDelete(scope.$index, scope.row)" />

        </template>
      </el-table-column>
    </el-table>
    <!--分页栏-->
    <div class="toolbar" style="padding:10px;">
      <!-- <el-button size="mini" type="danger" :disabled="!permsDelete" @click="handleBatchDelete()" style="float:left;">
        批量删除</el-button> -->

      <jtc-button label="批量删除" :perms="permsDelete" size="mini" type="danger" @click="handleBatchDelete()" />
      <el-pagination layout="total, prev, pager, next, jumper" @current-change="refreshPageRequest"
        :current-page="pageRequest.pageIndex" :page-size="pageRequest.pageSize" :total="data.Total"
        style="float:right;">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import JtcButton from "@/views/Core/JtcButton"
  export default {
    name: 'JTCTable',
    components: {
      JtcButton
    },
    props: {
      columns: Array, // 表格列配置
      data: Object, // 表格分页数据
      permsEdit: String,  // 编辑权限标识
      permsDelete: String,  // 删除权限标识
      size: { // 尺寸样式
        type: String,
        default: 'mini'
      },
      align: {  // 文本对齐方式
        type: String,
        default: 'left'
      },
      maxHeight: {  // 表格最大高度
        type: Number,
        default: 420
      },
      stripe: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        // 分页信息
        pageRequest: {
          pageIndex: 1,
          pageSize: 10,
          orderField: ""
        },
        loading: false,  // 加载标识
        selections: []  // 列表选中列
      }
    },
    methods: {
      // 分页查询
      findPage: function () {
        this.$emit('findPage', { pageRequest: this.pageRequest })
      },
      // 选择切换
      selectionChange: function (selections) {
        this.selections = selections
      },
      //排序
      sortChange: function (param) {
        //this.$emit('sortChange', { column: column, prop: prop, order: order });
        this.pageRequest.orderField = param.prop + " " + param.order;
        this.findPage();
      },
      rowClick: function (row, column, event) {
        this.$emit('rowClick', { row: row, column: column, event: event })
      },
      currentChange: function (currentRow, oldCurrentRow) {
        this.$emit('currentChange', { currentRow: currentRow, oldCurrentRow: oldCurrentRow });
      },
      // 换页刷新
      refreshPageRequest: function (pageIndex) {
        this.pageRequest.pageIndex = pageIndex
        this.findPage()
      },
      // 编辑
      handleEdit: function (index, row) {
        this.$emit('handleEdit', { index: index, row: row })
      },
      // 删除
      handleDelete: function (index, row) {
        this.delete([row])
      },
      // 批量删除
      handleBatchDelete: function () {
        this.delete(this.selections)
      },
      // 删除操作
      delete: function (rows) {
        if (rows.length == 0) {
          this.$message({ message: '请至少选中一条数据', type: 'error' });
          return;
        }
        this.$confirm('确认删除选中记录吗？', '提示', {
          type: 'warning'
        }).then(() => {
          let callback = res => {
            this.$message({ message: '删除成功', type: 'success' })
            this.findPage()
          }
          this.$emit('handleDelete', { params: rows, callback: callback })
        }).catch(() => {
        })
      },
      getKey(row) {
        return row.F_ID;
      }
    },
    mounted() {
      this.refreshPageRequest(1)
    }
  }
</script>

<style scoped>

</style>