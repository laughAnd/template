<template>
    <div class="header">
        <!-- 折叠按钮 -->
        <div class="collapse-btn" @click="collapseChage">
            <i v-if="!collapse" class="el-icon-s-fold"></i>
            <i v-else class="el-icon-s-unfold"></i>
        </div>
        <div class="logo">Manager System
        </div>
        <div class="header-right">
            <div class="header-user-con">
                <!-- github -->
                <div class="btn-intro" @click="handleGithub">
                    <el-tooltip effect="dark" :content="`github`" placement="bottom">
                        <el-tooltip effect="dark" :content="`功能引导`" placement="bottom">
                            <i class="fa fa-github"></i>
                        </el-tooltip>
                    </el-tooltip>
                </div>
                <!-- 功能引导 -->
                <div class="btn-intro" @click="handleIntroduce">
                    <el-tooltip effect="dark" :content="`功能引导`" placement="bottom">
                        <i class="el-icon-s-promotion"></i>
                    </el-tooltip>
                </div>
                <!-- 全屏显示 -->
                <div class="btn-fullscreen" @click="handleFullScreen">
                    <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
                        <i class="el-icon-full-screen"></i>
                    </el-tooltip>
                </div>
                <!-- 消息中心 -->
                <div class="btn-bell">
                    <el-tooltip effect="dark" :content="message?`有${message}条未读消息`:`消息中心`" placement="bottom">
                        <router-link to="/notice">
                            <i class="el-icon-bell"></i>
                        </router-link>
                    </el-tooltip>
                    <span class="btn-bell-badge" v-if="message"></span>
                </div>
                <!-- 用户头像 -->
                <div class="user-avator">
                    <img src="@/assets/user1.png" />
                </div>
                <!-- 用户名下拉菜单 -->
                <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{username}}
                        <i class="el-icon-caret-bottom"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">

                        <el-dropdown-item command="editPassword">修改密码</el-dropdown-item>

                        <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
    </div>
</template>
<script>
    import { startConnection } from '../../utils/signalR'
    import store from '@/store'
    import { mapState } from 'vuex'
    import bus from './bus';

    //局部引入 使用方法 https://blog.csdn.net/qq_35366269/article/details/100097760
    import Driver from 'driver.js';
    import 'driver.js/dist/driver.min.css';
    import steps from '../../utils/steps.js'

    export default {
        data() {
            return {
                collapse: false,
                fullscreen: false,
                name: 'linseed',
                //message: 0
            };
        },
        computed: {
            username() {
                let username = sessionStorage.getItem('sms_user');
                return username ? username : this.name;
            },
            ...mapState({
                noticeList: state => state.notice.noticeList
            }),
            message() {
                return this.noticeList.length;
            },
        },
        methods: {
            // 用户名下拉菜单选择事件
            handleCommand(command) {
                if (command == 'logout') {
                    sessionStorage.removeItem('sms_user')
                    this.$router.push('/login');
                    this.$api.login.logout().then((res) => {

                        if (res.code == 200) {
                            //this.$router.push('/login');  // 登录成功，跳转到主页
                        }
                    }).catch((res) => {
                        this.$message({
                            message: res.message,
                            type: 'error'
                        })
                    });

                }
                else if (command == "editPassword") {
                    this.$router.push('/sys/password');
                }
            },
            // 侧边栏折叠
            collapseChage() {
                this.collapse = !this.collapse;
                bus.$emit('collapse', this.collapse);
            },
            handleGithub(){
                window.open("https://github.com/laughAnd/template");
            },
            // 全屏事件
            handleFullScreen() {
                let element = document.documentElement;
                if (this.fullscreen) {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    }
                } else {
                    if (element.requestFullscreen) {
                        element.requestFullscreen();
                    } else if (element.webkitRequestFullScreen) {
                        element.webkitRequestFullScreen();
                    } else if (element.mozRequestFullScreen) {
                        element.mozRequestFullScreen();
                    } else if (element.msRequestFullscreen) {
                        // IE11
                        element.msRequestFullscreen();
                    }
                }
                this.fullscreen = !this.fullscreen;
            },

            handleIntroduce() {
                // 定义步骤
                this.driver.defineSteps(steps);
                // 启动
                this.driver.start();
            },
            callBack(data) {//消息推送的回调方法
                let msg = '';
                if (data.title.length > 13)
                    msg = '收到短信回执，消息批次号：' + data.title;
                else
                    msg = '收到短信,来自：' + data.title;

                this.$notify({
                    title: '消息通知',
                    message: msg,
                });
                store.commit('setNoticeList', data)
            },
        },
        mounted() {
            if (document.body.clientWidth < 1500) {
                this.collapseChage();
            }

            startConnection(this.callBack);
        },
        created() {
            this.driver = new Driver({
                animate: true, // 是否启动动画
                opacity: 0.25, // 背景透明度设置，0表示背景完全透明
                allowClose: false,
                doneBtnText: '完成',
                closeBtnText: '关闭',
                nextBtnText: '下一个',
                prevBtnText: '上一个',
                onHighlightStarted: Element => {
                    // console.log('onHighlightStarted()被调用了');
                    // console.log(Element)
                    Element.node.style.color = '#000'
                },
                onHighlighted: Element => {
                    //console.log('onHighlighted()被调用了');
                },
                onDeselected: Element => { // 取消选择时被调用
                    //console.log('onDeselected()被调用了');
                    // onDeselected()被调用了
                    Element.node.style.color = '#fff'
                },
                onReset: Element => { // 关闭
                    //console.log('onReset()被调用了');
                    Element.node.style.color = '#fff'
                },
                onNext: Element => {
                    //console.log('onNext()被调用了');
                    Element.node.style.color = '#000'
                },
                onPrevious: Element => {
                    //console.log('onPrevious()被调用了');
                }
            })
        }
    };
</script>
<style scoped>
    .header {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 70px;
        font-size: 22px;
        color: #fff;
    }

    .collapse-btn {
        float: left;
        padding: 0 21px;
        cursor: pointer;
        line-height: 70px;
    }

    .header .logo {
        float: left;
        width: 250px;
        line-height: 70px;
    }

    .header-right {
        float: right;
        padding-right: 50px;
    }

    .header-user-con {
        display: flex;
        height: 70px;
        align-items: center;
    }

    .btn-intro {
        margin-right: 20px;
        font-size: 24px;
    }

    .btn-fullscreen {
        /* transform: rotate(45deg); */
        margin-right: 10px;
        font-size: 24px;
    }

    .btn-bell,
    .btn-fullscreen {
        position: relative;
        width: 30px;
        height: 30px;
        text-align: center;
        border-radius: 15px;
        cursor: pointer;
    }

    .btn-bell-badge {
        position: absolute;
        right: 0;
        top: -2px;
        width: 8px;
        height: 8px;
        border-radius: 4px;
        background: #f56c6c;
        color: #fff;
    }

    .btn-bell .el-icon-bell {
        color: #fff;
    }

    .user-name {
        margin-left: 10px;
    }

    .user-avator {
        margin-left: 20px;
    }

    .user-avator img {
        display: block;
        width: 40px;
        height: 40px;
        border-radius: 50%;
    }

    .el-dropdown-link {
        color: #fff;
        cursor: pointer;
    }

    .el-dropdown-menu__item {
        text-align: center;
    }
</style>