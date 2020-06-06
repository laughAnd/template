import Vue from 'vue'
import vuex from 'vuex'

Vue.use(vuex);

import app from './modules/app'
import user from './modules/user'
import menu from './modules/menu'
import notice from './modules/notice'
import dict from './modules/dict'

const store = new vuex.Store({
  modules: {
    app: app,
    user: user,
    menu: menu,
    notice: notice,
    dict: dict
  }
})

export default store