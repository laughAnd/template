export default {
  state: {
    noticeList: [],  // 短信推送通知列表
  },
  getters: {

  },
  mutations: {
    setNoticeList(state, list) {  // 设置短信推送通知列表
      state.noticeList.splice(0, 0, list);
    },
    removeNoticeListItem(state, index) {
      state.noticeList.splice(index, 1);
    },
    removeNoticeList(state) {
      state.noticeList = [];
    }
  },
  actions: {
  }
}