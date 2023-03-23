import jwt_decode from 'jwt-decode'

type Tregexes = {
  [index: string]: RegExp;
};

const regexes: Tregexes = {
  number: /[0-9]/,
  exceptNumber: /[^0-9]/g,
  email: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  password: /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9!@#$%^&+=*.\-_]){8,15}/,
  english: /[A-Za-z]/,
  special: /[!@#$%^&*()_+=-`~\\\][{}|';:/.,?><]/,
  exceptCardNumber: /[^0-9*]/g,
  time: /(^[0-2][0-9]:[0-5][0-9])/,
  date: /(^[1-2][0-9][0-9][0-9].[0-9][0-9].[0-9][0-9])/,
  exceptTime: /[^(\d|:)]/g,
  url: /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/,
  phone: /\d{9,11}/
}

export const regexTest = (type: string, str: string): boolean => {
  if (regexes[type]) {
    return regexes[type].test(str)
  }
  return false
}

export const replaceRegex = (type: string, str: string, replace: string): string => {
  if (!str) return ''
  if (regexes[type]) {
    return str.replace(regexes[type], replace)
  }
  return ''
}

export const setProp = (name: string, prop?: string | number, isImportant = false) => {
  return prop !== undefined ? `${name}: ${prop}${isImportant ? ' !important' : ''};` : ''
}

export const makeComma = (n: number | undefined | null | string): string => {
  if (n === undefined || n === null || n === '') return ''
  if (String(n).length < 4) return String(n)
  const reg = /(^[+-]?\d+)(\d{3})/
  let tn = String(n)
  while (reg.test(tn)) tn = tn.replace(reg, '$1,$2')
  return tn
}

export const copyText = async (text: string, callback?: (tf: boolean) => void) => {
  try {
    await navigator.clipboard.writeText(text)
    // eslint-disable-next-line node/no-callback-literal
    if (callback) callback(true)
    return true
  } catch (error) {
    console.log(error)
    // eslint-disable-next-line node/no-callback-literal
    if (callback) callback(false)
    return false
  }
}

export const nl2br = (str: string): string => {
  return str.replace(/\n/g, '<br />')
}

export const makeFollowerText = (n: number | undefined | null): string => {
  if (n === undefined || n === null) return ''
  if (n < 1000) return makeComma(n) // 1,000
  if (n < 100000) return `${makeComma(Math.floor(n / 1000) / 10)}만` // 1.2만
  return `${makeComma(Math.floor(n / 10000))}만` // 12만
}

export const replaceAll = (s: string, b: string, r: string): string => {
  const regex = new RegExp(b, 'gi')
  return s.replace(regex, r)
}

export const trim = str => {
  if (str === undefined || str === null) return ''
  else if (typeof str !== 'string') return String(str).trim()
  return str.trim()
}

export const decodeJwt = token => {
  try {
    /*
    if (!!atob) {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''))
      return JSON.parse(jsonPayload)
    } else {
     */
    return jwt_decode(token)
    // }
  } catch (error) {
    console.log(error)
    return false
  }
}

export const separateContact = (n: string) => {
  // 010 1234 5678
  if (n.length === 11) return [n.substring(0, 3), n.substring(3, 7), n.substring(7, 11)]
  // 02 1234 5678, 031 123 5678, 011 123 4567
  else if (n.length === 10) {
    if (n.substring(0, 2) === '02') return [n.substring(0, 2), n.substring(2, 6), n.substring(6, 10)]
    else return [n.substring(0, 3), n.substring(3, 6), n.substring(6, 10)]
  } else return [n.substring(0, 3), n.substring(3, 7), n.substring(7, n.length)]
}

export const shuffle = arr => {
  return arr.sort(() => Math.random() - 0.5)
}
