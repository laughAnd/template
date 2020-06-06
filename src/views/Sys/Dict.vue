<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator-class="el-icon-arrow-right" style="padding-left: 10px;">
        <el-breadcrumb-item>
          <i class="el-icon-date"></i> 系统设置
        </el-breadcrumb-item>
        <el-breadcrumb-item>数据字典</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <!-- 工具栏 -->
      <div class="handle-box">
        <el-input v-model="filters.name" placeholder="类型" size="small" class="handle-input mr10"
          @keyup.enter.native="findPage(null)">
        </el-input>
        <jtc-button icon="fa fa-search" label="查询" perms="sys:dict:view" type="primary" @click="findPage(null)" />
        <jtc-button icon="fa fa-plus" label="新增" perms="sys:dict:add" type="primary" @click="handleAdd" />
      </div>

      <!--表格内容栏-->
      <JTCRowTable :data="pageResult" :columns="columns" permsEdit="sys:dict:edit" permsDelete="sys:dict:delete"
        @findPage="findPage" @handleEdit="handleEdit" @handleDelete="handleDelete" rowKey="F_ID" :treeProps="treeProp">
      </JTCRowTable>

      <!--新增编辑界面-->
      <el-dialog :title="operation?'新增':'编辑'" width="40%" :visible.sync="editDialogVisible"
        :close-on-click-modal="false">
        <el-form :model="dataForm" label-width="100px" :rules="dataFormRules" ref="dataForm">
          <el-form-item label="ID" prop="F_ID">
            <el-input v-model="dataForm.F_ID" :disabled="true" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="父类型" prop="F_ParentId">
            <el-select v-model="dataForm.F_ParentId" placeholder="请选择" style="width: 100%;">
              <el-option v-for="item in parentList" :key="item.value" :label="item.label" :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="字典Label" prop="F_Label">
            <el-input v-model="dataForm.F_Label" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="字典Value" prop="F_Value">
            <el-input v-model="dataForm.F_Value" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="F_Remark">
            <el-input v-model="dataForm.F_Remark" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="排序编号" prop="F_OrderNum">
            <el-input-number v-model="dataForm.F_OrderNum" controls-position="right" :min="0" label="排序编号">
            </el-input-number>
          </el-form-item>
          <el-form-item label="状态">
            <el-switch v-model="dataForm.F_EnabledMark"></el-switch>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
        </div>
      </el-dialog>

    </div>
  </div>
</template>

<script>
  import PopupTreeInput from "@/components/PopupTreeInput"
  import JTCRowTable from "@/views/Core/JTCRowTable"
  import JtcButton from "@/views/Core/JtcButton"
  import { format } from "@/utils/datetime"
  import store from "@/store";
  import { mapState } from 'vuex'

  export default {
    components: {
      PopupTreeInput,
      JTCRowTable,
      JtcButton
    },
    data() {
      return {
        filters: {
          name: ''
        },
        columns: [
          // { prop: "F_ID", label: "ID", minWidth: 140 },
          { prop: "F_ParentId", label: "父类型", minWidth: 80, formatter: this.formatParent },
          { prop: "F_Label", label: "字典Label", minWidth: 80 },
          { prop: "F_Value", label: "字典Value", minWidth: 80 },
          { prop: "F_Remark", label: "备注", minWidth: 60 },
          { prop: "F_OrderNum", label: "排序", minWidth: 60, sortable: "true", align: 'center' },
          { prop: "F_EnabledMark", label: "状态", minWidth: 60, formatter: this.formatStatus },
          { prop: "F_CreateTime", label: "创建日期", minWidth: 120, sortable: "true", formatter: this.formatDate }

        ],
        pageRequest: { pageIndex: 1, pageSize: 10, Total: 0, search: '', orderField: '' },
        pageResult: {},
        operation: false, // true:新增, false:编辑
        editDialogVisible: false, // 新增编辑界面是否显示
        editLoading: false,
        dataFormRules: {
          F_Label: { required: true, message: '请输入标签名', trigger: 'blur' },
          F_Value: { required: true, message: '请输入标签值', trigger: 'blur' },
        },
        // 新增编辑界面数据
        dataForm: {
          F_ID: '',
          F_ParentId: '0',
          F_Label: '',
          F_Value: '',
          F_Remark: '',
          F_OrderNum: 1,
          F_EnabledMark: true
        },
        treeProp: {
          hasChildren: 'hasChildren',
          children: 'Childrens'
        },
        currentParentName: '',//当前选中下拉框值
      }
    },
    methods: {
      // 获取分页数据
      findPage: function (data) {
        if (data !== null) {
          this.pageRequest = data.pageRequest
        }
        this.pageRequest.search = this.filters.name;
        this.$api.dict.findPage(this.pageRequest).then((res) => {
          this.pageResult = res.data;
        })
      },
      // 删除操作
      handleDelete(rows) {
        let ids = [];
        rows.params.forEach(item => {
          ids.push(item.F_ID);
          if (item.Childrens) {
            item.Childrens.forEach(obj => { ids.push(obj.F_ID) });
          }
        })
        let param = { ids: ids };
        this.$api.dict.del(param).then((res) => {
          if (res.code == 200) {
            this.UpdateDropDownList();
            rows.callback();
            this.findPage(null);
          }
          else {
            this.$message({ message: res.msg, type: 'error' })
          }
        })
        //this.$message.success('删除成功');
      },
      // 显示新增界面
      handleAdd: function () {
        this.editDialogVisible = true
        this.operation = true
        this.dataForm = {
          F_ID: '',
          F_ParentId: '0',
          F_Label: '',
          F_Value: '',
          F_Remark: '',
          F_OrderNum: 1,
          F_EnabledMark: true
        }
      },
      // 显示编辑界面
      handleEdit: function (params) {
        this.editDialogVisible = true
        this.operation = false
        this.dataForm = Object.assign({}, params.row)
      },
      // 提交数据
      editSubmit: function () {
        this.$refs.dataForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {

              this.editLoading = true
              let params = Object.assign({}, this.dataForm)
              if (this.operation) {
                this.$api.dict.add(params).then((res) => {
                  this.saveCallback(res);
                })
              }
              else {
                this.$api.dict.edit(params).then((res) => {
                  this.saveCallback(res);

                })
              }

            })
          }
        })
      },
      saveCallback: function (res) {//提交保存回调
        if (res.code == 200)
          this.$message({ message: '提交成功', type: 'success' })
        else
          this.$message({ message: res.msg, type: 'error' })

        this.editLoading = false
        this.$refs['dataForm'].resetFields()
        this.editDialogVisible = false
        this.findPage(null)
        this.UpdateDropDownList();
      },
      UpdateDropDownList() {
        let name = '0';
        this.parentList.forEach(x => {
          if (x.key == this.dataForm.F_ParentId) {
            name = x.value;
          }
        });
        //更新下拉缓存
        this.$api.dict.list(name).then((res) => {
          store.commit('setKeyValue', { name: name, data: res.data })
        });
      },

      formatDate: function (row, column, cellValue, index) {
        return format(row[column.property])
      },
      formatStatus: function (row, column, cellValue, index) {

        let result = "禁用";
        if (row[column.property])
          result = "正常";
        return result;
      },
      formatParent: function (row, column, cellValue, index) {
        let prop = '';
        this.parentList.forEach(item => {
          if (item.key == row[column.property]) {
            prop = item.label;
          }
        })
        return prop;
      },
    },
    mounted() {
    },
    computed: {
      ...mapState({
        parentList: state => state.dict.dataDict["base"]
      })
    }
  }
</script>

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