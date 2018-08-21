/**
 * @copyright 2017 SPARKL Limited. All Rights Reserved
 * @author <yev@sparkl.com> Yevheniy Vlasenko
 *
 * Tiny plugin that sets window title.
 */
export default {
  install (Vue) {
    var title = null
    var defaultValue = null

    const $title = (text) => {
      if (!title) {
        title = document.querySelector('title')
        defaultValue = title.textContent
      }

      title.innerHTML = text || defaultValue
    }

    Object.defineProperty(Vue.prototype, '$title', {
      get: () => $title
    })
  }
}
