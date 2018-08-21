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
 * AWS Cognito authentication calls.
 */
import api from '@/api'
import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
  AuthenticationDetails
} from 'amazon-cognito-identity-js'

var cognito = {
  pool: null,

  getPool: function (callback) {
    if (cognito.pool) {
      return callback(null, cognito.pool)
    }

    api.server.get('/svc_cognito/details')
      .then(response => {
        let attr = response.data.attr

        cognito.pool = new CognitoUserPool({
          UserPoolId: attr.user_pool_id,
          ClientId: attr.app_client_id
        })

        callback(null, cognito.pool)
      })
      .catch(err => {
        callback(err.response || err)
      })
  },

  signup: function (email, password, callback) {
    var attributes = [
      new CognitoUserAttribute({
        Name: 'email',
        Value: email
      })
    ]

    cognito.getPool(function (err, pool) {
      if (err) {
        return callback(err)
      }

      pool.signUp(email, password, attributes, null, callback)
    })
  },

  confirm: function (email, confirmCode, callback) {
    cognito.getUser(email, function (err, user) {
      if (err) {
        return callback(err)
      }

      user.confirmRegistration(confirmCode, true, callback)
    })
  },

  resetPassword: function (email, callback) {
    cognito.getUser(email, function (err, user) {
      if (err) {
        return callback(err)
      }

      user.forgotPassword({
        onSuccess: (data) => { callback(null, data) },
        onFailure: callback
      })
    })
  },

  confirmResetPassword: function (email, verificationCode, newPassword, callback) {
    cognito.getUser(email, function (err, user) {
      if (err) {
        return callback(err)
      }

      user.confirmPassword(verificationCode, newPassword, {
        onSuccess: (data) => { callback(null, data) },
        onFailure: callback
      })
    })
  },

  changePassword: function (email, oldPassword, newPassword, callback) {
    cognito.getUser(email, function (err, user) {
      if (err) {
        return callback(err)
      }

      user.getSession(function (err, session) {
        if (err) {
          return callback(err)
        }

        user.changePassword(oldPassword, newPassword, callback)
      })
    })
  },

  getUser: function (email, callback) {
    cognito.getPool(function (err, pool) {
      if (err) {
        return callback(err)
      }

      var user = new CognitoUser({
        Username: email,
        Pool: pool
      })

      callback(null, user)
    })
  },

  resend: function (email, callback) {
    cognito.getUser(email, function (err, user) {
      if (err) {
        return callback(err)
      }

      user.resendConfirmationCode(callback)
    })
  },

  login: function (email, password, callback) {
    cognito.getUser(email, function (err, user) {
      if (err) {
        return callback(err)
      }

      var authenticationDetails = new AuthenticationDetails({
        Username: email,
        Password: password
      })

      user.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
          callback(null, {
            'id_token': result.getIdToken().getJwtToken(),
            'access_token': result.getAccessToken().getJwtToken(),
            'refresh_token': result.getRefreshToken().getToken()
          })
        },
        onFailure: function (err) {
          callback(err)
        }
      })
    })
  },

  sse_login: function (tokens, callback) {
    api
      .authenticateCognito(tokens)
      .then(response => {
        callback(null, response.data)
      })
      .catch(error => {
        callback(error.response)
      })
  },

  full_login: function (email, password, callback) {
    cognito.login(email, password, function (err, tokens) {
      if (err) {
        return callback(err)
      }

      cognito.sse_login(tokens, callback)
    })
  },

  logout: function (email, callback) {
    cognito.getUser(email, function (err, user) {
      if (err) {
        return callback(err)
      }

      user.globalSignOut({
        onSuccess: function (result) {
          callback(null, result)
        },
        onFailure: function (err) {
          callback(err)
        }
      })
    })
  }
}

export default cognito
