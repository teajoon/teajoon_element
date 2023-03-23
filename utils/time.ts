import moment from 'moment-timezone'
// @ts-ignore
import ko from 'moment/locale/ko.js'

export const timestampToTime = (timestamp) => {
  const now = new Date().getTime()
  const nowDate = moment.unix(now.toString().length === 13 ? now / 1000 : now).format('MM/DD')
  let date = moment.unix(timestamp.toString().length === 13 ? timestamp / 1000 : timestamp).format('MM/DD')
  if (date === '잘못된 날짜입니다') {
    date = ''
  }
  return nowDate === date
    ? moment.unix(timestamp.toString().length === 13 ? timestamp / 1000 : timestamp).format('HH:mm')
    : date
}

export const dateStringToDate = (dateString) => {
  const date = moment(dateString)
  return date.format('YYYY.MM.DD')
}

export const dateStringToDateTime = (dateString) => {
  const date = moment(dateString)
  return date.format('YYYY.MM.DD/HH:MM')
}

export const getTimezone = () => {
  return moment.tz.guess()
}

const formats = {
  iso: 'YYYY-MM-DDTHH:mm:ssZZ'
}
export const format = (timestamp, format, timezone = 'Asia/Seoul') => {
  if (timestamp === undefined || timestamp === null) return timestamp
  if (format === 'iso') return moment.tz(timestamp, timezone).format()
  else if (formats[format]) return moment.tz(timestamp, timezone).format(formats[format])
  else return moment.tz(timestamp, timezone).format(format)
}

export const timestamp = (t, timezone = getTimezone()) => {
  if (t === undefined || t === null) return t
  return Number(moment.tz(t, timezone).format('x'))
}

export const makeTimeText = timestamp => {
  const formatConditions = [
    { key: 'hour', condition: 1000 * 60 * 60 * 24 }
  ]
  const formats = {
    hour: 'HH:mm',
    year: 'YYYY.MM.DD'
  }
  if (!timestamp) return ''
  const now = new Date().getTime()
  const finded = formatConditions.find((f) => now - timestamp < f.condition)
  if (finded) return format(timestamp, formats[finded.key])
  return format(timestamp, formats.year)
}

export const addDate = (date = new Date().getTime(), type, count) => {
  return Number(moment(date).add(count, type).format('x'))
}
