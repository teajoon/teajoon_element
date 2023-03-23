import React, { memo, MouseEvent } from 'react'
import DOMPurify from 'dompurify'
import styled from 'styled-components'

import { purifyItems } from '@constants/global'
import { breakpoints, TBreakpointKind, TColors, TTextVariants, defaultTheme, fontLineHegiths, fontSizes, fontWeights } from '@constants/theme'

import { setProp } from '@utils/string'

type TGrid = {
  isInline?: boolean;
  columns?: string;
  rows?: string;
  display?: 'flex' | 'grid' | 'block' | 'inline-block' | 'inline-flex';
  position?: 'relative' | 'absolute' | 'fixed' | 'sticky';
  align?: 'center' | 'start' | 'end';
  alignContent?: 'center' | 'start' | 'end' | 'space-between';
  justify?: 'center' | 'start' | 'end';
  justifyContent?: 'center' | 'start' | 'end' | 'space-between';
  gap?: string;
  padding?: string;
  margin?: string;
  marginTop?: string;
  borderWidth?: string;
  borderStyle?: string;
  borderRadius?: string;
  colorOpacity?: string;
  overflow?: 'hidden' | 'auto' | 'scroll';
  cursor?: 'pointer' | 'text';
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  height?: string;
  minHeight?: string;
  maxHeight?: string;
  image?: string | ArrayBuffer | null;
  imagePosition?: string;
  imageSize?: string;
};

interface IGridR extends TGrid {
  xs?: any;
  sm?: any;
  md?: any;
  lg?: any;
  xl?: any;
  xxl?: any;
}

const createGridResponsive = (p: TGrid & { borderColor?: string, color?: string }, type: TBreakpointKind) => {
  if (!p) return ''
  return `
    @media screen and (max-width: ${breakpoints[type]}px) {
      ${setProp('grid-template-columns', p.columns)}
      ${setProp('grid-template-rows', p.rows)}
      ${setProp('padding', p.padding)}
      ${setProp('margin', p.margin)}
      ${setProp('margin-top', p.marginTop)}
      ${setProp('gap', p.gap)}
      ${setProp('align-items', p.align)}
      ${setProp('align-content', p.alignContent)}
      ${setProp('justify-items', p.justify)}
      ${setProp('justify-content', p.justifyContent)}
      ${setProp('position', p.position)}
      ${setProp('border-width', p.borderWidth)}
      ${setProp('border-style', p.borderStyle)}
      ${setProp('border-color', p.borderColor)}
      ${setProp('border-radius', p.borderRadius)}
      ${setProp('background-color', p.color)}
      ${setProp('height', p.height)}
      ${setProp('min-height', p.minHeight)}
      ${setProp('max-height', p.maxHeight)}
      ${setProp('width', p.width)}
      ${setProp('min-width', p.minWidth)}
      ${setProp('max-width', p.maxWidth)}
      ${setProp('display', p.display || (p.isInline === true ? 'inline-grid' : undefined))}
    }
  `
}

const StyledGrid = styled.div`
  ${(p: IGridR & { borderColor?: string, color?: string }) => {
    return `
      display: ${p.display || (p.isInline ? 'inline-grid' : 'grid')};
      ${setProp('grid-template-columns', p.columns)}
      ${setProp('grid-template-rows', p.rows)}
      ${setProp('padding', p.padding)}
      ${setProp('margin', p.margin)}
      ${setProp('margin-top', p.marginTop)}
      ${setProp('gap', p.gap)}
      ${setProp('align-items', p.align)}
      ${setProp('align-content', p.alignContent)}
      ${setProp('justify-items', p.justify)}
      ${setProp('justify-content', p.justifyContent)}
      ${setProp('position', p.position)}
      ${setProp('border-color', p.borderColor)}
      ${setProp('border-width', p.borderWidth)}
      ${setProp('border-style', p.borderStyle)}
      ${setProp('border-radius', p.borderRadius)}
      ${setProp('background-color', p.color)}
      ${setProp('width', p.width)}
      ${setProp('height', p.height)}
      ${setProp('min-height', p.minHeight)}
      ${setProp('max-height', p.maxHeight)}
      ${setProp('min-width', p.minWidth)}
      ${setProp('max-width', p.maxWidth)}
      ${setProp('cursor', p.cursor)}
      ${setProp('overflow', p.overflow)}
      ${
        p.image
          ? `
          background-image: url(${p.image});
          background-position: ${p.imagePosition || 'center'};
          background-repeat: no-repeat;
          background-size: ${p.imageSize || 'cover'};
        `
          : ''
      }
      ${createGridResponsive(p.xxl, 'xxl')}
      ${createGridResponsive(p.xl, 'xl')}
      ${createGridResponsive(p.lg, 'lg')}
      ${createGridResponsive(p.md, 'md')}
      ${createGridResponsive(p.sm, 'sm')}
      ${createGridResponsive(p.xs, 'xs')}
    `
  }}
`

