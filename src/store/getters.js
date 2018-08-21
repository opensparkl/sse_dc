/**
 * @copyright 2017 SPARKL Limited. All Rights Reserved
 * @author <yev@sparkl.com> Yevheniy Vlasenko
 * Usage pattern is "this.$store.state.getters.treeRoot".
 */
export default {
  treeRoot (state) {
    return state.tree.roots[state.user.name]
  }
}
