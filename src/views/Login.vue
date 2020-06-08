<template>

  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">Manager System</div>
      <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
        <el-form-item prop="username">
          <el-input v-model="param.username" placeholder="username">
            <el-button slot="prepend" icon="el-icon-user"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" placeholder="password" v-model="param.password" @keyup.enter.native="submitForm()">
            <el-button slot="prepend" icon="el-icon-lock"></el-button>
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm()"  :loading="loading">登录</el-button>
        </div>
        <!-- <p class="login-tips">Tips : 用户名和密码随便填。</p> -->
      </el-form>
    </div>
    <div class="login-footer">
         Copyright © Linseed 2016-{{dateYear}}
    </div>

  </div>
</template>

<script>
  import Cookies from "js-cookie";
  export default {
    data: function () {
      return {
        param: {
          username: 'linseed',
          password: '000000',
        },
        loading:false,
        dateYear: new Date().getFullYear(),
        rules: {
          username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
          password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        },
      };
    },
    methods: {
      submitForm() {
        this.loading = true;
        let data = {username:this.param.username, password:window.btoa(this.param.password)}
        this.$api.login.login(data).then((res) => {
          console.log(res)
          if (res.code == 200) {
            sessionStorage.setItem('sms_token', res.Token) // 放置token到Cookie
            sessionStorage.setItem('sms_id', res.data.F_ID) // signalr 注册  userid
            sessionStorage.setItem('sms_user', res.data.F_UserName) // 保存用户到本地会话
            this.$store.commit('menuRouteLoaded', false) // 要求重新加载导航菜单
            this.$router.push('/')  // 登录成功，跳转到主页
          }
          else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
          this.loading = false;
        }).catch((res) => {
          this.$message({
            message: res.message,
            type: 'error'
          })
        });
        
      },
    },
  };
</script>

<style scoped>
  /* .login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../assets/img/bg.jpg);
    background-repeat: no-repeat;
    background-size: 100% 100%;
  } */

  .login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../assets/img/bg.svg);
    background-repeat: repeat;
  }

  .ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
  }

  .ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
  }

  .ms-content {
    padding: 30px 30px;
  }

  .login-btn {
    text-align: center;
  }

  .login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
  }

  .login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
  }

  .login-footer {
    position: absolute;
    bottom: 15px;
    color: #fff;
    font-size: 14px;
    width: 100%;
    text-align: center;
    margin-left: -5px;
  }
</style>