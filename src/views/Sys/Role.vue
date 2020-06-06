<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator-class="el-icon-arrow-right" style="padding-left: 10px;">
        <el-breadcrumb-item>
          <i class="el-icon-date"></i> 组织架构
        </el-breadcrumb-item>
        <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <!-- 工具栏 -->
      <div class="handle-box">
        <el-input v-model="filters.name" placeholder="角色名称/角色编码/备注" size="small" class="handle-input mr10"
          @keyup.enter.native="findPage(null)">
        </el-input>
        <jtc-button icon="fa fa-search" label="查询" perms="sys:role:view" type="primary" @click="findPage(null)" />
        <jtc-button icon="fa fa-plus" label="新增" perms="sys:role:add" type="primary" @click="handleAdd" />
      </div>

      <!--表格内容栏-->
      <JTCTable :data="pageResult" :columns="columns" permsEdit="sys:role:edit" permsDelete="sys:role:delete"
        @findPage="findPage" @handleEdit="handleEdit" @handleDelete="handleDelete" @currentChange="currentChange"
        :stripe="false">
      </JTCTable>

      <!--新增编辑界面-->
      <el-dialog :title="operation?'新增':'编辑'" width="40%" :visible.sync="editDialogVisible"
        :close-on-click-modal="false">
        <el-form :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm">
          <el-form-item label="ID" prop="F_ID">
            <el-input v-model="dataForm.F_ID" :disabled="true" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色名称" prop="F_RoleName">
            <el-input v-model="dataForm.F_RoleName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="F_Remark">
            <el-input v-model="dataForm.F_Remark" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
        </div>
      </el-dialog>

      <!--角色菜单，表格树内容栏-->
      <div class="menu-container" :v-if="true">
        <div class="menu-header">
          <span><B>角色菜单授权</B></span>
        </div>
        <el-tree :data="menuTree" size="mini" show-checkbox node-key="F_ID" :props="defaultProps"
          style="width: 100%;padding-top:20px;" ref="menuTree" :render-content="renderContent" v-loading="menuLoading"
          element-loading-text="拼命加载中" :check-strictly="true" @check-change="handleMenuCheckChange">
        </el-tree>
        <div style="float:left;padding-left:24px;padding-top:12px;padding-bottom:4px;">
          <el-checkbox v-model="checkAll" @change="handleCheckAll"><b>全选</b>
          </el-checkbox>
        </div>
        <div style="float:right;padding-right:15px;padding-top:4px;margin-bottom:15px;">
          <jtc-button label="重置" perms="sys:role:edit" type="primary" @click="resetSelection" />
          <jtc-button label="保存" perms="sys:role:edit" type="primary" @click="submitAuthForm" :loading="authLoading" />

        </div>
      </div>

    </div>
  </div>
</template>

