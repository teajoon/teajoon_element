export const setLocalItem = (name: string, item: any) => {
  if (!item) window.localStorage.removeItem(name)
  else window.localStorage.setItem(name, JSON.stringify(item))
}
export const clear = () => {
  window.localStorage.clear()
}
export const getLocalItem = (name: string) => {
  const item = window.localStorage.getItem(name)
  if (item) return JSON.parse(item)
  return null
}

export const getOS = () => {
  // @ts-ignore
  const standalone = window.navigator.standalone
  const userAgent = window.navigator.userAgent.toLowerCase()
  const macosPlatforms = ['macintosh', 'macintel', 'macppc', 'mac68k', 'macos']
  const windowsPlatforms = ['win32', 'win64', 'windows', 'wince', 'msie']
  const iosPlatforms = ['iphone', 'ipad', 'ipod']
  const appService = ['instagram', 'fban', 'fbav', 'kakaotalk']

  let os = 'other'
  let isWebview = false

  if (macosPlatforms.find(s => userAgent.indexOf(s) !== -1)) os = 'mac'
  else if (iosPlatforms.find(s => userAgent.indexOf(s) !== -1)) {
    os = 'ios'
    if (!standalone && !/safari/.test(userAgent) && !appService.find(a => userAgent.indexOf(a) > -1)) isWebview = true
  } else if (/android/.test(userAgent)) {
    os = 'android'
    if (userAgent.includes('wv')) isWebview = true
  } else if (windowsPlatforms.find(s => userAgent.indexOf(s) !== -1)) os = 'window'
  return { os, isWebview }
}

export const appLink = (androidUrl: string, iosUrl: string, iosAppstoreUrl: string) => {
  const device = getOS()
  if (device.os === 'ios') {
    setTimeout(() => {
      window.open(iosAppstoreUrl)
    }, 1500)
    window.location.href = iosUrl
  } else if (device.os === 'android') window.location.href = androidUrl
}
