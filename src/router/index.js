import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login'
import NotFound from '@/views/Error/404'
import Home from '@/views/Home'
import Dashboard from '@/views/Main/Dashboard'
import Notice from '@/views/Main/Notice'
import api from '@/http/api'
import store from '@/store'
import { isURL } from '@/utils/validate'


const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error)
}

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: '首页',
      component: Home,
      meta: { title: '首页' },
      redirect: '/dashboard',
      children: [
        { path: '/dashboard', component: Dashboard, name: 'Dashboard', meta: { title: 'Dashboard' } },
        { path: '/notice', component: Notice, name: '消息通知', meta: { title: '消息通知' } },
        {
          path: '/404',
          name: 'notFound',
          meta: { title: '404' },
          component: NotFound
        },
      ]
    },
    {
      path: '/login',
      name: '登录',
      component: Login
    }
    , {
      path: '/404',
      name: 'notFound',
      meta: { title: '404' },
      component: NotFound
    },
    {
      path: '/',
      redirect: '/dashboard'
    }
  ]
})

router.beforeEach((to, from, next) => {
  // 登录界面登录成功之后，会把用户信息保存在会话
  // 存在时间为会话生命周期，页面关闭即失效。
  let userName = sessionStorage.getItem('sms_user')
  if (to.path === '/login') {
    // 如果是访问登录界面，如果用户会话信息存在，代表已登录过，跳转到主页
    if (userName) {
      next({ path: '/' })
    } else {
      next()
    }
  } else {
    if (!userName) {
      // 如果访问非登录界面，且户会话信息不存在，代表未登录，则跳转到登录界面
      next({ path: '/login' })
    } else {
      // 加载动态菜单和路由
      addDynamicMenuAndRoutes(userName)
      next()
    }
  }
})

/**
* 加载动态菜单和路由
*/
function addDynamicMenuAndRoutes(userName) {
  if (store.state.app.menuRouteLoaded) {
    console.log('动态菜单和路由已经存在.')
    return
  }
  //加载 下拉框缓存
  api.dict.all().then(res => {
    console.log(res.data)
    store.commit('setDict', res.data)
  })

  api.menu.nav()
    .then(res => {
      // 添加动态路由
      console.log("route data")
      console.log(res.data)
      let dynamicRoutes = addDynamicRoutes(res.data)
      router.options.routes[0].children = router.options.routes[0].children.concat(dynamicRoutes)
      router.addRoutes(router.options.routes);
      // 保存加载状态
      store.commit('menuRouteLoaded', true)
      // 保存菜单树
      store.commit('setNavTree', res.data)
    }).then(res => {
      api.user.findPermissions({ 'name': userName }).then(res => {
        // 保存用户权限标识集合
        store.commit('setPerms', res.data)
      })
    })
    .catch(function (res) {
      alert(res);
    });
}

/**
* 添加动态(菜单)路由
* @param {*} menuList 菜单列表
* @param {*} routes 递归创建的动态(菜单)路由
*/
function addDynamicRoutes(menuList = [], routes = []) {
  var temp = []
  for (var i = 0; i < menuList.length; i++) {
    if (menuList[i].Children && menuList[i].Children.length >= 1) {
      temp = temp.concat(menuList[i].Children)
    } else if (menuList[i].F_Url && /\S/.test(menuList[i].F_Url)) {
      menuList[i].F_Url = menuList[i].F_Url.replace(/^\//, '')
      // 创建路由配置
      var route = {
        path: menuList[i].F_Url,
        component: null,
        name: menuList[i].F_MenuName,
        meta: {
          title: menuList[i].F_MenuName,
          menuId: menuList[i].F_Id,
          isDynamic: true,
          isTab: true,
          iframeUrl: ''
        }
      }
      // url以http[s]://开头, 通过iframe展示
      if (isURL(menuList[i].F_Url)) {
        route['path'] = menuList[i].F_Url
        route['name'] = menuList[i].F_UserName
        route['meta']['iframeUrl'] = menuList[i].F_Url
      } else {
        try {
          // 根据菜单URL动态加载vue组件，这里要求vue组件须按照url路径存储
          // 如url="sys/user"，则组件路径应是"@/views/sys/user.vue",否则组件加载不到
          let array = menuList[i].F_Url.split('/')
          let url = array[0].substring(0, 1).toUpperCase() + array[0].substring(1) + '/' + array[1].substring(0, 1).toUpperCase() + array[1].substring(1)
          route['component'] = resolve => require([`@/views/${url}`], resolve)
        } catch (e) { }
      }
      routes.push(route);
    }
  }
  if (temp.length >= 1) {
    addDynamicRoutes(temp, routes)
  } else {
    console.log('动态路由加载...')
    console.log(routes)
    console.log('动态路由加载完成.')
  }
  return routes
}

export default router