import Ract, { memo, ChangeEvent, ReactNode, useState, useRef, Fragment, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import styled from 'styled-components'
import ToggleE from 'react-toggle'
import { useDropzone } from 'react-dropzone'

import { defaultTheme, fontSizes, spaces, TColors, zIndexes } from '@constants/theme'
import { setProp, makeComma } from '@utils/string'
import { readFile } from '@utils/file'

import { Grid, Text } from 'components/elements/'
import Icons from 'components/elements/Icons'
import Button from 'components/elements/Buttons'

type TCheckbox = {
  checked: boolean;
  color?: TColors;
  name?: string;
  disabled?: boolean;
  gap?: string;
  width?: string;
  padding?: string;
  height?: string;
  align?: 'center' | 'start' | 'end';
  children?: ReactNode;
  onChecked?: (checked: boolean) => void;
};

export const Checkbox = memo(
  ({
    checked, onChecked, color = 'primaryLight',
    name, width, height, padding, gap = spaces.component.s3.px, disabled = false, align = 'center',
    children
  }: TCheckbox) => {
    const uuid = uuidv4()

    const change = (e: ChangeEvent<HTMLInputElement>) => {
      if (onChecked) onChecked(e.target.checked)
    }

    return (
      <>
        <label htmlFor={uuid} style={{ display: 'inline-grid' }}>
          <Grid isInline width={width} height={height} padding={padding} display='flex' gap={gap} align={align} alignContent='center' cursor='pointer'>
            <Icons icon={checked ? 'checkbox-checked' : 'checkbox'} width={18} height={18} color={color} />
            {children}
          </Grid>
        </label>
        <input id={uuid} type='checkbox' name={name} checked={checked} disabled={disabled} onChange={change} />
      </>
    )
  },
  (p, n) => {
    if (p.checked !== n.checked) return false
    if (p.onChecked !== n.onChecked) return false
    return true
  }
)

type TInput = {
  type?: string;
  placeholder?: string | ReactNode;
  placeholderAlign?: 'center' | 'start' | 'end' | 'space-between';
  disabled?: boolean;
  readOnly?: boolean;
  width?: string;
  height?: string;
  padding?: string;
  bold?: boolean;
  fontSize?: string;
  isError?: boolean;
  errorColor?: TColors;
  errorText?: string;
  maxLength?: number;
  borderColor?: TColors;
  borderRadius?: string;
  backgroundColor?: TColors;
  accept?: string;
  rows?: number;
  value: string | number;
  setValue?: (text: string) => void;
  isComma?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  onEnter?: () => void;
  onClick?: () => void;
};

type TStyledInput = {
  color?: string;
  width?: string;
  height?: string;
  fontSize?: string;
  bold?: boolean;
};

const StyledTextarea = styled.textarea`
  resize: none;
  ${({ height, width, fontSize, bold, color }: TStyledInput) => `
    ${setProp('color', color)}
    ${setProp('height', height)}
    ${setProp('width', width)}
    ${setProp('font-size', fontSize)}
    ${setProp('font-weight', bold ? '600' : undefined)}
  `}
`

const StyledInput = styled.input`
  height: 100%;
  background-color: transparent;
  ${({ width, fontSize, bold, color }: TStyledInput) => `
    ${setProp('color', color)}
    ${setProp('width', width)}
    ${setProp('font-size', fontSize)}
    ${setProp('font-weight', bold ? '600' : undefined)}
  `}
`

export const Input = memo(
  ({
    type = 'text', value = '', placeholder = '', placeholderAlign = 'center', disabled = false, readOnly = false,
    width, height, padding = `0 ${spaces.component.s3.px}`, fontSize, bold = false, rows,
    isError = false, errorColor = 'error', errorText = '', borderColor = 'grey500', borderRadius = spaces.component.s3.px, backgroundColor = 'white',
    maxLength, accept, isComma = false,
    setValue, onFocus, onBlur, onEnter, onClick
  }: TInput) => {
    const theme = defaultTheme.light
    const ref = useRef<any>(null)
    const [isFocus, setisFocus] = useState(false)

    const change = (e: any) => {
      if (setValue) setValue(e.target.value)
    }

    const onKeyup = e => {
      if (e.key === 'Enter' && onEnter) {
        onEnter()
        e.target.blur()
      }
    }

    const focus = (f: boolean) => {
      if (!disabled) {
        setisFocus(f)
        if (f) {
          ref.current.focus()
          if (onFocus) onFocus()
        } else ref.current?.blur()
      }
    }

    const blur = () => {
      setTimeout(() => {
        if (onBlur) onBlur()
        focus(false)
      }, 100)
    }

    return (
      <Grid width={width}>
        <Grid position='relative' display='block'
              width={width} height={height} padding={padding} cursor='pointer' color={disabled ? 'grey100' : backgroundColor}
              borderWidth='1px' borderColor={isError ? errorColor : borderColor} borderRadius={borderRadius}>
          {
            type === 'textarea' ? (
              <StyledTextarea ref={ref} value={value} rows={rows} disabled={disabled} readOnly={readOnly}
                              color={disabled ? theme.grey500 : theme.grey800} fontSize={fontSize} bold={bold} width='100%'
                              onChange={change} onBlur={blur} onKeyUp={onKeyup} onClick={onClick} />
            ) : (
              <StyledInput ref={ref} type={type} value={isComma ? makeComma(value) : value} disabled={disabled} readOnly={readOnly}
                           color={disabled ? theme.grey500 : theme.grey800} fontSize={fontSize} bold={bold} width='100%' accept={accept}
                           onChange={change} onBlur={blur} onKeyUp={onKeyup} onClick={onClick} />
            )
          }
          {!isFocus && (
            <Grid position='absolute' alignContent={placeholderAlign} height={height} cursor='text' padding={padding}
                  style={{ top: 0, left: 0, bottom: 0, right: 0 }} onClick={() => focus(true)}>
              {
                !value && (
                  typeof placeholder === 'string'
                    ? <Text color='grey500'>{placeholder}</Text>
                    : placeholder
                )
              }
            </Grid>
          )}
          {!!maxLength && (
            <Grid justify='end'>
              <Text color='grey500' bold>{String(value).length} / {makeComma(maxLength)}</Text>
            </Grid>
          )}
        </Grid>
        {
          isError && (
            <Grid marginTop={spaces.component.s3.px} style={{ visibility: errorText ? 'visible' : 'none' }}>
              <Text color={errorColor} variant='caption2'>{errorText}</Text>
            </Grid>
          )
        }
      </Grid>
    )
  },
  (p, n) => {
    if (p.value !== n.value) return false
    if (p.isError !== n.isError) return false
    if (p.errorColor !== n.errorColor) return false
    if (p.disabled !== n.disabled) return false
    return true
  }
)

export type TOption = {
  value: string | number;
  label: string;
};

type TSelect = {
  value: string | number | undefined;
  placeholder?: string;
  options: TOption[];
  disabled?: boolean;
  width?: string;
  height?: string;
  padding?: string;
  optionPadding?: string;
  fontSize?: string;
  defaultColor?: TColors;
  focusColor?: TColors;
  isError?: boolean;
  errorColor?: TColors;
  errorText?: string;
  backgroundColor?: TColors;
  borderRadius?: string;
  borderColor?: TColors;
  popupPosition?: { top?: number; left?: number; right?: number };
  popupWidth?: string;
  onChange: (value: any) => void;
};

export const Select = memo(
  ({
    value,
    placeholder = '',
    options = [],
    disabled,
    width,
    height = '20px',
    padding = `0 ${spaces.component.s4.px}`,
    optionPadding = `${spaces.component.s2.px} ${spaces.component.s2.px}`,
    fontSize,
    defaultColor = 'grey700',
    focusColor = 'grey700',
    isError = false,
    errorColor = 'error',
    errorText = '',
    backgroundColor = 'white',
    borderRadius = '6px',
    borderColor = 'grey500',
    popupPosition = { top: 8, left: -1, right: -1 },
    popupWidth = 'calc(100% + 2px)',
    onChange
  }: TSelect) => {
    const selected = options.find((o) => o.value === value)
    const [isFocus, setisFocus] = useState(false)
    const select = (v: string | number) => {
      setisFocus(false)
      onChange(v)
    }
    return (
      <Grid width={width}>
        <Button padding={padding} disableRipple variant='outline' width='100%' height={height} radius={borderRadius}
                color={isError ? errorColor : isFocus ? focusColor : borderColor} backgroundColor={backgroundColor}
                onClick={() => setisFocus((is) => !is)}>
          <Grid columns='1fr 15px' width='100%' justify='start' align='center'>
            <Text size={fontSize} color={!selected?.label ? 'grey500' : errorText ? errorColor : defaultColor}>
              {selected?.label || placeholder}
            </Text>
            <Icons icon='arrow' color={defaultColor} width={18} height={18} rotate={270} />
          </Grid>
        </Button>
        <Grid position='relative'>
          {
            isFocus && (
              <>
                <Grid color='white' position='absolute' maxHeight='200px' width={popupWidth} overflow='scroll' gap={spaces.component.s1.px}
                  rows={`repeat(${options.length + 1}, fit-content(100%))`} padding={optionPadding} borderRadius={borderRadius}
                  style={{ ...popupPosition, zIndex: zIndexes.popover + 1, boxShadow: '0px 8px 10px rgba(0, 0, 0, 0.05)' }}>
                  {
                    options.map((o) => (
                      <Button key={o.value} width='100%' height={height} color='black' justify='start' onClick={() => select(o.value)}>
                        <Text variant='body3' align='left' color='grey700'>{o.label}</Text>
                      </Button>
                    ))
                  }
                </Grid>
                <div style={{ top: 0, left: 0, right: 0, bottom: 0, zIndex: zIndexes.popover, position: 'fixed' }} onClick={() => setisFocus(false)} />
              </>
            )
          }
        </Grid>
        {
          !!errorText && (
            <Grid padding={`${spaces.component.s1.px} ${spaces.component.s2.px}`}>
              <Text color={errorColor} size={fontSizes.body3}>
                {errorText}
              </Text>
            </Grid>
          )
        }
      </Grid>
    )
  },
  (p, n) => {
    if (p.value !== n.value) return false
    if (p.options !== n.options) return false
    if (p.errorText !== n.errorText) return false
    if (p.isError !== n.isError) return false
    return true
  }
)

type TToggle = {
  checked: boolean;
  disabled?: boolean;
  onChange: (value: boolean) => void;
};

export const Toggle = memo(
  ({ checked, onChange, disabled }: TToggle) => {
    const change = (e: ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.checked)
    }
    return <ToggleE defaultChecked={checked} disabled={disabled} icons={false} onChange={change} />
  },
  (p, n) => {
    if (p.checked !== n.checked) return false
    return true
  }
)

