/**
 * @copyright 2017 SPARKL Limited. All Rights Reserved
 * @author <yev@sparkl.com> Yevheniy Vlasenko
 *
 * Initial state of the application.
 */
export default {
  sessionId: null,
  user: null,
  node: null,
  users: [],
  authFlow: null,
  authFlowOptions: [],
  tree: {
    filterTypes: {
      field: false,
      service: false
    },
    selected: '',
    roots: {}
  }
}
