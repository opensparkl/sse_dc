/**
 * @copyright 2017 SPARKL Limited. All Rights Reserved
 * @author <yev@sparkl.com> Yevheniy Vlasenko
 *
 * Module contians functions that apply XSL transformations to XML input
 */
import parser from './parser'
import axios from 'axios'

var xsls = {}
var config = {}

/**
 * Returns the compiled stylesheet supplied in sourceNode.
 * IE version compiles xsl and returns an ActiveX processor.
 */
function compileXSL (sourceNode) {
  if (document.implementation && document.implementation.createDocument) {
    var xsl = new window.XSLTProcessor()
    xsl.importStylesheet(sourceNode)

    return xsl
  } else {
    throw new Error('XSLT: ActiveX and IE is not supported')
  }
}

/**
 * Transforms the supplied XML node using the compiled XSL stylesheet.
 * The optional params object is used to set the XSLT parameters if present.
 */
function transformXML (xml, xsl, params) {
  if (window.ActiveXObject || 'ActiveXObject' in window) {
    throw new Error('XSLT: IE transformXSL not supported')
  }

  xsl.clearParameters()

  if (params && typeof params === 'object') {
    for (var i in params) {
      if (params.hasOwnProperty(i)) {
        xsl.setParameter(null, i, params[i])
      }
    }
  }

  if (typeof xml === 'string') {
    xml = parser.string2Xml(xml)
  }

  return xsl.transformToFragment(xml, parser.document)
}

function transform (xslName, xml, callback, id) {
  var params = id ? {id} : null
  var xsl = xsls[xslName]

  if (xsl) {
    var result = transformXML(xml, xsl.xsl, params)
    if (callback) {
      callback(result)
    }
  } else {
    throw new Error(`XSL ${xslName} not found.`)
  }
};

var load = (name, url) => {
  return new Promise((resolve, reject) => {
    axios.get(url)
      .catch(() => resolve())
      .then(response => {
        try {
          if (config.debug) {
            console.log('XSLT: Compiling ' + url)
          }

          var xml = parser.string2Xml(response.data)
          var xsl = compileXSL(xml)

          resolve({name, url, xsl})
        } catch (e) {
          console.warn(e)
          resolve()
        }
      })
  })
}

function use (sources, params = {}) {
  config = params || {}

  let promises = []

  if (typeof sources === 'string') {
    sources = {
      default: sources
    }
  }

  if (config.debug) {
    console.log(`XSLT: Loading...`)
  }

  for (var key in sources) {
    promises.push(load(key, sources[key]))
  }

  Promise.all(promises).then(values => {
    xsls = values.reduce((set, value) => {
      if (value) set[value.name] = value
      return set
    }, {})
  })
}

export default {
  transform,
  use
}
