/**
 * @copyright 2017 SPARKL Limited. All Rights Reserved
 * @author <yev@sparkl.com> Yevheniy Vlasenko
 *
 * Sparkl nodes are separated into groups depending on their rendering
 * requirements.
 *
 * This file contains a set of functions that allow converting Sparkl node
 * name to type and the most used type checks.
 */
var types = {
  service: ['service', 'link', 'node'],
  operation: ['notify', 'solicit', 'request', 'consume', 'reply', 'response'],
  container: ['folder', 'mix']
}

var groups = {
  renderable: ['operation', 'service', 'field', 'container'],
  extendable: ['request', 'consume', 'solicit'],
  primary: ['notify', 'solicit', 'request', 'consume'],
  secondary: ['reply', 'response']
}
/**
 * Gets tag out of struct
 * @param {string|object} type
 * @returns {string}
 */
export const getTag = (node) => {
  if (!node) {
    throw new Error('Type.getTag: node is null')
  }

  return node && node.hasOwnProperty('tag')
    ? node.tag
    : node
}

/**
 * Returns a type of Sparkl struct
 *
 * @param {String|Object} node
 *
 * @return {String}
 */
export const getType = (node) => {
  var tag = getTag(node)

  for (var typeName in types) {
    if (types[typeName].indexOf(tag) !== -1) {
      return typeName
    }
  }

  return tag
}
/**
 * Returns generalized type of the element, example:
 *   Notify --> Operation
 *   Link --> Service
 *
 * @param {string|object} type
 * @returns {string}
 */
const is = function (node, compared) {
  if (!node) {
    throw new Error('Type.is: node/tag is undefined')
  }

  if (!compared) {
    throw new Error('Type.is: comperison type is null')
  }

  return getType(node) === compared
}

/**
 * True for nodes that should be rendered
 * @param type
 * @returns {boolean}
 */
const isRenderable = function (node) {
  return groups.renderable.indexOf(getType(node)) !== -1
}

/**
 * True for operations that can have replies and responses
 * @param type
 * @returns {boolean}
 */
const isExtendable = function (node) {
  return groups.extendable.indexOf(getTag(node)) !== -1
}

const isContainer = function (node) {
  return is(getType(node), 'container')
}

/**
 * True for replies and responses
 * @param type
 * @returns {boolean}
 */
const isReply = (node) => {
  return groups.secondary.indexOf(getTag(node)) !== -1
}

const isPrimary = (node) => {
  return groups.primary.indexOf(getTag(node)) !== -1
}

module.exports = {
  getType,
  getTag,
  is,
  isPrimary,
  isReply,
  isRenderable,
  isExtendable,
  isContainer
}
