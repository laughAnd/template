<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157"
            text-color="#bfcbd9" active-text-color="#20a0ff">
            <template v-for="item in navTree">
                <template v-if="item.Children">
                    <el-submenu :key="'' + item.F_ID" :index="'' + item.F_Url">
                        <template slot="title">
                            <i :class="item.F_Icon"></i>
                            <span slot="title">{{ item.F_MenuName }}</span>
                        </template>
                        <template v-for="subItem in item.Children">
                            <el-submenu v-if="subItem.Children" :key="'' + subItem.F_ID" :index="'' + subItem.F_Url">
                                <template slot="title">{{ subItem.F_MenuName }}</template>
                                <el-menu-item v-for="(threeItem,i) in subItem.Children" :key="i"
                                    :index="'' + threeItem.F_Url" @click="HandleRouter(threeItem)">
                                    {{ threeItem.F_MenuName }}</el-menu-item>
                            </el-submenu>
                            <el-menu-item v-else :index="'' + subItem.F_Url" :key="'' + subItem.F_ID"
                                @click="HandleRouter(subItem)">
                                {{ subItem.F_MenuName }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="'' +item.F_Url" :key="item.F_ID" @click="HandleRouter(item)">
                        <i :class="item.F_Icon"></i>
                        <span slot="title">{{ item.F_MenuName }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import bus from './bus';
    import { mapState } from 'vuex'
    export default {
        data() {
            return {
                collapse: false,
            };
        },
        computed: {
            onRoutes() {
                // console.log("start");
                // console.log(this.$route.path)
                var data = this.$route.path.replace('/', '');
                console.log(data);
                return data;

                return this.$route.path.replace('/', '');
            },
            ...mapState({
                navTree: state => state.menu.navTree
            })
        },
        created() {
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
                bus.$emit('collapse-content', msg);
            });
        },
        methods: {
            HandleRouter(menu) {
                this.$router.push("/")
                this.$router.push(menu.F_Url)
            }
        }

    };
</script>

<style scoped>
    .sidebar {
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom: 0;
        overflow-y: scroll;
    }

    .sidebar::-webkit-scrollbar {
        width: 0;
    }

    .sidebar-el-menu:not(.el-menu--collapse) {
        width: 250px;
    }

    .sidebar>ul {
        height: 100%;
    }
</style>