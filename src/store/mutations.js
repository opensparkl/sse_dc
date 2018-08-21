/**
 * @copyright 2017 SPARKL Limited. All Rights Reserved
 * @author <yev@sparkl.com> Yevheniy Vlasenko
 *
 * Set of functions that mutate the global state of the application.
 *
 * The only way to actually change state in a Vuex store is by committing
 * a mutation. Vuex mutations are very similar to events: each mutation has
 * a string type and a handler.
 */
import Vue from 'vue'
import path from 'path'

const containers = ['folder', 'mix', 'service']

const findObjectByPath = (roots, path) => {
  let nodeNames = path.split(/\/+/gi).filter(v => v)
  let root = roots[nodeNames[0]]

  if (!root) {
    throw new Error(`Root ${nodeNames[0]} does not exist`)
  }

  let current = root

  for (let i = 1; i < nodeNames.length; i++) {
    let nodeName = nodeNames[i]

    if (!current.content) {
      throw new Error(`Node ${nodeName} does not have content`)
    }

    let next = current.content.find(v => {
      return v.attr.name === nodeName &&
        containers.indexOf(v.tag) !== -1
    })

    if (current) {
      current = next
    } else {
      throw new Error(`Node ${nodeName} does not exist in ..`)
    }
  }

  return current
}

const getParentPath = (value) => {
  return path.join(value, '../')
}

const split = (path) => {
  let chunks = path.split(/\/+/gi).filter(v => v)

  return {
    head: chunks[0],
    tail: chunks.slice(1)
  }
}

export default {
  CLEAN (state) {
    state.node = null
    state.tree = {
      filterTypes: {
        field: false,
        service: false
      },
      selected: '',
      roots: {}
    }
  },
  SET_USER (state, object) {
    state.user = object
  },

  SET_AUTH_FLOW (state, flow) {
    state.authFlow = flow
  },

  SET_AUTH_FLOW_OPTIONS (state, flows) {
    state.authFlowOptions = flows
  },

  SET_SELECTED_NODE (state, node) {
    state.node = node
  },

  SELECT_TREE_NODE_ID (state, id) {
    state.tree.selected = id
  },

  ADMIN_SET_USERS (state, users) {
    state.users = users || []
  },

  SET_TREE_ROOT (state, root) {
    Vue.set(state.tree.roots, root.owner, root)
  },

  ADD_FILTER (state, filter) {
    Vue.set(state.tree.filterTypes, filter, true)
  },

  REMOVE_FILTER (state, filter) {
    Vue.set(state.tree.filterTypes, filter, false)
  },

  TOGGLE_FILTER (state, filter) {
    let value = state.tree.filterTypes[filter]
    state.tree.filterTypes[filter] = !value
  },

  TREE_NODE_OPEN (state, { path }) {
    let { tree } = state
    let node = findObjectByPath(tree.roots, path)

    Vue.set(node, 'opened', true)
  },

  TREE_NODE_CLOSE (state, { path }) {
    let { tree } = state
    let node = findObjectByPath(tree.roots, path)

    Vue.set(node, 'opened', false)
  },

  SET_TREE (state, { id, root, selected = '' }) {
    Vue.set(state.tree, 'selected', '')
    Vue.set(state.tree.roots, id, root)
  },

  SET_TREE_NODE (state, { path, node }) {
    if (!path) {
      throw new Error(`SET_TREE_NODE: Path "${path}" is too short or not valid`)
    }

    let { tree } = state
    let { head } = split(path)

    if (tree.roots.hasOwnProperty(head)) {
      let parentPath = getParentPath(path)

      if (parentPath !== './') {
        let parent = findObjectByPath(tree.roots, parentPath)
        let self = parent.content
          .find(v => {
            return v.tag === node.tag && v.attr.name === node.attr.name
          })

        Vue.set(self, 'attr', node.attr)
      }
    }
  },

  SET_TREE_NODE_CONTENT (state, { path, content }) {
    if (!path) {
      throw new Error(`SET_TREE_NODE_CONTENT:
        Path "${path}" is too short or not valid`)
    }

    let { tree } = state
    let { head } = split(path)

    if (tree.roots.hasOwnProperty(head)) {
      let node = findObjectByPath(tree.roots, path)

      Vue.set(node, 'content', content || [])
    } else {
      throw new Error(`SET_TREE_NODE_CONTENT:
        Tree root ${head} does not exist`)
    }
  },

  INIT_SESSION (state) {
    state.sessionId = Math.random().toString()
  }
}
