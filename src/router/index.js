/**
 * @copyright 2017 SPARKL Limited. All Rights Reserved
 * @author <yev@sparkl.com> Yevheniy Vlasenko
 *
 * This file contains a mapping of URL routes and corresponding components
 * that should be rendered when a specific route is opened.
 *
 * More about vue-router: https://router.vuejs.org/en/
 */
import VueRouter from 'vue-router'
import Container from 'components/Container'
import Browser from 'components/routes/Browser'
import Services from 'components/routes/Services'
import Nodes from 'components/routes/Nodes'
import NotFound from 'components/routes/NotFound'
import Users from 'components/routes/Users'
import SignIn from 'components/SignInView'
import store from 'src/store'
import api from 'src/api'
/**
 * Checks if user is authenticated
 *
 * @param {type} next - Callback
 */
const authenticated = (next) => {
  store.dispatch('fetchUser')
    .then(user => {
      next(user && user.id && user.id !== 'G-0-0-0')
    })
    .catch(() => {
      next(false)
    })
}
/**
 * Redirects user to /browser page if user is authenticated
 *
 * @param {Object} to     - "Browser" page metadata
 * @param {Object} from   - Previous page metadata (likely "SignIn")
 * @param {Function} next - Callback
 */
const redirectToBrowser = (to, from, next) => {
  authenticated(flag => {
    flag
      ? next({ path: '/browser' })
      : next()
  })
}
/**
 * Mapping of routers to components
 */
const router = new VueRouter({
// Turn it on if you don't want /#/ links
//  mode: 'history',
  routes: [
    {
      path: '/signin',
      component: SignIn,
      beforeEnter: redirectToBrowser
    },
    {
      path: '/signout',
      beforeEnter (to, from, next) {
        api.signout()
          .then(() => {
            next({ path: '/signin' })
          })
          .catch(() => {
            next({ path: '/signin' })
          })
      }
    },
    {
      path: '/',
      component: Container,
      beforeEnter (to, from, next) {
        authenticated(flag => {
          flag
            ? next()
            : next({ path: '/signin' })
        })
      },
      children: [
        {
          path: 'users',
          component: Users
        },
        {
          path: 'nodes',
          component: Nodes
        },
        {
          path: 'browser',
          component: Browser
        },
        {
          path: 'services',
          component: Services
        },
        {
          path: '*',
          redirect: 'browser'
        }
      ]
    },
    {
      path: '*',
      component: NotFound
    }
  ]
})

export default router
