import React, { useEffect, useState, memo } from 'react'

import { spaces, fontSizes } from '@constants/theme'
import { addDate, format, timestamp } from '@utils/time'
import { weekItems, montItems } from '@constants/global'

import { Grid, Text } from '@components/elements/'
import Icons from 'components/elements/Icons'
import Button from 'components/elements/Buttons'
import { Select } from 'components/elements/Inputs'
import Dialog from '@components/elements/Dialog'

type TCalendarItem = {
  day: number;
  isEvent?: boolean;
  isSelected?: boolean;
  onClick?: (n: number) => void;
  disabled?: boolean;
};

export const CalendarItem = memo(
  ({ day, isEvent = false, isSelected = false, disabled = false, onClick }: TCalendarItem) => {
    const click = () => {
      if (onClick) onClick(day)
    }
    return (
      <Grid
        width='100%'
        justify='center'
        alignContent='center'
        gap={spaces.component.s3.px}
        color={isSelected ? 'primaryLight' : undefined}
        height='44px'
        borderRadius={spaces.component.s2.px}
        onClick={click}
        style={{ opacity: disabled ? '0.3' : '1', cursor: 'pointer' }}
      >
        <Text color={isSelected ? 'white' : undefined} bold>
          {format(day, 'DD')}
        </Text>
        {isEvent && <Grid color={isSelected ? 'white' : 'primaryLight'} width='6px' height='6px' borderRadius='100%' />}
      </Grid>
    )
  },
  (p, n) => {
    if (p.day !== n.day) return false
    if (p.isEvent !== n.isEvent) return false
    if (p.isSelected !== n.isSelected) return false
    return true
  }
)

export type TCalendarDate = { f: number; s: number; e: number; m: number; y: number };

type TCalendar = {
  isHeader?: boolean;
  isChangeView?: boolean;
  defaultDay?: number;
  defaultView?: string;
  isEventsDay?: { [n: string]: boolean };
  onChangeCalendar?: (v: TCalendarDate) => void;
  onClick?: (n: number) => void;
};

const d = 1000 * 60 * 60 * 24
export const viewOptions = [
  { value: 'week', label: '주' },
  { value: 'month', label: '월' }
]

