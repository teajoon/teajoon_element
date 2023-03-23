import React, { memo, useEffect, useState, ReactNode } from 'react'
import styled from 'styled-components'

import { setProp } from '@utils/string'
import { defaultTheme, TColors, colors, spaces } from '@constants/theme'
import { inspect } from 'util'

type TStyledTable = {
  width?: string;
  height?: string;
  margin?: string;
  borderStyle?: string;
  borderWidth?: string;
  borderColor?: string;
  borderRadius?: string;
  borderCollapse?: string;
  backgroundColor?: string;
}

const StyledTable = styled.table`
  ${(p: TStyledTable) => {
    return `
      ${setProp('width', p.width)}
      ${setProp('height', p.height)}
      ${setProp('margin', p.margin)}
      ${setProp('border-width', p.borderWidth)}
      ${setProp('border-style', p.borderStyle)}
      ${setProp('border-color', p.borderColor)}
      ${setProp('border-radius', p.borderRadius)}
      ${setProp('border-collapse', p.borderCollapse)}
      ${setProp('background-color', p.backgroundColor)}
    `
  }}
`

type TTable = TStyledTable & {
  children?: ReactNode;
  borderColor?: TColors;
  backgroundColor?: TColors;
}

export const Table = memo(({
  width, height, margin, backgroundColor,
  borderWidth, borderStyle, borderColor, borderRadius, borderCollapse = 'collapse',
  children
}: TTable) => {
  const theme = defaultTheme.light
  return (
    <StyledTable width={width} height={height} margin={margin} backgroundColor={theme[backgroundColor]}
                 borderWidth={borderWidth} borderStyle={borderStyle} borderColor={theme[borderColor]} borderRadius={borderRadius} borderCollapse={borderCollapse}>
      {children}
    </StyledTable>
  )
}, (p, n) => {
  if (p.children !== n.children) return false
  return true
})

type TStyledTr = {
  height?: string;
  minHeight?: string;
  borderStyle?: string;
  borderWidth?: string;
  borderColor?: string;
  backgroundColor?: string;
}

const StyledTr = styled.tr`
  ${(p: TStyledTr) => {
  return `
      ${setProp('height', p.height)}
      ${setProp('min-height', p.minHeight)}
      ${setProp('border-width', p.borderWidth)}
      ${setProp('border-style', p.borderStyle)}
      ${setProp('border-color', p.borderColor)}
      ${setProp('background-color', p.backgroundColor)}
    `
  }}
`

type TTr = TStyledTr & {
  children?: ReactNode;
  borderColor?: TColors;
  backgroundColor?: TColors;
}

export const Tr = memo(({ height, minHeight, borderColor, borderWidth, borderStyle, backgroundColor, children }: TTr) => {
  const theme = defaultTheme.light
  return (
    <StyledTr height={height} minHeight={minHeight} backgroundColor={theme[backgroundColor]}
              borderColor={theme[borderColor]} borderWidth={borderWidth} borderStyle={borderStyle}>
      {children}
    </StyledTr>
  )
}, (p, n) => {
  if (p.children !== n.children) return false
  return true
})

type TStyledTd = {
  width?: string;
  height?: string;
  padding?: string;
  borderStyle?: string;
  borderWidth?: string;
  borderRadius?: string;
  borderColor?: string;
  backgroundColor?: string;
  textAlign?: string;
}

const StyledTd = styled.td`
  ${(p: TStyledTd) => {
    const theme = defaultTheme.light
  return `
      ${setProp('width', p.width)}
      ${setProp('height', p.height)}
      ${setProp('padding', p.padding)}
      ${
          p.borderWidth ? (
            `
              border-width: ${p.borderWidth};
              border-style: ${p.borderStyle || 'solid'};
              border-color: ${p.borderColor || colors.black};
            `
          ) : ''
      }   
      ${setProp('border-radius', p.borderRadius)}
      ${setProp('background-color', p.backgroundColor)}
      ${setProp('text-align', p.textAlign)}
    `
  }} 
`

type TTd = TStyledTd & {
  children?: ReactNode;
  colSpan?: number;
  rowSpan?: number;
  borderColor?: TColors;
  backgroundColor?: TColors;
}

export const Td = memo(({
  width, height, padding = spaces.component.s2.px, borderColor, borderWidth, borderStyle, borderRadius, backgroundColor, textAlign, colSpan, rowSpan, children
}: TTd) => {
  const theme = defaultTheme.light
  return (
    <StyledTd width={width} height={height} padding={padding} backgroundColor={theme[backgroundColor]} textAlign={textAlign} colSpan={colSpan} rowSpan={rowSpan}
              borderColor={theme[borderColor]} borderWidth={borderWidth} borderStyle={borderStyle} borderRadius={borderRadius}>
      {children}
    </StyledTd>
  )
}, (p, n) => {
  if (p.children !== n.children) return false
  return true
})
