/**
 * Copyright 2018 SPARKL Limited
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Sparkl API calls.
 */
import axios from 'axios'
import util from '../util'
import parser from '../util/parser'

var server = axios.create({
  baseURL: '',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'application/json'
  }
})

/**
 * Transforms shallow object into url query string
 *
 * @param {Object} data
 *
 * @return {String}
 */
const encodePayload = (data) => {
  let str = []

  for (let p in data) {
    if (data.hasOwnProperty(p) && data[p]) {
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(data[p]))
    }
  }

  return str.join('&')
}

/**
 * Creates a change that will be uploaded to SPARKL.
 * If "update" parameter is provided, SPARKL will first delete the "update"
 * folder and only then append "xml".
 *
 * This is useful when replacing a folder (even if the folder's name was changed)
 *
 * @param {String} xml    - Sparkl xml configuration
 * @param {String} update - Name of the node that will be replaced with the new
 * configuration.
 *
 * @return {type} Description
 */
var createChange = (xml, update) => {
  var remove = ''
  var change = typeof xml === 'string'
    ? xml
    : parser.xml2String(xml)

  if (update) {
    remove = '<delete name="' + update + '"/>'
  }

  return '<change>' + remove + change + '</change>'
}
/**
 * List of api calls
 */
var api = {
  server,
  setBaseUrl (url) {
    // if (url.indexOf('http') !== 0) {
    //   url = 'http://' + url
    // }
    server.defaults.baseURL = url
    // console.log('API: Set baseURL to ' + url)
  },
  ping (nodeName) {
    return server.get('sse/ping' + (nodeName ? ('?node=' + nodeName) : ''))
  },
  authenticate (email, password) {
    return server.post('sse_cfg/user', { email, password }, {
      transformRequest: [encodePayload]
    })
  },
  authenticateCognito (tokens) {
    return server.post('svc_cognito/tokens', tokens, {
      transformRequest: [encodePayload]
    })
  },
  deleteChange () {
    return server.delete('sse_cfg/change')
  },
  dispatch (type, data) {
    return server.post('sse_svc_dispatcher/' + type, JSON.stringify(data), {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
  },
  mix (path = '') {
    return server.get('sse_cfg/mix/' + path)
  },
  signout () {
    return server.post('sse_cfg/signout')
  },
  content (path = '') {
    return server.get('sse_cfg/content/' + path)
  },
  object (path = '') {
    return server.get('sse_cfg/object/' + path)
  },
  graph (path = '') {
    return server.get('svc_sequencer/graph/' + path)
  },
  objectSubr (path = '') {
    return server.get('svc_subr/subroutines/' + path)
  },
  exists (path = '') {
    return new Promise((resolve, reject) => {
      server.get('sse_cfg/object/' + path)
        .then(({data}) => resolve(!!data.tag))
        .catch(() => resolve(false))
    })
  },
  objects (objects) {
    if (Array.isArray(objects)) {
      objects = objects.join(' ')
    }
    var uri = encodeURI(objects)
    return server.get(`/sse_cfg/objects?objects=${uri}`)
  },
  info (nodeName = '') {
    return new Promise((resolve, reject) => {
      api.ping(nodeName).then(response => {
        var node = response.data.attr

        if (!nodeName) {
          nodeName = node.node
        }

        server.get('sse/info?node=' + nodeName)
          .then(response => {
            var data = response.data
            var nodes = util.wsSplit(data.attr.nodes)

            nodes.push(data.attr.node)
            nodes.sort()

            resolve({node, nodes, data})
          })
          .catch(reject)
      })
    })
  },
  extension: {
    start (nodeName, extName) {
      return server
        .post(`sse/extension/start?node=${nodeName}&extension=${extName}`)
    },
    stop (nodeName, extName) {
      return server
        .post(`sse/extension/stop?node=${nodeName}&extension=${extName}`)
    },
    info (nodeName, extName) {
      return server
        .post(`sse/extension/info?node=${nodeName}&extension=${extName}`)
    }
  },
  source: {
    get (path, mimeType = 'application/xml') {
      let headers = {
        'Accept': mimeType,
        'Content-Type': mimeType
      }

      return server.get('sse_cfg/source/' + path, { headers })
    },
    update (path, xml, foldername) {
      var url = '/sse_cfg/change/' + path
      var change = createChange(xml, foldername)

      return server.post(url, change, {
        headers: {
          'x-sparkl-transform': 'gen_change',
          'Accept': 'application/json',
          'Content-Type': 'application/xml'
        }
      })
    },
    upload (path, formdata) {
      return server.post(`/sse_cfg/change/${path}`, formdata, {
        contentType: false,
        headers: {
          'Accept': 'application/json',
          'x-sparkl-transform': 'gen_change'
        }
      })
    }
  },
  service: {
    start (object) {
      return server.post(`sse_svc/start/${object}`)
    },
    stop (object) {
      return server.post(`sse_svc/stop/${object}`)
    },
    stopAll (ids) {
      var promises = ids.map(id => {
        return api.service.stop(id)
      })

      return Promise.all(promises)
    },
    status (object) {
      return server.get(`sse_svc/status/${object}`)
    },
    list (object = '') {
      return new Promise((resolve, reject) => {
        server.get('sse_svc/status/' + object)
          .then(response => {
            var services = ''

            try {
              services = response.data.attr.services
            } finally {
              if (services.length === 0) {
                resolve([])
              } else {
                api.objects(services)
                  .then(response => {
                    resolve(response.data.content)
                  })
                  .catch(reject)
              }
            }
          })
          .catch(reject)
      })
    }
  },
  license: {
    upload (node, text) {
      return server.post('sse_license/license?node=' + node, text)
    }
  },
  user: {
    create (email, password) {
      return server.post('sse_cfg/register', { email, password }, {
        transformRequest: [encodePayload]
      })
    },
    self () {
      return server.get('sse_cfg/user')
    },
    list () {
      return server.get('sse_cfg/users')
    },
    delete (id) {
      return server.delete('sse_cfg/user/' + id)
    },
    setValue (userId, key, value, tail = '') {
      return server
        .post(`sse_cfg/user/${userId}?item=${key}&${key}=${value}${tail}`)
    },
    setPassword (id, password, tail) {
      return api.user.setValue(id, 'password', password, tail)
    },
    setAdmin (id, admin, tail) {
      return api.user.setValue(id, 'admin', admin, tail)
    }
  }
}

export default api
