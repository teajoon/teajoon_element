import React, { memo, MouseEventHandler, ReactNode, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { setProp } from 'utils/string'
import { colors, spaces, IDefaultTheme, TButtonTypes, TColors, TThemeTypes, defaultTheme } from '@constants/theme'
import { Grid, Text } from '@components/elements/index'
import Icons from '@components/elements/Icons'
import { TFile } from '@components/queries'
import { readFile } from '@utils/file'

type TRipple = {
  event?: MouseEvent;
  color?: string;
  radius?: string;
  close: () => void;
};

export const Ripple = memo(
  ({ event, close, color = colors.black, radius }: TRipple) => {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
      if (event) {
        const current = ref?.current
        if (current) {
          const ripple = document.createElement('div')
          const rect = current.getBoundingClientRect()

          // ripple.style.left = `${event.pageX - rect.left}px`
          // ripple.style.top = `${event.pageY}px`;
          ripple.style.background = `${color}11`
          ripple.style.setProperty('--material-scale', String(current.offsetWidth))
          current.appendChild(ripple)

          setTimeout(() => {
            close()
          }, 500)
        }
      }
    }, [event])

    if (!event) return null

    return <div ref={ref} style={{ borderRadius: radius || '0' }} className='ripple' />
  },
  (p, n) => {
    if (p.event !== n.event) return false
    return true
  }
)

type TButtons = {
  variant?: TButtonTypes;
  color?: TColors;
  colorOpacity?: string;
  backgroundColor?: TColors;
  padding?: string;
  width?: string;
  maxWidth?: string;
  height?: string;
  borderWidth?: string;
  borderStyle?: string;
  borderColor?: TColors;
  radius?: string;
  children?: ReactNode;
  justify?: string;
  shadow?: string;
  disabled?: boolean;
  eventPropagation?: boolean;
  disableRipple?: boolean;
  // eslint-disable-next-line react/no-unused-prop-types
  onClick?: (e?: any) => void;
};

type TStyledButtons = {
  mode?: TThemeTypes;
  theme?: IDefaultTheme;
  color?: TColors;
  colorOpacity?: string;
  backgroundColor?: TColors;
  variant?: TButtonTypes;
  padding?: string;
  width?: string;
  maxWidth?: string;
  height?: string;
  borderWidth?: string;
  borderStyle?: string;
  borderColor?: TColors;
  radius?: string;
  children?: ReactNode | string;
  justify?: string;
  shadow?: string;
  onClick?: any;
};

const StyledButton = styled.button`
  position: relative;
  display: grid;
  align-items: center;
  ${({ variant, padding, width, maxWidth, height, color, colorOpacity = '', backgroundColor, borderWidth, borderColor, borderStyle, radius, justify, shadow }: TStyledButtons) => {
    const theme = defaultTheme.light
    const tbackgroundColor = backgroundColor ? `${theme[backgroundColor]}${colorOpacity}` : variant === 'flat' ? `${theme[color]}${colorOpacity}` : colors.transparent
    const tborderColor = borderColor ? `${theme[borderColor]}${colorOpacity}` : (variant === 'flat' || variant === 'outline') ? `${theme[color]}${colorOpacity}` : colors.transparent
    return `
      cursor: pointer;
      background-color: ${tbackgroundColor};
      border-color: ${tborderColor};
      border-width: ${borderWidth};
      border-style: ${borderStyle};
      ${setProp('max-width', maxWidth)}
      ${setProp('border-radius', radius)}
      ${setProp('box-shadow', shadow)}
      ${setProp('padding', padding)}
      ${setProp('width', width)}
      ${setProp('height', height)}
      ${setProp('justify-items', justify)}
    `
  }}
`

