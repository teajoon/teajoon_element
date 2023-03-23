import React, { memo, useEffect, useState } from 'react'

let confirmed = false
export const useBeforeLeaveMessage = ({ message = '페이지를 나가면 입력한 데이터가 삭제됩니다. 페이지를 나가시겠습니까?', setalert, router, isSaved }) => {
  const handleWindowClose = (e: BeforeUnloadEvent) => {
    if (!isSaved) return
    e.preventDefault()
    return (e.returnValue = message)
  }
  const routeChangeStart = (url) => {
    // console.log(url, window.history.state.as)
    if (!isSaved && !confirmed && window.history.state.as !== url) {
      setalert({
        isOpen: true,
        variant: 'confirm',
        body: message,
        onClick: () => {
          confirmed = true
          router.push(url)
        }
      })
      router.events.emit('routeChangeError', 'your error message', 'your-url', { shallow: false })
      // eslint-disable-next-line no-throw-literal
      throw 'Abort route change. Please ignore this error.'
    }
  }

  useEffect(() => {
    confirmed = false
    window.addEventListener('beforeunload', handleWindowClose)
    router.events.on('routeChangeStart', routeChangeStart)
    return () => {
      window.removeEventListener('beforeunload', handleWindowClose)
      router.events.off('routeChangeStart', routeChangeStart)
    }
  }, [isSaved])
  return true
}
