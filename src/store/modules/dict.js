//维护数据字典  暂时不用
export default {
  state: {
    dataDict: [],  // 数据字典  维护下拉框
  },
  getters: {

  },
  mutations: {
    setKeyValue(state, param) {  // 设置数据字典
      state.dataDict[param.name] = param.data;
    },
    setDict(state, data) {
      state.dataDict = data;
    },
    clearDict(state) {  // 清空字典
      state.dataDict = [];
    }
  },
  actions: {
  }
}