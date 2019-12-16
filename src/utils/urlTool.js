/**
 * [encodeUrlParam 编码参数]
 * @param  {[type]} url      [页面对应的url] 如 '../report/main'
 * @param  {[type]} paramObj [参数对象] 如 {code:100}
 * @return {[type]}          [description]
 */
function encodeUrlParam (url, paramObj = {}) {
  let params = ''
  if (paramObj) {
    let keys = Object.keys(paramObj)
    for (let key of keys) {
      let val = paramObj[key]
      if (val) {
        if (typeof val === 'object') {
          val = JSON.stringify(val)
        }
        val = encodeURIComponent(val)
      }
      params += `${key}=${val}&`
    }
  }
  if (params) {
    params = params.substr(0, params.length - 1)
  }
  if (params) {
    return `${url}?${params}`
  }
  return url
}

/**
 * [decodeUrlParam 解码参数]
 * @param  {[type]} paramObj [参数对象]
 * @return {[type]}          [description]
 */
function decodeUrlParam (paramObj = {}) {
  if (paramObj && typeof paramObj === 'object') {
    let keys = Object.keys(paramObj)
    for (let key of keys) {
      let val = paramObj[key]
      if (val) {
        let strVal = decodeURIComponent(val)
        try {
          paramObj[key] = JSON.parse(strVal)
        } catch (ex) {
          paramObj[key] = strVal
        }
      }
    }
  }
  return paramObj
}

function urlArgsToJson (str) {
  let src = decodeURIComponent(str)
  console.log('url-src', src)
  let args = {}
  let items = src.length > 0 ? src.split('&') : []
  let item = null
  let name = null
  let value = null
  for (let i = 0; i < items.length; i++) {
    item = items[i].split('=')
    name = decodeURIComponent(item[0])
    value = decodeURIComponent(item[1])
    if (name.length) {
      args[name] = value
    }
  }
  console.log('args----', args)
  return args
}

function uuid (str) {
  const time = new Date().getTime()
  var timeLen = time.toString(16).length
  var nextCode = ''
  for (var i = 0; i < (32 - timeLen); i++) {
    nextCode += parseInt(Math.random() * 15).toString(16)
  }
  var uuid = time.toString(16) + nextCode
  console.log(uuid + '---' + uuid.length)
  return uuid
}
export {
  encodeUrlParam,
  decodeUrlParam,
  urlArgsToJson,
  uuid
}
