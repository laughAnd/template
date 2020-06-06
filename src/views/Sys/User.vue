<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator-class="el-icon-arrow-right" style="padding-left: 10px;">
        <el-breadcrumb-item>
          <i class="el-icon-date"></i> 组织架构
        </el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <!-- 工具栏 -->
      <div class="handle-box">
        <el-input v-model="filters.name" placeholder="用户名" size="small" class="handle-input mr10"
          @keyup.enter.native="findPage(null)">
        </el-input>
        <jtc-button icon="fa fa-search" label="查询" perms="sys:user:view" type="primary" @click="findPage(null)" />
        <jtc-button icon="fa fa-plus" label="新增" perms="sys:user:add" type="primary" @click="handleAdd" />
      </div>

      <!--表格内容栏-->
      <JTCTable :data="pageResult" permsEdit="sys:user:edit" permsDelete="sys:user:delete" :columns="columns"
        @findPage="findPage" @handleEdit="handleEdit" @handleDelete="handleDelete">
      </JTCTable>

      <!--新增编辑界面-->
      <el-dialog :title="operation?'新增':'编辑'" width="40%" :visible.sync="editDialogVisible"
        :close-on-click-modal="false">
        <el-form :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm">
          <el-form-item label="ID" prop="F_ID">
            <el-input v-model="dataForm.F_ID" :disabled="true" auto-complete="off"></el-input>
          </el-form-item>

          <el-form-item label="部门" prop="F_DeptName">
            <popup-tree-input :data="deptTreeList" :props="deptTreeProps" :prop="dataForm.F_DeptName"
              :nodeKey="dataForm.F_DeptId" :currentChangeHandle="deptTreeCurrentChangeHandle">
            </popup-tree-input>
          </el-form-item>

          <el-form-item label="用户名" prop="F_UserName">
            <el-input v-model="dataForm.F_UserName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item v-if="operation" label="密码" prop="F_Password">
            <el-input v-model="dataForm.F_Password" type="password" auto-complete="off"></el-input>
          </el-form-item>

          <el-form-item label="邮箱" prop="F_Email">
            <el-input v-model="dataForm.F_Email" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="F_Mobile">
            <el-input v-model="dataForm.F_Mobile" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="F_Gender">
            <el-col :span="24" style="text-align: left;">
              <el-radio-group v-model="dataForm.F_Gender">
                <el-radio label="male">男</el-radio>
                <el-radio label="female">女</el-radio>
              </el-radio-group>
            </el-col>
          </el-form-item>
          <el-form-item label="状态" prop="F_EnabledMark">
            <el-switch v-model="dataForm.F_EnabledMark" active-color="#13ce66" inactive-color="#ff4949"
              :active-value="1" :inactive-value="0">
            </el-switch>
          </el-form-item>
          <el-form-item label="角色" prop="F_RoleIds" v-if="!operation">
            <el-select v-model="dataForm.F_RoleIds" multiple placeholder="请选择" style="width: 100%;">
              <el-option v-for="item in roleList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
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
  import JTCTable from "@/views/Core/JTCTable"
  import JtcButton from "@/views/Core/JtcButton"
  import { format } from "@/utils/datetime"
  import { mapState } from 'vuex'

  export default {
    components: {
      PopupTreeInput,
      JTCTable,
      JtcButton
    },
    data() {
      return {
        filters: {
          name: ''
        },
        columns: [
          //{ prop: "F_ID", label: "ID", minWidth: 130 },
          { prop: "F_UserName", label: "用户名", minWidth: 80 },
          { prop: "F_DeptId", label: "部门", minWidth: 120, formatter: this.formatDept },
          { prop: "F_RoleIds", label: "角色", minWidth: 100, formatter: this.formatRole },
          { prop: "F_Email", label: "邮箱", minWidth: 120 },
          { prop: "F_Mobile", label: "手机号", minWidth: 100 },
          { prop: "F_Gender", label: "性别", minWidth: 60, formatter: this.formatGender },
          { prop: "F_EnabledMark", label: "状态", minWidth: 60, tag: true, formatter: this.formatStatus },
          { prop: "F_CreateTime", label: "创建日期", minWidth: 120, sortable: "true", formatter: this.formatDate }
        ],
        pageRequest: { pageIndex: 1, pageSize: 10, Total: 0, search: '', orderField: '' },
        pageResult: {},
        deptList: [],
        deptTreeList: [],
        roleList: [],
        operation: false, // true:新增, false:编辑
        editDialogVisible: false, // 新增编辑界面是否显示
        editLoading: false,
        dataFormRules: {
          F_UserName: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ]
        },
        // 新增编辑界面数据
        dataForm: {
          F_ID: 0,
          F_UserName: 'admin',
          F_DeptId: '',
          F_DeptName: '',
          F_Email: '',
          F_Gender: 1,
          F_Mobile: '',
          F_EnabledMark: 1,
          F_Password: '',
          F_RoleIds: []
        },
        deptTreeProps: {
          label: 'F_DeptName',
          children: 'Children'
        },
      }
    },
    methods: {
      // 获取分页数据
      findPage: function (data) {
        if (data !== null) {
          this.pageRequest = data.pageRequest
        }

        this.pageRequest.search = this.filters.name;
        this.$api.user.findPage(this.pageRequest).then((res) => {
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
        this.$api.user.del(param).then((res) => {
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
      // 显示新增界面
      handleAdd: function () {
        this.editDialogVisible = true
        this.operation = true
        this.dataForm = {
          F_ID: '',
          F_UserName: '',
          F_DeptId: '',
          F_DeptName: '',
          F_Email: '',
          F_Gender: 'male',
          F_Mobile: '',
          F_EnabledMark: 1,
          F_Password: '',
          F_RoleIds: []
        }
      },
      // 显示编辑界面
      handleEdit: function (params) {
        this.editDialogVisible = true
        this.operation = false;
        this.dataForm = Object.assign({}, params.row)

        this.deptList.forEach(item => {
          if (item.value == params.row.F_DeptId) {
            this.dataForm.F_DeptName = item.label;
          }
        })

      },
      // 提交数据
      editSubmit: function () {
        this.$refs.dataForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {

              this.editLoading = true
              let params = Object.assign({}, this.dataForm)
              if (this.operation) {
                this.$api.user.add(params).then((res) => {
                  this.saveCallback(res);
                })
              }
              else {
                this.$api.user.edit(params).then((res) => {
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
      },
      //初始化下拉框动态数据
      getDropDownList() {
        this.$api.dept.list().then((res) => {
          this.deptList = res.data;
        })
        this.$api.role.list().then((res) => {
          this.roleList = res.data;
        })
      },
      getTreeList() {
        this.$api.dept.tree().then((res) => {
          this.deptTreeList = res.data;
          console.log(this.deptTreeList)
        })
      },
      formatDate: function (row, column, cellValue, index) {
        return format(row[column.property])
      },
      formatStatus: function (row, column, cellValue, index) {
        let label = '';
        this.statusList.forEach(item => {
          if (item.value == row[column.property]) {
            label = item.label;
          }
        })
        return label;
      },
      formatGender: function (row, column, cellValue, index) {
        let result = '';
        this.genderList.forEach(item => {
          if (item.value == row[column.property]) {
            result = item.label;
          }
        })
        return result;
      },
      formatDept: function (row, column, cellValue, index) {
        let result = '';
        this.deptList.forEach(item => {
          if (item.value == row[column.property]) {
            result = item.label;
          }
        })
        return result;
      },
      formatRole: function (row, column, cellValue, index) {
        let result = '';
        this.roleList.forEach(item => {
          if (row[column.property].indexOf(item.value) > -1) {
            result = result + "," + item.label;
          }
        })

        if (result.length > 0)
          result = result.substring(1);
        return result;
      },
      // 菜单树选中
      deptTreeCurrentChangeHandle(data, node) {
        console.log(data);
        console.log(node)
       
        this.dataForm.F_DeptId = data.F_ID;
        this.dataForm.F_DeptName = data.F_DeptName;
      },
    },
    mounted() {
      this.getDropDownList();
      this.getTreeList();
    },
    computed: {
      ...mapState({
        genderList: state => state.dict.dataDict["gender"],
        statusList: state => state.dict.dataDict["status"]
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