const Button = memo(
  ({
    variant = 'text', color = 'primaryDark', colorOpacity, backgroundColor,
    padding = `0 ${spaces.component.s4.px}`, width, maxWidth, height,
    borderColor, borderStyle = 'solid', borderWidth = '1px',
    radius = spaces.component.s3.px,
    justify = 'center', disabled = false, shadow, children,
    onClick, eventPropagation = false, disableRipple = false
  }: TButtons) => {
    const [event, setevent] = useState<MouseEvent | undefined>()
    const click = (e: MouseEvent) => {
      setevent(e)
      if (eventPropagation) {
        e.preventDefault()
        e.stopPropagation()
      }

      if (!disabled && onClick) onClick(e)
    }
    return (
      <StyledButton
        mode='light'
        variant={variant} color={color} colorOpacity={colorOpacity} backgroundColor={backgroundColor} padding={padding}
        width={width} maxWidth={maxWidth} height={height}
        borderColor={borderColor} borderStyle={borderStyle} borderWidth={borderWidth}
        radius={radius} shadow={shadow} justify={justify}
        onClick={click}
      >
        {children}
        {!disabled && !disableRipple && <Ripple event={event} radius={radius} close={() => setevent(undefined)} />}
      </StyledButton>
    )
  },
  (p, n) => {
    if (p.children !== n.children) return false
    if (p.onClick !== n.onClick) return false
    return true
  }
)

type TLabel = {
  variant?: TButtonTypes;
  color?: TColors;
  backgroundColor?: TColors;
  padding?: string;
  borderWidth?: string;
  borderStyle?: string;
  borderColor?: TColors;
  radius?: string;
  children?: ReactNode;
  onClick?: any;
  eventPropagation?: boolean;
  disableRipple?: boolean;
}

export const Label = memo(({
  variant = 'outline', color = 'primaryLight', backgroundColor, padding = `${spaces.component.s1.px} ${spaces.component.s2.px}`,
  borderColor, borderWidth, borderStyle,
  radius, children, onClick, eventPropagation, disableRipple = true
}: TLabel) => {
  return (
    <Button variant={variant} color={color} backgroundColor={backgroundColor} padding={padding} width='fit-content'
            borderColor={borderColor} borderWidth={borderWidth} borderStyle={borderStyle}
            radius={radius} onClick={onClick} eventPropagation={eventPropagation} disableRipple={disableRipple}>
      {children}
    </Button>
  )
}, (p, n) => {
  if (p.children !== n.children) return false
  return true
})

type TFileButton = {
  currentFile?: TFile;
  setFile?: (e) => void;
  clearFile: () => void;
} & TButtons

export const FileButton = memo(({
  variant, color, colorOpacity, backgroundColor,
  padding, width, maxWidth, height,
  borderColor, borderStyle, borderWidth, radius,
  justify, disabled, shadow, children,
  currentFile, setFile, clearFile,
  eventPropagation = false, disableRipple = false
}: TFileButton) => {
  const fileRef = useRef(null)
  const [file, setfile] = useState(null)
  const [u, setu] = useState<string>()
  const addFiles = e => {
    setfile(e.target.files[0])
    setFile(e.target.files[0])
    readFile(e.target.files[0], results => {
      setu(results.result.target.result as string)
    })
    e.target.value = ''
  }
  const removeFile = () => {
    setfile(null)
    clearFile()
    fileRef.current.value = ''
  }
  return (
    <Grid gap={spaces.component.s3.px}>
      <Button variant={variant} color={color} colorOpacity={colorOpacity} backgroundColor={backgroundColor}
              padding={padding} width={width} maxWidth={maxWidth} height={height}
              borderColor={borderColor} borderStyle={borderStyle} borderWidth={borderWidth} radius={radius}
              justify={justify} disabled={disabled} shadow={shadow}
              eventPropagation={eventPropagation} disableRipple={disableRipple}
              onClick={() => fileRef.current.click()}>
        {children}
      </Button>
      {
        (!!currentFile || !!file) && (
          <Grid width='fit-content' columns='1fr 18px' borderColor='primaryLight' gap={spaces.component.s3.px} align='center' borderStyle='solid' borderWidth='1px' borderRadius={spaces.component.s3.px} padding={`0 ${spaces.component.s4.px}`}>
            {
              (!!u || !!currentFile) && (
                <a download href={u || currentFile?.url} rel='noreferrer'>
                  <Button height='32px' padding='0'>
                    <Text variant='label2' color='primaryLight'>{file?.name || currentFile?.name}</Text>
                  </Button>
                </a>
              )
            }
            <Button height='32px' padding='0' onClick={removeFile}>
              <Icons icon='close' color='primaryLight' width={18} height={18} />
            </Button>
          </Grid>
        )
      }
      <input ref={fileRef} type='file' onChange={addFiles} style={{ display: 'none' }} />
    </Grid>
  )
}, (p, n) => {
  if (p.currentFile !== n.currentFile) return false
  return true
})

export default Button
