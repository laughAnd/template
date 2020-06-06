import axios from '../axios'

/* 
 * 菜单
 */


//导航
export const nav = () => {
  return axios({
    url: '/menu/nav',
    method: 'get'
  })
}
//树
export const tree = () => {
  return axios({
    url: '/menu/tree',
    method: 'get'
  })
}

//角色权限id列表
export const roleMenuIds = (role) => {
  return axios({
    url: '/menu/' + role,
    method: 'get'
  })
}


export const add = data => {
  return axios({
    url: '/menu',
    method: 'post',
    data
  })
}
export const edit = data => {
  return axios({
    url: '/menu',
    method: 'put',
    data
  })
}

export const del = (data) => {
  return axios({
    url: '/menu',
    method: 'delete',
    data
  })
}