<script>
  import TableTreeColumn from "@/views/Core/TableTreeColumn"
  import JTCTable from "@/views/Core/JTCTable"
  import JtcButton from "@/views/Core/JtcButton"
  import { format } from "@/utils/datetime"

  export default {
    components: {
      TableTreeColumn,
      JTCTable,
      JtcButton
    },
    data() {
      return {
        filters: {
          name: ''
        },
        columns: [
          { prop: "F_ID", label: "ID", minWidth: 160 },
          { prop: "F_RoleName", label: "角色名称", minWidth: 80 },
          { prop: "F_Remark", label: "备注", minWidth: 80 },
          { prop: "F_CreateTime", label: "创建时间", minWidth: 100, sortable: "true", formatter: this.formatDate }
        ],
        pageRequest: { pageIndex: 1, pageSize: 10, Total: 0, search: '', orderField: '' },
        pageResult: {},
        operation: false, // true:新增, false:编辑
        editDialogVisible: false, // 新增编辑界面是否显示
        editLoading: false,
        dataFormRules: {
          F_RoleName: [
            { required: true, message: '请输入角色名', trigger: 'blur' }
          ]
        },
        // 新增编辑界面数据
        dataForm: {
          F_ID: 0,
          F_RoleName: '',
          F_Remark: ''
        },
        defaultProps: {
          label: 'F_MenuName',
          children: 'Children'
        },
        menuTree: [],
        currentRow: {},
        menuLoading: false,
        authLoading: false,
        checkAll: false,
        currentRoleMenus: [],
      }
    },
    methods: {
      // 获取分页数据
      findPage: function (data) {
        if (data !== null) {
          this.pageRequest = data.pageRequest
        }
        this.pageRequest.search = this.filters.name;
        this.$api.role.findPage(this.pageRequest).then((res) => {

          this.pageResult = res.data;
          if (res.data !== null && res.data.List.length > 0) {
            let roleId = res.data.List[0].F_ID;
            this.currentRow = res.data.List[0];
            this.bindMenuTree(roleId);
          }
        })
      },
      currentChange: function (param) {
        if (param.currentRow != null) {
          this.currentRow = param.currentRow;
          var roleId = param.currentRow.F_ID;
          this.bindMenuTree(roleId)
        }
      },
      // 删除操作
      handleDelete(rows) {
        let ids = [];
        rows.params.forEach(item => {
          ids.push(item.F_ID);
        })

        let param = { ids: ids };
        this.$api.role.del(param).then((res) => {
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
          F_ID: 0,
          F_RoleName: '',
          F_Remark: ''
        }
      },
      // 显示编辑界面
      handleEdit: function (params) {
        this.editDialogVisible = true
        this.operation = false
        this.dataForm = Object.assign({}, params.row)
      },
      // 保存
      editSubmit: function () {
        this.$refs.dataForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {

              this.editLoading = true
              let params = Object.assign({}, this.dataForm)
              if (this.operation) {
                this.$api.role.add(params).then((res) => {
                  this.editLoading = false
                  this.$message({ message: '提交成功', type: 'success' })
                  this.$refs['dataForm'].resetFields()
                  this.editDialogVisible = false
                  this.findPage(null)
                })
              }
              else {
                this.$api.role.edit(params).then((res) => {
                  this.editLoading = false
                  this.$message({ message: '提交成功', type: 'success' })
                  this.$refs['dataForm'].resetFields()
                  this.editDialogVisible = false
                  this.findPage(null)
                })
              }

            })
          }
        })
      },
      //获取当前登录用户权限
      getUserAllMenus() {
        this.$api.menu.tree().then((res) => {
          this.menuTree = res.data;
        })
      },
      formatDate: function (row, column, cellValue, index) {
        return format(row[column.property])
      },

      bindMenuTree(roleId) {//绑定节点
        this.$api.menu.roleMenuIds(roleId).then((res) => {
          this.currentRoleMenus = res.data;
          this.setMenuCheckedKeys(res.data);
        })
      },

      // 树节点选择监听
      handleMenuCheckChange(data, check, subCheck) {
        if (check) {
          // 节点选中时同步选中父节点
          let parentId = data.F_ParentId
          this.$refs.menuTree.setChecked(parentId, true, false)
        } else {
          // 节点取消选中时同步取消选中子节点
          if (data.Children != null) {
            data.Children.forEach(element => {
              this.$refs.menuTree.setChecked(element.F_ID, false, false)
            });
          }
        }
      },
      setMenuCheckedKeys(data) {
        this.$refs.menuTree.setCheckedKeys(data)
      },
      // 重置选择
      resetSelection() {
        this.checkAll = false
        this.$refs.menuTree.setCheckedKeys(this.currentRoleMenus)
      },
      // 全选操作
      handleCheckAll() {
        if (this.checkAll) {
          let allMenus = []
          this.checkAllMenu(this.menuTree, allMenus)
          this.$refs.menuTree.setCheckedKeys(allMenus)
        } else {
          this.$refs.menuTree.setCheckedKeys([])
        }
      },
      // 递归全选
      checkAllMenu(menuTree, allMenus) {
        menuTree.forEach(menu => {
          allMenus.push(menu.F_ID)
          if (menu.Children) {
            this.checkAllMenu(menu.Children, allMenus)
          }
        });
      },
      // 角色菜单授权提交
      submitAuthForm() {
        let roleId = this.currentRow.F_ID
        if ('admin' == this.currentRow.F_RoleName) {
          this.$message({ message: '超级管理员拥有所有菜单权限，不允许修改！', type: 'error' })
          return
        }
        this.authLoading = true
        let checkedNodes = this.$refs.menuTree.getCheckedNodes(false, true);

        let arr = []
        for (let i = 0, len = checkedNodes.length; i < len; i++) {
          arr.push(checkedNodes[i].F_ID)
        }
        this.$api.role.addAuth(roleId, { ids: arr }).then((res) => {
          if (res.code == 200) {
            this.$message({ message: '操作成功', type: 'success' })
          } else {
            this.$message({ message: '操作失败, ' + res.msg, type: 'error' })
          }
          this.authLoading = false
        })
      },
      renderContent(h, { node, data, store }) {
        return (
          <div class="column-container">
            <span style="text-algin:center;margin-right:80px;">{data.F_MenuName}</span>
            <span style="text-algin:center;margin-right:80px;">
              <el-tag type={data.F_Type === 0 ? '' : data.F_Type === 1 ? 'success' : 'info'} size="small">
                {data.F_Type === 0 ? '目录' : data.F_Type === 1 ? '菜单' : '按钮'}
              </el-tag>
            </span>
            <span style="text-algin:center;margin-right:80px;"> <i class={data.F_Icon}></i></span>
            <span style="text-algin:center;margin-right:80px;">{data.F_Url ? data.F_Url : '\t'}</span>
            <span style="text-algin:center;margin-right:80px;">{data.F_Perms ? data.F_Perms : '\t'}</span>
          </div>);
      },

    },
    mounted() {
      this.getUserAllMenus();
    }
  }
</script>

</script>

<style scoped>
  .menu-container {
    margin-top: 30px;
    padding-bottom: 20px;
  }

  .menu-header {
    padding-left: 8px;
    padding-bottom: 0px;
    text-align: left;
    font-size: 16px;
    color: rgb(20, 89, 121);

  }

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