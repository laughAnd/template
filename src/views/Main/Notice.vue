<template>
  <div class="">
    <div class="crumbs">
      <el-breadcrumb separator-class="el-icon-arrow-right" style="padding-left: 10px;">
        <el-breadcrumb-item>
          <i class="el-icon-date"></i> 系统管理
        </el-breadcrumb-item>
        <el-breadcrumb-item>消息通知</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <el-tabs v-model="message">
        <el-tab-pane :label="`未读消息(${unread.length})`" name="first">
          <el-table :data="unread" :show-header="false" style="width: 100%">
            <el-table-column>
              <template slot-scope="scope">
                <span v-if="scope.row.title.length<=15" class="message-title">收到消息：{{scope.row.title}}</span>
                <span v-else class="message-title">收到通知：{{scope.row.title}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="date" width="180"></el-table-column>
            <el-table-column width="200">
              <template slot-scope="scope">
                <el-button size="small" type="primary" @click="handleLink(scope.row.title)">查看详情</el-button>
                <el-button size="small" @click="handleRead(scope.$index)">标为已读</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="handle-row">
            <el-button type="primary" @click="handleReadAll()">全部标为已读</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="`已读消息(${read.length})`" name="second">
          <template v-if="message === 'second'">
            <el-table :data="read" :show-header="false" style="width: 100%">
              <el-table-column>
                <template slot-scope="scope">
                  <span class="message-title">短信回执编号：{{scope.row.title}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="date" width="150"></el-table-column>
              <el-table-column width="120">
                <template slot-scope="scope">
                  <el-button type="danger" @click="handleDel(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="handle-row">
              <el-button type="danger" @click="handleDelAll()">删除全部</el-button>
            </div>
          </template>
        </el-tab-pane>
        <el-tab-pane :label="`回收站(${recycle.length})`" name="third">
          <template v-if="message === 'third'">
            <el-table :data="recycle" :show-header="false" style="width: 100%">
              <el-table-column>
                <template slot-scope="scope">
                  <span class="message-title">短信回执编号：{{scope.row.title}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="date" width="150"></el-table-column>
              <el-table-column width="120">
                <template slot-scope="scope">
                  <el-button @click="handleRestore(scope.$index)">还原</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="handle-row">
              <el-button type="danger" @click="handleClear()">清空回收站</el-button>
            </div>
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>

  import { mapState } from 'vuex'
  import store from '@/store'

  export default {
    name: 'tabs',
    data() {
      return {
        message: 'first',
        showHeader: false,
        read: [
        ],
        recycle: [
        ]
      }
    },
    methods: {
      handleLink(title) {
        localStorage.setItem("current_msg", title);
        // if (title.length > 13)
        //   this.$router.push('/sms/receipt')
        // else
        //   this.$router.push('/sms/receive')
      },
      handleRead(index) {
        const item = this.unread.splice(index, 1);
        this.read = item.concat(this.read);
      },
      handleReadAll() {
        this.read = this.unread.concat(this.read);
        store.commit('removeNoticeList');
      },
      handleDel(index) {
        store.commit('removeNoticeListItem', index)
        const item = this.read.splice(index, 1);
        this.recycle = item.concat(this.recycle);
      },
      handleDelAll() {
        this.recycle = this.read.concat(this.recycle);
        this.read = [];
      },
      handleRestore(index) {
        const item = this.recycle.splice(index, 1);
        this.read = item.concat(this.read);
      },
      handleClear() {
        this.recycle = [];
      },
    },
    computed: {

      ...mapState({
        unread: state => state.notice.noticeList
      }),
      unreadNum() {
        return this.unread.length;
      },
    },
    mounted() {
      console.log(this.unread);
    },
  }

</script>

<style>
  .message-title {
    cursor: pointer;
  }

  .handle-row {
    margin-top: 30px;
  }
</style>