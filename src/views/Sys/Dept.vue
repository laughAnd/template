<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator-class="el-icon-arrow-right" style="padding-left: 10px;">
        <el-breadcrumb-item>
          <i class="el-icon-date"></i> 组织架构
        </el-breadcrumb-item>
        <el-breadcrumb-item>部门管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <!-- 工具栏 -->
      <div class="handle-box">
        <jtc-button icon="fa fa-plus" label="新增" perms="sys:dept:add" type="primary" @click="handleAdd" />
      </div>

      <!--表格树内容栏-->
      <el-table :data="tableDeptdata" style="width: 100%;margin-bottom: 20px;" stripe size="mini" row-key="F_ID" border
        :tree-props="{children: 'Children'}">
        <el-table-column prop="F_ID" header-align="center" align="left" min-width="150" label="ID">
        </el-table-column>
        <el-table-column prop="F_DeptName" header-align="center" align="left" min-width="80" label="部门名称">
        </el-table-column>
        <el-table-column prop="F_ParentId" header-align="center" align="center" min-width="80" label="上级部门"
          :formatter="formatParentDept">
        </el-table-column>
        <el-table-column prop="F_OrderNum" header-align="center" align="center" min-width="40" label="排序">
        </el-table-column>
        <el-table-column prop="F_CreateTime" header-align="center" align="center" min-width="100" label="创建时间"
          :formatter="formatDate">
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template slot-scope="scope">
            <jtc-button label="编辑" perms="sys:dept:edit" type="primary" @click="handleEdit(scope.row)" />
            <jtc-button label="删除" perms="sys:dept:delete" type="danger" @click="handleDelete(scope.row)" />
          </template>
        </el-table-column>
      </el-table>
      <!-- 新增修改界面 -->
      <el-dialog :title="operation ? '新增' : '修改'" width="40%" :visible.sync="dialogVisible"
        :close-on-click-modal="false">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="submitForm()"
          label-width="80px" :size="size" style="text-align:left;">

          <el-form-item label="ID" prop="F_ID">
            <el-input v-model="dataForm.F_ID" :disabled="true" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="部门名称" prop="F_DeptName">
            <el-input v-model="dataForm.F_DeptName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="上级部门" prop="F_ParentId">
            <popup-tree-input :data="popupTreeData" :props="popupTreeProps"
              :prop="dataForm.F_ParentName==''?'总公司':dataForm.F_ParentName" :nodeKey="''+dataForm.F_ID"
              :currentChangeHandle="handleTreeSelectChange">
            </popup-tree-input>
          </el-form-item>
          <el-form-item label="排序编号" prop="F_OrderNum">
            <el-input-number v-model="dataForm.F_OrderNum" controls-position="right" :min="0" label="排序编号">
            </el-input-number>
          </el-form-item>

        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button :size="size" @click="dialogVisible = false">取消</el-button>
          <el-button :size="size" type="primary" @click="submitForm()">提交</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import JtcButton from "@/views/Core/JtcButton";
  import PopupTreeInput from "@/components/PopupTreeInput";
  import { format } from "@/utils/datetime"
  export default {
    components: {
      PopupTreeInput,
      JtcButton,
    },
    data() {
      return {
        size: "small",
        loading: false,
        filters: {
          name: ""
        },
        tableDeptdata: [],
        dialogVisible: false,

        dataForm: {
          F_ID: '',
          F_DeptName: '',
          F_ParentId: '0',
          F_ParentName: '',
          F_OrderNum: 0,
        },
        dataRule: {
          F_DeptName: [{ required: true, message: "部门名称不能为空", trigger: "blur" }]
        },
        operation: false, // true:新增, false:编辑
        popupTreeData: [],
        popupTreeProps: {
          label: "F_DeptName",
          children: "Children"
        }
      };
    },
    methods: {
      // 获取数据
      findTreeData: function () {
        this.loading = true;
        this.$api.dept.tree().then(res => {
          this.tableDeptdata = res.data;
          this.popupTreeData = this.getParentTree(res.data);
          this.loading = false;
        });
      },
      // 获取上级菜单树
      getParentTree: function (tableDeptdata) {
        let parent = {
          F_ID: "0",
          F_DeptName: "总公司",
          Children: tableDeptdata
        };
        return [parent];
      },
      // 显示新增界面
      handleAdd: function () {
        this.dialogVisible = true;
        this.operation = true;
        this.dataForm = {
          F_ID: '',
          F_DeptName: '',
          F_ParentId: '0',
          F_ParentName: '',
          F_OrderNum: 0,
        }
      },
      // 显示编辑界面
      handleEdit: function (row) {
        this.dialogVisible = true;
        this.operation = false;

        Object.assign(this.dataForm, row);
        this.dataForm.F_ParentName = this.getDeptName(row.F_ParentId);
      },
      // 删除
      handleDelete(row) {
        this.$confirm("确认删除选中记录吗？", "提示", {
          type: "warning"
        }).then(() => {
          let ids = [];
          this.getDeleteIds(ids, row)
          let param = { ids: ids };
          this.$api.dept.del(param).then(res => {
            this.findTreeData();
            this.$message({ message: "删除成功", type: "success" });
          });
        });
      },

      // 获取删除的包含子菜单的id列表
      getDeleteIds(ids, row) {
        ids.push(row.F_ID);
        if (row.Children != null) {
          for (let i = 0, len = row.Children.length; i < len; i++) {
            this.getDeleteIds(ids, row.Children[i]);
          }
        }
        return ids;
      },
      // 菜单树选中
      handleTreeSelectChange(data, node) {
        this.dataForm.F_ParentId = data.F_ID;
        this.dataForm.F_ParentName = data.F_DeptName;
      },
      // 表单提交
      submitForm() {
        this.$refs["dataForm"].validate(valid => {
          if (valid) {
            this.$confirm("确认提交吗？", "提示", {}).then(() => {
              this.editLoading = true;
              let params = Object.assign({}, this.dataForm);
              if (this.operation) {
                this.$api.dept.add(params).then((res) => {
                  this.editLoading = false
                  this.$message({ message: '提交成功', type: 'success' })
                  this.$refs['dataForm'].resetFields()
                  this.dialogVisible = false;
                  this.findTreeData()
                })
              }
              else {
                this.$api.dept.edit(params).then((res) => {
                  this.editLoading = false
                  this.$message({ message: '提交成功', type: 'success' })
                  this.$refs['dataForm'].resetFields()
                  this.dialogVisible = false;
                  this.findTreeData()
                })
              }
            });
          }
        });
      },
      formatParentDept: function (row, column, cellValue, index) {
        let key = row[column.property];
        let result = this.getDeptName(key);
        return result;
      },
      getDeptName(key) {
        let result = '';
        if (this.popupTreeData[0].F_ID == key) {
          result = this.popupTreeData[0].F_DeptName;
        }
        else {
          let data = this.getChild(this.popupTreeData[0].Children, key);
          result = data.F_DeptName;
        }

        return result;
      },
      getChild(data, key) {
        for (let i = 0; i < data.length; i++) {
          let item = data[i];
          if (item.F_ID == key) {
            return item;
          }
          else if (item.Children != null && item.Children.length > 0) {
            let tt = this.getChild(item.Children, key);
            if (tt != '' && tt != undefined) {
              return tt;
            }
          }
          else {
            return '';
          }
        }
      },
      formatDate: function (row, column, cellValue, index) {
        return format(row[column.property])
      },
    },
    mounted() {
      this.findTreeData();
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