export const Grid = memo(({
  id, className,
  isInline, columns, rows, display, gap, align = 'start', alignContent = 'start', justifyContent, justify, position,
  padding, margin, marginTop,
  borderColor, borderWidth, borderStyle, borderRadius,
  image, imageSize, imagePosition,
  width, height, maxWidth, minWidth, maxHeight, minHeight,
  color, colorOpacity, cursor, overflow,
  xs, sm, md, lg, xl, xxl,
  style, children, onClick, onMouseEnter, onMouseLeave,
  html
}: IGridR & {
  id?: string; className?: string;
  style?, children?: any, borderColor?: TColors, color?: TColors, html?: string;
  onClick?: (e: MouseEvent<HTMLElement>) => void, onMouseEnter?: (e: MouseEvent<HTMLElement>) => void, onMouseLeave?: (e: MouseEvent<HTMLElement>) => void
}) => {
  const theme = defaultTheme.light
  return (
    <StyledGrid id={id} className={className}
                isInline={isInline} columns={columns} rows={rows} display={display} position={position} gap={gap} align={align} alignContent={alignContent} justifyContent={justifyContent} justify={justify}
                padding={padding} margin={margin} marginTop={marginTop}
                borderColor={borderColor ? theme[borderColor] : undefined} borderWidth={borderWidth} borderStyle={borderStyle || (borderWidth ? 'solid' : undefined)} borderRadius={borderRadius}
                image={image} imageSize={imageSize} imagePosition={imagePosition}
                width={width} height={height} maxWidth={maxWidth} minWidth={minWidth} maxHeight={maxHeight} minHeight={minHeight}
                color={color ? `${theme[color]}${colorOpacity || ''}` : undefined} cursor={cursor} overflow={overflow}
                xs={xs} sm={sm} md={md} lg={lg} xl={xl} xxl={xxl}
                style={style} onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}
                dangerouslySetInnerHTML={!!html ? { __html: typeof window === 'undefined' ? '' : DOMPurify.sanitize(html, { ALLOWED_TAGS: purifyItems.tags, ADD_ATTR: purifyItems.attr }) } : undefined}>
      {children}
    </StyledGrid>
  )
}, (p, n) => {
  if (p.children !== n.children) return false
  if (p.color !== n.color) return false
  if (p.borderColor !== n.borderColor) return false
  return true
})

export type TText = {
  variant?: TTextVariants;
  textDecoration?: string;
  ellipsis?: number;
  size?: string;
  lineHeight?: number;
  bold?: boolean;
  align?: string;
};
interface ITextR extends TText {
  xs?: any;
  sm?: any;
  md?: any;
  lg?: any;
  xl?: any;
  xxl?: any;
}

const createTextResponsive = (p: TText & { color?: string }, type: TBreakpointKind) => {
  if (!p) return ''
  return `
    @media screen and (max-width: ${breakpoints[type]}px) {
      ${setProp('color', p.color)}
      ${setProp('text-decoration', p.textDecoration)}
      ${setProp('line-height', p.lineHeight || fontLineHegiths[p.variant])}
      ${setProp('font-size', p.size || fontSizes[p.variant])}
      ${setProp('font-weight', p.bold ? '700' : fontWeights[p.variant])}
      ${setProp('font-size', p.size)}
      ${
        p.ellipsis ? `
            display: -webkit-box;
            overflow: hidden;
            text-overflow: ellipsis;
            -webkit-line-clamp: ${p.ellipsis};
            -webkit-box-orient: vertical;
          ` : ''
      }
    }
  `
}

const StyledText = styled.div`
  display: inline-block;
  word-wrap: break-word;
  word-break: break-all;
  ${({ variant, color, textDecoration, ellipsis, size, align, lineHeight, bold, xs, sm, md, lg, xl, xxl }: ITextR & { color?: string }) => {
    return `
      ${setProp('color', color)}
      ${setProp('text-decoration', textDecoration)}
      ${setProp('line-height', lineHeight || fontLineHegiths[variant])}
      ${setProp('font-size', size || fontSizes[variant])}
      ${setProp('font-weight', bold ? '700' : fontWeights[variant])}
      ${setProp('text-align', align)}
      ${
        ellipsis
          ? `
            display: -webkit-box;
            overflow: hidden;
            text-overflow: ellipsis;
            -webkit-line-clamp: ${ellipsis};
            -webkit-box-orient: vertical;
          `
          : ''
      }
      ${createTextResponsive(xxl, 'xxl')}
      ${createTextResponsive(xl, 'xl')}
      ${createTextResponsive(lg, 'lg')}
      ${createTextResponsive(md, 'md')}
      ${createTextResponsive(sm, 'sm')}
      ${createTextResponsive(xs, 'xs')}
    `
  }}
`

export const Text = memo(({
  variant = 'body3', color, textDecoration, ellipsis, size, lineHeight, bold = false, align,
  xs, sm, md, lg, xl, xxl,
  style, children, html
}: ITextR & { style?, color?: TColors, children?: any, html?: string }) => {
  const theme = defaultTheme.light
  return (
    <StyledText variant={variant} color={theme[color]} textDecoration={textDecoration} align={align} ellipsis={ellipsis} size={size} lineHeight={lineHeight} bold={bold}
                xs={xs} sm={sm} md={md} lg={lg} xl={xl} xxl={xxl} style={style} dangerouslySetInnerHTML={html ? { __html: typeof window === 'undefined' ? '' : DOMPurify.sanitize(html) } : undefined}>
      {children}
    </StyledText>
  )
}, (p, n) => {
  if (p.children !== n.children) return false
  if (p.variant !== n.variant) return false
  if (p.color !== n.color) return false
  return true
})
