<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator-class="el-icon-arrow-right" style="padding-left: 10px;">
        <el-breadcrumb-item>
          <i class="el-icon-date"></i> 系统管理
        </el-breadcrumb-item>
        <el-breadcrumb-item>修改密码</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="container">
      <div class="form-box">

        <el-form :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm">
          <el-form-item label="原密码" prop="OldPwd">
            <el-input v-model="dataForm.OldPwd" type="password" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="NewPwd">
            <el-input v-model="dataForm.NewPwd" type="password" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="CheckPwd">
            <el-input v-model="dataForm.CheckPwd" type="password" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">表单提交</el-button>
          </el-form-item>
        </el-form>

      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'baseform',
    data() {
      return {
        dataForm: {
          OldPwd: '',
          NewPwd: '',
          CheckPwd: ''
        },
        dataFormRules: {
          OldPwd: { required: true, message: '请输入原密码', trigger: 'blur' },
          NewPwd: { required: true, message: '请输入新密码', trigger: 'blur' },
          CheckPwd: { required: true, message: '请输入确认密码', trigger: 'blur' }
        },
      };
    },
    methods: {
      onSubmit() {
        this.$refs.dataForm.validate((valid) => {
          if (valid) {
            if (this.dataForm.CheckPwd != this.dataForm.NewPwd) {
              this.$message.error('密码不一致');
              return;
            }
            else {
              //this.$message.success('提交成功！');
              let param = {OldPwd:window.btoa(this.dataForm.OldPwd),NewPwd:window.btoa(this.dataForm.NewPwd),CheckPwd:window.btoa(this.dataForm.CheckPwd)}
              this.$api.user.password(param).then((res) => {
                if (res.code == 200) {
                  this.$message.success('提交成功！');
                  sessionStorage.removeItem('sms_user')
                  this.$router.push('/login');
                }
                else {
                  this.$message({
                    message: res.msg,
                    type: 'error'
                  })
                }
              }).catch((res) => {
                this.$message({
                  message: res.message,
                  type: 'error'
                })
              });

            }
          }
        })
      }
    }
  };
</script>