const Calendar = memo(
  ({ isHeader = true, isChangeView = true, defaultDay, defaultView = 'month', isEventsDay = {}, onChangeCalendar, onClick }: TCalendar) => {
    const [isInit, setisInit] = useState(false)
    const [current, setcurrent] = useState<TCalendarDate>()
    const [view, setview] = useState(defaultView)
    const [selectedDay, setselectedDay] = useState<number>(timestamp(format(defaultDay, 'YYYY-MM-DD 00:00:00')) as number)
    const options = viewOptions.map((v) => {
      return {
        ...v,
        label: v.label
      }
    })

    const select = (n: number) => {
      setselectedDay(n)
      if (onClick) onClick(n)
    }

    const changeWeek = (weekStartDay: number) => {
      const ym = format(weekStartDay, 'YYYY,M').split(',')
      setcurrent({
        f: weekStartDay,
        s: weekStartDay,
        e: weekStartDay + d * 6,
        y: Number(ym[0]),
        m: Number(ym[1])
      })
    }

    const changeMonth = (monthStartDay: number) => {
      const sweek = Number(format(monthStartDay, 'd'))
      const end = addDate(monthStartDay, 'month', 1) - d
      const lweek = Number(format(end, 'd'))
      const ym = format(monthStartDay, 'YYYY,M').split(',')
      setcurrent({
        f: monthStartDay,
        s: monthStartDay - (sweek - 1) * d,
        e: end + (lweek === 0 ? 0 : 7 - lweek) * d,
        y: Number(ym[0]),
        m: Number(ym[1])
      })
    }

    const next = () => {
      if (current) {
        if (view === 'month') {
          changeMonth(timestamp(format(addDate(current.f, 'month', 1), 'YYYY-MM-01 00:00:00')) as number)
        } else if (view === 'week') {
          changeWeek(current.s + d * 7)
        }
      }
    }

    const prev = () => {
      if (current) {
        if (view === 'month') {
          const prevMonth = addDate(current.f, 'month', -1)
          changeMonth(timestamp(format(prevMonth, 'YYYY-MM-01 00:00:00')) as number)
        } else if (view === 'week') {
          changeWeek(current.s - d * 7)
        }
      }
    }

    useEffect(() => {
      if (onChangeCalendar && current) onChangeCalendar(current)
    }, [current])

    useEffect(() => {
      if (defaultView) setview(defaultView)
    }, [defaultView])

    useEffect(() => {
      const d = defaultDay || new Date().getTime()
      if (d) {
        if (view === 'month') {
          const monthFirstday = format(d, 'YYYY-MM-01 00:00:00')
          changeMonth(timestamp(monthFirstday) as number)
        } else if (view === 'week') {
          const weekNumber = Number(format(d, 'd'))
          changeWeek(d - (weekNumber - 1) * d)
        }
        setisInit(true)
      }
    }, [defaultDay])

    useEffect(() => {
      if (current && isInit) {
        if (view === 'month') {
          const monthFirstday = format(current?.s, 'YYYY-MM-01 00:00:00')
          changeMonth(timestamp(monthFirstday) as number)
        } else if (view === 'week') {
          const weekNumber = Number(format(current?.s, 'd'))
          changeWeek(current?.s - (weekNumber - 1) * d)
        }
      }
    }, [view])

    if (!current) return null

    return (
      <Grid gap={spaces.component.s3.px}>
        {isHeader && (
          <Grid columns='90px 1fr 90px' align='center'>
            <div />
            <Grid columns='24px 150px 24px' gap={spaces.component.s3.px} align='center' justifyContent='center' justify='center'>
              <Button width='24px' padding='0' color='primaryLight' variant='flat' height='24px' onClick={prev}>
                <Icons icon='arrow' width={22} height={22} color='white' />
              </Button>
              <Text variant='title3'>
                {current.y}년 {montItems[current.m - 1].short}월
              </Text>
              <Button width='24px' padding='0' color='primaryLight' variant='flat' height='24px' onClick={next}>
                <Icons icon='arrow' width={22} height={22} rotate={180} color='white' />
              </Button>
            </Grid>
            <Grid>
              {isChangeView && (
                <Select
                  value={view}
                  width='100%'
                  height='34px'
                  options={options}
                  backgroundColor='white'
                  popupPosition={{ right: -1, top: -1 }}
                  popupWidth='140px'
                  onChange={(b) => setview(String(b))}
                />
              )}
            </Grid>
          </Grid>
        )}
        <Grid columns='repeat(7, 1fr)' justify='center' gap={spaces.component.s2.px}>
          {new Array(7).fill(0).map((_, index) => (
            <Text key={index} color='grey100'>
              {weekItems[index].short}
            </Text>
          ))}
        </Grid>
        <Grid columns='repeat(7, 1fr)' justify='center' gap={` ${spaces.component.s4.px} ${spaces.component.s4.px}`}>
          {new Array((current.e - current.s) / d + 1).fill(0).map((_, index) => {
            const isThisMonth = Number(format(current.s + index * d, 'M')) === current.m
            const day = current.s + index * d
            return (
              <CalendarItem
                key={index}
                isSelected={Number(selectedDay) === day}
                day={day}
                isEvent={isThisMonth && isEventsDay[format(day, 'D')]}
                disabled={view === 'month' && !isThisMonth}
                onClick={select}
              />
            )
          })}
        </Grid>
      </Grid>
    )
  },
  (p, n) => {
    if (p.isEventsDay !== n.isEventsDay) return false
    if (p.defaultView !== n.defaultView) return false
    return true
  }
)

type TDayPicker = {
  defaultDay?: number;
  close: () => void;
  onSelect: (v: number) => void;
}

export const DayPicker = memo(({ defaultDay = new Date().getTime(), close, onSelect }: TDayPicker) => {
  const [c, setc] = useState(null)
  const select = () => {
    onSelect(c)
    close()
  }
  return (
    <Dialog close={close}>
      <Grid padding={spaces.contents.s1.px}>
        <Calendar defaultDay={defaultDay} isChangeView={false} onClick={setc} />
        <Grid marginTop={spaces.contents.s2.px} justifyContent='space-between' display='flex'>
          <Button variant='outline' height='52px' color='primaryLight' onClick={close}>
            <Text color='primaryLight'>닫기</Text>
          </Button>
          <Button variant='flat' height='52px' color='primaryLight' onClick={select}>
            <Text color='white'>날짜 선택</Text>
          </Button>
        </Grid>
      </Grid>
    </Dialog>
  )
}, (p, n) => {
  return true
})

export default Calendar
