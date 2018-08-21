/**
 * @copyright 2017 SPARKL Limited. All Rights Reserved
 * @author <yev@sparkl.com> Yevheniy Vlasenko
 *
 * Actions are similar to mutations, the differences being that:
 *    - Instead of mutating the state, actions commit mutations.
 *    - Actions can contain arbitrary asynchronous operations.
 *
 * https://vuex.vuejs.org/en/actions.html
 */
import tree from './tree'
import other from './other'

export default {
  ...tree,
  ...other
}
