/**
 * @copyright 2017 SPARKL Limited. All Rights Reserved
 * @author <yev@sparkl.com> Yevheniy Vlasenko
 *
 * Config class that allows for reading/writing json config at runtime as well as
 * creating "patches" in localStorage.
 */
import version from '../generated/version.json'
/**
 * Recursively copies fields from "source" into "target".
 * "target" object is mutated.
 *
 * @param {Object} target
 * @param {Object} source
 */
var join = function (target, source) {
  for (var i in source) {
    if (source.hasOwnProperty(i)) {
      if (typeof source[i] === 'object') {
        if (typeof target[i] !== 'object') {
          target[i] = {}
        }
        join(target[i], source[i])
      } else {
        target[i] = source[i]
      }
    }
  }
}

/**
 * Creates a complete deep copy of an object
 *
 * @param {Object} object - Source object
 *
 * @return {Object}       - Cloned object
 */
var clone = function (object) {
  if (object == null || typeof (object) !== 'object') {
    return object
  }

  var temp = new object.constructor()

  for (var key in object) {
    temp[key] = clone(object[key])
  }

  return temp
}

/**
 * Clones "source" and merges it with "diff"
 *
 * @param {Object} source - Source object
 * @param {Object} diff   - Patch that will be applied to "source" clone
 *
 * @return {Object}
 */
var merge = function (source, diff) {
  var object = clone(source)
  join(object, diff)

  return object
}

/**
 * Returns a property value in a deep object at a specified path.
 *
 * @param {Object} object
 * @param {Array}  path - List of property names that create a path to the
 * value in deep object.
 *
 * @return {*|Error} - Property value or an error if such path does not exist.
 */
var getInObject = function (object, path) {
  var i = 0

  for (i = 0; i < path.length - 1; i++) {
    var prop = path[i]

    if (typeof object[prop] !== 'object') {
      throw new Error('Property "' + prop + '" is not an object')
    }

    object = object[prop]
  }

  return object[path[i]]
}

/**
 * Sets a property in a deep object at a specified path.
 *
 * Example:
 *
 * Soruce:
 *    { a: { b: { c: 0 } } }
 * Call:
 *    setInObject(source, ['a', 'b', 'c'], 999)
 * Result:
 *    { a: { b: { c: 999 } } }
 */
var setInObject = function (object, path, value) {
  var i = 0

  for (i = 0; i < path.length - 1; i++) {
    var prop = path[i]

    if (object.hasOwnProperty(prop)) {
      if (typeof object[prop] !== 'object') {
        throw new Error('Property "' + prop + '" is not an object')
      }
    } else {
      object[prop] = {}
    }

    object = object[prop]
  }

  object[path[i]] = value
  return false
}

/**
 * Config class constructor
 */
var Config = function (source) {
  var CONFIG_ID = 'config'

  var getLocalStorageConfig = function () {
    return JSON.parse(
      localStorage.getItem(CONFIG_ID) || '{}'
    )
  }

  this._source = source

  this.source = () => {
    return this._source
  }

  this.set = (key, value) => {
    var cached = this.localStorage()
    var path = key.split('.')

    setInObject(cached, path, value)
    localStorage.setItem(CONFIG_ID, JSON.stringify(cached))
  }

  this.get = (key) => {
    var merged = merge(this._source, this.localStorage())

    if (key) {
      var path = key.split('.')
      return getInObject(merged, path)
    }

    return merged
  }

  this.localStorage = () => {
    return getLocalStorageConfig()
  }

  this.clean = () => {
    console.warn('Removed cached config chages')
    localStorage.setItem(CONFIG_ID, '{}')
  }

  this.version = () => {
    return version.version
  }

  this.hash = () => {
    return version.hash
  }
}

export default Config
