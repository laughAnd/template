<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator-class="el-icon-arrow-right" style="padding-left: 10px;">
        <el-breadcrumb-item>
          <i class="el-icon-date"></i> 组织架构
        </el-breadcrumb-item>
        <el-breadcrumb-item>菜单管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <!-- 工具栏 -->
      <div class="handle-box">
        <jtc-button icon="fa fa-plus" label="新增" perms="sys:menu:add" type="primary" @click="handleAdd" />
      </div>

      <!--表格树内容栏-->
      <el-table :data="tableTreeDdata" style="width: 100%;margin-bottom: 20px;" stripe size="mini" row-key="F_ID" border
        :tree-props="{children: 'Children'}">
        <!-- <el-table-column prop="F_ID" header-align="center" align="left" min-width="120" label="ID">
      </el-table-column> -->
        <el-table-column prop="F_MenuName" header-align="center" align="left" min-width="100" label="菜单名称">
        </el-table-column>
        <el-table-column prop="F_Type" header-align="center" min-width="100" align="center" label="类型">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.F_Type === 0" size="small">目录</el-tag>
            <el-tag v-else-if="scope.row.F_Type === 1" size="small" type="success">菜单</el-tag>
            <el-tag v-else-if="scope.row.F_Type === 2" size="small" type="primary">按钮</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="F_ParentId" header-align="center" align="center" min-width="100" label="上级菜单"
          :formatter="formatParentMenu">
        </el-table-column>
        <el-table-column prop="F_Icon" header-align="center" align="center" label="图标" min-width="60">
          <template slot-scope="scope">
            <i :class="scope.row.F_Icon || ''"></i>
          </template>
        </el-table-column>
        <el-table-column prop="F_Url" header-align="center" align="left" min-width="100" :show-overflow-tooltip="true"
          label="菜单URL">
        </el-table-column>
        <el-table-column prop="F_Perms" header-align="center" align="left" min-width="100" :show-overflow-tooltip="true"
          label="按钮权限">
        </el-table-column>
        <el-table-column prop="F_OrderNum" header-align="center" align="center" min-width="60" label="排序">
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template slot-scope="scope">
            <jtc-button label="编辑" perms="sys:menu:edit" type="primary" @click="handleEdit(scope.row)" />
            <jtc-button label="删除" perms="sys:menu:delete" type="danger" @click="handleDelete(scope.row)" />
          </template>
        </el-table-column>
      </el-table>

      <!-- 新增修改界面 -->
      <el-dialog :title="operation ? '新增' : '修改'" width="40%" :visible.sync="dialogVisible"
        :close-on-click-modal="false">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="submitForm()"
          label-width="80px" :size="size" style="text-align:left;">
          <el-form-item label="菜单类型" prop="F_Type">
            <el-radio-group v-model="dataForm.F_Type">
              <el-radio v-for="(type, index) in menuTypeList" :label="index" :key="index">{{ type }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="menuTypeList[dataForm.F_Type] + '名称'" prop="F_FullName">
            <el-input v-model="dataForm.F_MenuName" :placeholder="menuTypeList[dataForm.F_Type] + '名称'"></el-input>
          </el-form-item>
          <el-form-item label="上级菜单" prop="F_ParentId">
            <popup-tree-input :data="popupTreeData" :props="popupTreeProps"
              :prop="dataForm.F_ParentName==''?'顶级菜单':dataForm.F_ParentName" :nodeKey="''+dataForm.F_ID"
              :currentChangeHandle="handleTreeSelectChange">
            </popup-tree-input>
          </el-form-item>
          <el-form-item v-if="dataForm.F_Type === 1" label="菜单路由" prop="F_Url">
            <el-row>
              <el-col :span="22">
                <el-input v-model="dataForm.F_Url" placeholder="菜单路由"></el-input>
              </el-col>
              <el-col :span="2" class="icon-list__tips">
                <el-tooltip placement="top" effect="light" style="padding: 10px;">
                  <div slot="content">
                    <p>URL格式：</p>
                    <p>1.常规业务开发的功能URL，如用户管理，Views目录下页面路径为 /Sys/User, 此处填写 /sys/user。</p>
                    <p>2.嵌套外部网页，如通过菜单打开百度网页，此处填写 http://www.baidu.com，http:// 不可省略。</p>
                    <p>示例：用户管理：/sys/user 嵌套百度：http://www.baidu.com 嵌套网页：http://127.0.0.1:8000</p>
                  </div>
                  <i class="el-icon-warning"></i>
                </el-tooltip>
              </el-col>
            </el-row>
          </el-form-item>

          <el-form-item v-else-if="dataForm.F_Type === 2" label="按钮权限" prop="F_Perms">
            <el-input v-model="dataForm.F_Perms" auto-complete="off"></el-input>
          </el-form-item>

          <el-form-item label="排序编号" prop="F_OrderNum">
            <el-input-number v-model="dataForm.F_OrderNum" controls-position="right" :min="0" label="排序编号">
            </el-input-number>
          </el-form-item>

          <el-form-item label="图标" prop="F_Icon">
            <el-row>
              <el-col :span="22">
                <el-input v-model="dataForm.F_Icon" v-popover:iconListPopover :readonly="false"
                  placeholder="菜单图标名称（如：fa fa-home fa-lg）" class="icon-list__input"></el-input>
              </el-col>
              
            </el-row>
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
        tableTreeDdata: [],
        dialogVisible: false,
        menuTypeList: ["目录", "菜单", "按钮"],
        dataForm: {
          F_ID: '',
          F_MenuName: '',
          F_ParentId: '0',
          F_ParentName: '',
          F_Type: 0,
          F_Url: "",
          F_Icon: "",
          F_Perms: "",
          F_OrderNum: 0,
        },
        dataRule: {
          F_MenuName: [{ required: true, message: "菜单名称不能为空", trigger: "blur" }]
        },
        operation: false, // true:新增, false:编辑
        popupTreeData: [],
        popupTreeProps: {
          label: "F_MenuName",
          children: "Children"
        }
      };
    },
    methods: {
      // 获取数据
      findTreeData: function () {
        this.loading = true;
        this.$api.menu.tree().then(res => {
          this.tableTreeDdata = res.data;
          this.popupTreeData = this.getParentMenuTree(res.data);
          this.loading = false;
        });
      },
      // 获取上级菜单树
      getParentMenuTree: function (tableTreeDdata) {
        let parent = {
          F_ID: "0",
          F_MenuName: "顶级菜单",
          Children: tableTreeDdata
        };
        return [parent];
      },
      // 显示新增界面
      handleAdd: function () {
        this.dialogVisible = true;
        this.operation = true;
        this.dataForm = {
          F_ID: '',
          F_MenuName: '',
          F_ParentId: '0',
          F_ParentName: '',
          F_Type: 0,
          F_Url: "",
          F_Icon: "",
          F_Perms: "",
          F_OrderNum: 0,
        }
      },
      // 显示编辑界面
      handleEdit: function (row) {
        this.dialogVisible = true;
        this.operation = false;

        Object.assign(this.dataForm, row);
        this.dataForm.F_ParentName = this.getMenuName(row.F_ParentId);
      },
      // 删除
      handleDelete(row) {
        this.$confirm("确认删除选中记录吗？", "提示", {
          type: "warning"
        }).then(() => {

          let ids = [];
          this.getDeleteIds(ids, row)
          let param = { ids: ids };
          this.$api.menu.del(param).then(res => {
            if(res.code == 200){
              this.findTreeData();
              this.$message({ message: "删除成功", type: "success" });
            }
            else{
              this.$message({ message: res.msg, type: "error" });
            }
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
        this.dataForm.F_ParentName = data.F_MenuName;
      },
      // 表单提交
      submitForm() {
        this.$refs["dataForm"].validate(valid => {
          if (valid) {
            this.$confirm("确认提交吗？", "提示", {}).then(() => {
              this.editLoading = true;
              let params = Object.assign({}, this.dataForm);

              if (this.operation) {
                this.$api.menu.add(params).then((res) => {
                  this.editLoading = false
                  this.$message({ message: '提交成功', type: 'success' })
                  this.$refs['dataForm'].resetFields()
                  this.dialogVisible = false;
                  this.findTreeData()
                })
              }
              else {
                this.$api.menu.edit(params).then((res) => {
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
      formatParentMenu: function (row, column, cellValue, index) {

        let key = row[column.property];
        let result = this.getMenuName(key);
        return result;
      },
      getMenuName(key) {
        let result = '';
        if (this.popupTreeData[0].F_ID == key) {
          result = this.popupTreeData[0].F_MenuName;
        }
        else {

          let data = this.getChild(this.popupTreeData[0].Children, key);
          result = data.F_MenuName;
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
            if (tt != null) {
              return tt;
            }
          }
        }
      }
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