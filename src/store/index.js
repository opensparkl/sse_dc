/**
 * @copyright 2017 SPARKL Limited. All Rights Reserved
 * @author <yev@sparkl.com> Yevheniy Vlasenko
 *
 * VueX store contains global application state.
 *
 * All data that is shared between multiple components should be stored
 * in this state object.
 *
 * Use this.$store to access inside components.
 *
 * https://vuex.vuejs.org/en/
 */
import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import getters from './getters'
import actions from './actions/index'
import mutations from './mutations'

Vue.use(Vuex)

const store = new Vuex.Store({
  state,
  actions,
  getters,
  mutations
})

export default store
