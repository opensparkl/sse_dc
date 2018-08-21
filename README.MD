## Building scripts

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8099
npm run dev

# build for debugging
npm run debug

# build for production with minification
npm run build

# run linter
npm run lint
```

## Project structure

* `build` - building scripts.<br>
* `config` - configuration for building scripts.
* `dist`- built files, ready for distribution.
* `static` - static assets (images, xsls, etc).
* `test` - unit & regression tests for ui.
* `src` - source code.
  * `api` - api calls to sparkl and aws cognito.
  * `generated` - generated during `prebuild` phase files (for example, json with git commit hash).
  * `plugins` - self-written Vue.js plugins.
  * `router` - code for handling page navigation (see `vue-router`).
  * `store` - code for handling global application state (see `vuex`).
  * `styles` - SCSS stylesheets for default HTML components (buttons, tables, etc).
  * `util` - javscript utility libraries.
  * `App.vue` - root component.
  * `main.js` - application entery point (main file).

## Config

### API

It is possible to overwrite default values of configuration and cache these changes in localStorage.

Example:
```javascript
// Set values
config.set('foo.bar', true)

// Get particular param
config.get('foo.bar')

// Whole merged config
config.get()

// Only cached changes
config.localStorage()

// Only source (not changed) version of the configuration
config.source()

// Application version
config.version()

// Git commit hash of the current build
config.hash()
```

### Structure

Example of `config.json` file:

```
{
  "debug": false,
  "authFlow": "cognito",
  "helpURL": "http://docs.sparkl.com",
  "githubURL": "https://github.com/sparkl/",
  "router": {
    "url": "http://localhost:8000",
    "editable": false
  },
  "icons": {
    "service" : "fa-sitemap",
    ...
  }
}
```
