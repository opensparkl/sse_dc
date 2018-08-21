/**
 * @copyright 2017 SPARKL Limited. All Rights Reserved
 * @author <yev@sparkl.com> Yevheniy Vlasenko
 *
 * XML parser.
 */
var XMLParser
var xmlDocument = document.implementation.createDocument('', '', null)

if (window.DOMParser) {
  XMLParser = function (xmlStr) {
    return (new window.DOMParser()).parseFromString(xmlStr, 'text/xml')
  }
} else if (typeof ActiveXObject !== 'undefined' || 'ActiveXObject' in window) {
  XMLParser = function (xmlStr) {
    var xmlDoc = new window.ActiveXObject('Microsoft.XMLDOM')
    xmlDoc.async = 'false'
    xmlDoc.loadXML(xmlStr)
    return xmlDoc
  }
}
/**
 * Transforms string to XML node
 *
 * @param {String} string - Serialized XML
 *
 * @return {Element}
 */
const string2Xml = function (string) {
  return XMLParser(string).firstElementChild
}
/**
 * Serializes XML into string
 *
 * @param {Element} xml
 *
 * @return {String} - Serialized XML string
 */
const xml2String = function (xml) {
  return new window.XMLSerializer().serializeToString(xml)
}

export default {
  string2Xml,
  xml2String,
  document: xmlDocument
}
