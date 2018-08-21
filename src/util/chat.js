/**
 * @copyright 2017 SPARKL Limited. All Rights Reserved
 * @author <yev@sparkl.com> Yevheniy Vlasenko
 *
 * Gitter chat controller.
 */
import Gitter from 'gitter-sidecar'

const chat = new Gitter({
  room: 'sparkl/support',
  activationElement: '#gitter-room-btn'
})

const toggle = () => {
  let element = document.querySelector('aside.gitter-chat-embed')
  let state = element.className.indexOf('is-collapsed') !== -1

  chat.toggleChat(state)
}

export default { chat, toggle }