type TDropzone = {
  children: ReactNode;
  accept?: string;
  isNoClick?: boolean;
  onChange: (files: File[]) => void;
};

export const Dropzone = memo(
  ({ children, accept = '*/*', isNoClick = true, onChange }: TDropzone) => {
    const onDrop = (acceptedFiles: File[]) => {
      onChange(acceptedFiles)
    }
    const { getRootProps, getInputProps } = useDropzone({ onDrop, noClick: isNoClick })

    return (
      <div {...getRootProps()}>
        <input {...getInputProps()} accept={accept} />
        {children}
      </div>
    )
  },
  (p, n) => {
    if (p.children !== n.children) return false
    return true
  }
)

export type TFileResult = {
  file: File;
  name: string;
  url: string
}

type TFileProps = {
  isMultiple?: boolean;
  onChange?: (files: TFileResult[]) => void;
  children?: ReactNode;
}

const File = memo(({ isMultiple = false, children, onChange }: TFileProps) => {
  const ref = useRef(null)
  const read = file => {
    return new Promise((resolve) => {
      readFile(file, results => {
        resolve({ file, name: file.name, url: results.result.target.result as string })
      })
    })
  }

  const change = async e => {
    if (onChange) {
      const results = await Promise.all(Array.from(e.target.files).map(f => read(f)))
      onChange(results as TFileResult[])
    }
    e.target.value = ''
  }
  const open = () => {
    ref.current.click()
  }
  return (
    <>
      <Button variant='outline' color='primaryLight' height='52px' onClick={open}>
        {
          children || (
            <Grid display='flex' gap={spaces.component.s3.px} align='center'>
              <Icons icon='map' width={19} height={18} color='primaryLight' />
              <Text color='primaryLight' variant='subtitle2'>파일 첨부</Text>
            </Grid>
          )
        }
      </Button>
      <input ref={ref} type='file' onChange={change} multiple={isMultiple} style={{ display: 'none' }} />
    </>
  )
}, () => {
  return true
})

export default File
