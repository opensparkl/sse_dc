/**
 * @copyright 2017 SPARKL Limited. All Rights Reserved
 * @author <yev@sparkl.com> Yevheniy Vlasenko
 *
 * Splits whitespace-separated string and removes empty items
 *
 * @param {String} value - Whitespace-separated string
 *
 * @return {Array}       - Filtered array of words
 */
export const wsSplit = (value) => {
  if (Array.isArray(value)) {
    return value
  }

  return typeof value === 'string'
    ? value.split(/\s+/g).filter(v => !!v.trim())
    : []
}
/**
 * Creates a file and triggers browser download
 *
 * @param {String} text  - Content of the new file
 * @param {String} title - Title of the new file
 * @param {String} ext   - File extension (leave blank if none)
 */
export const download = (text = '', title = '', ext = '') => {
  let element = document.createElement('a')
  let href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(text)
  let filename = title

  if (ext) {
    filename += '.' + ext
  }

  element.setAttribute('href', href)
  element.setAttribute('download', filename)
  element.style.display = 'none'

  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

export default { wsSplit, download }
