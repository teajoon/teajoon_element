import { memo, ReactNode } from 'react'

import { spaces, zIndexes } from '@constants/theme'

import { Grid } from 'components/elements/'

export type TDialog = {
  width?: string;
  maxWidth?: string;
  maxHeight?: string;
  height?: string;
  children: ReactNode;
  zIndex?: number;
  close?: () => void;
};

const Dialog = memo(
  ({ children, close, width = 'auto', maxWidth = '90%', maxHeight = '90vh', height, zIndex }: TDialog) => {
    return (
      <Grid position='fixed' display='grid' color='black' colorOpacity='33'
            alignContent='center' justify='center'
            style={{ top: 0, right: 0, left: 0, bottom: 0, zIndex: zIndex || zIndexes.dialog + 1 }}>
        <Grid position='relative' display='inline-block'
          width={width} height={height} maxWidth={maxWidth} maxHeight={maxHeight} minWidth={width ? undefined : '300px'}
          color='white' borderRadius={spaces.component.s3.px} overflow='auto'>
          {children}
        </Grid>
        <div style={{ top: 0, right: 0, left: 0, bottom: 0, zIndex: -1, position: 'absolute' }} onClick={close} />
      </Grid>
    )
  },
  (p, n) => {
    if (p.children !== n.children) return false
    return true
  }
)

export default Dialog
