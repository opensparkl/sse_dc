/**
 * @copyright 2017 SPARKL Limited. All Rights Reserved
 * @author <yev@sparkl.com> Yevheniy Vlasenko
 */
import api from '@/api'

export default {
  fetchSelectedTreeNode ({state, commit}) {
    return new Promise((resolve, reject) => {
      if (state.tree.selected) {
        api.object(state.tree.selected)
          .then(response => {
            commit('SET_SELECTED_NODE', response.data || null)
            resolve()
          })
          .catch(error => {
            console.warn(error)

            commit('SET_SELECTED_NODE', null)
            resolve()
          })
      } else {
        commit('SET_SELECTED_NODE', null)
        resolve()
      }
    })
  },

  fetchUser ({commit}) {
    return new Promise((resolve, reject) => {
      api.user.self()
        .then(response => {
          let user = response.data.attr

          commit('SET_USER', user)
          resolve(user)
        })
        .catch(reject)
    })
  },

  fetchUsers ({commit}) {
    return new Promise((resolve, reject) => {
      api.user.list()
        .then(response => {
          let users = response.data.content.map(user => user.attr)

          commit('ADMIN_SET_USERS', users)
          resolve()
        })
        .catch(reject)
    })
  }
}
