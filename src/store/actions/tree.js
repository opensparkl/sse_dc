/**
 * @copyright 2017 SPARKL Limited. All Rights Reserved
 * @author <yev@sparkl.com> Yevheniy Vlasenko
 */
import api from '@/api'

const getTreeRoot = () => {
  return api.user.self()
    .then(response => {
      let user = response.data.attr
      let root = {
        tag: 'folder',
        attr: {
          id: user.id,
          path: user.name + '/',
          name: user.name
        },
        content: [],
        owner: user.name
      }

      return root
    })
}

export default {
  fetchTreeRoot ({ commit }, { userId }) {
    return new Promise((resolve, reject) => {
      getTreeRoot()
        .then(root => {
          commit('SET_TREE_ROOT', root)
          resolve(root)
        })
        .catch(reject)
    })
  },

  fetchTreeNode ({ commit }, { path }) {
    return new Promise((resolve, reject) => {
      api.object(path)
        .then(response => response.data)
        .then(node => {
          let payload = { path, node }

          commit('SET_TREE_NODE', payload)
          resolve(payload)
        })
        .catch(reject)
    })
  },

  fetchTreeBranch ({ commit }, { path }) {
    return new Promise((resolve, reject) => {
      api.content(path)
        .then(response => response.data)
        .then(node => {
          let content = node.content || []
          let payload = { path, content }

          commit('SET_TREE_NODE_CONTENT', payload)
          resolve(payload)
        })
        .catch(reject)
    })
  }
}
