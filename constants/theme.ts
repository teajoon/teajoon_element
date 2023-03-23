import { createGlobalStyle } from 'styled-components'

type TGlobalStyle = {
  size: number;
};

export type TBreakpointKind = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
export type TTextVariants = 'heading1' | 'heading2' | 'heading3' |
                            'title1' | 'title2' | 'title3' | 'title4' |
                            'subtitle1' | 'subtitle2' | 'subtitle3' |
                            'body1' | 'body2' | 'body3' |
                            'caption1' | 'caption2' | 'caption3' |
                            'label1' | 'label2'

export type TBreakpoints = {
  xs: number | boolean;
  sm: number | boolean;
  md: number | boolean;
  lg: number | boolean;
  xl: number | boolean;
  xxl: number | boolean;
};

export const breakpoints = {
  xs: 480,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600
}

export const fontSizes: { [key in TTextVariants]: string } = {
  heading1: '32px',
  heading2: '28px',
  heading3: '28px',
  title1: '24px',
  title2: '24px',
  title3: '20px',
  title4: '20px',
  subtitle1: '17px',
  subtitle2: '17px',
  subtitle3: '17px',
  body1: '15px',
  body2: '15px',
  body3: '15px',
  caption1: '13px',
  caption2: '13px',
  caption3: '13px',
  label1: '11px',
  label2: '11px'
}

export const fontWeights: { [key in TTextVariants]: string } = {
  heading1: '700',
  heading2: '700',
  heading3: '400',
  title1: '700',
  title2: '400',
  title3: '700',
  title4: '400',
  subtitle1: '700',
  subtitle2: '500',
  subtitle3: '400',
  body1: '700',
  body2: '500',
  body3: '400',
  caption1: '700',
  caption2: '500',
  caption3: '400',
  label1: '700',
  label2: '500'
}

export const fontLineHegiths: { [key in TTextVariants]: string } = {
  heading1: '46px',
  heading2: '38px',
  heading3: '38px',
  title1: '32px',
  title2: '32px',
  title3: '28px',
  title4: '28px',
  subtitle1: '24px',
  subtitle2: '24px',
  subtitle3: '24px',
  body1: '20px',
  body2: '20px',
  body3: '20px',
  caption1: '18px',
  caption2: '18px',
  caption3: '18px',
  label1: '14px',
  label2: '14px'
}

export const colors = {
  primary: {
    dark: '#00352F',
    light: '#00695D'
  },
  secondary: {
    yellow: '#FFC700',
    darkGreen: '#89ADA6',
    lightGreen: '#DFEDEA'
  },
  white: '#ffffff',
  black: '#000000',
  error: '#FF3B30',
  warning: '#FFD60A',
  success: '#34C759',
  info: '#007AFF',
  transparent: 'transparent',
  grey: {
    g100: '#FAFAFA',
    g200: '#F0F0F0',
    g300: '#E7E7E7',
    g400: '#D8D8D8',
    g500: '#C4C4C4',
    g600: '#A5A5A5',
    g700: '#7A7A7A',
    g800: '#292929'
  }
}

export const spaces = {
  contents: {
    s1: { px: '24px', n: 24 },
    s2: { px: '36px', n: 36 },
    s3: { px: '48px', n: 48 },
    s4: { px: '64px', n: 64 },
    s5: { px: '96px', n: 96 }
  },
  component: {
    s1: { px: '2px', n: 2 },
    s2: { px: '4px', n: 4 },
    s3: { px: '8px', n: 8 },
    s4: { px: '16px', n: 16 }
  }
}

export const zIndexes = {
  header: 1,
  dialog: 900,
  popover: 800,
  menu: 3,
  notification: {
    back: 1,
    base: 2
  }
}

export const styleItems = {
  screenWidth: { px: '1440px', n: 1440 },
  maxWidth: { px: '1080px', n: 1080 },
  sideWidth: { px: '200px', n: 200 },
  accoutWidth: { px: '340px', n: 340 },
  contentWidth: { px: '832px', n: 832 }
}

export type TThemeTypes = 'light' | 'dark';
export type TColors = 'primaryDark' | 'primaryLight' | 'secondaryYellow' | 'secondaryDarkGreen' | 'secondaryLightGreen' |
  'grey100' | 'grey200' | 'grey300' | 'grey400' | 'grey500' | 'grey600' | 'grey700' | 'grey800' |
  'white' | 'black' | 'error' | 'warning' | 'success' | 'info' | 'transparent';
export type TButtonTypes = 'flat' | 'outline' | 'text' | 'icon';

export type IDefaultTheme = {
  [key in TThemeTypes]: {
    [color in TColors]: string;
  };
};

export const defaultTheme: IDefaultTheme = {
  light: {
    primaryDark: colors.primary.dark,
    primaryLight: colors.primary.light,
    secondaryYellow: colors.secondary.yellow,
    secondaryDarkGreen: colors.secondary.darkGreen,
    secondaryLightGreen: colors.secondary.lightGreen,
    grey100: colors.grey.g100,
    grey200: colors.grey.g200,
    grey300: colors.grey.g300,
    grey400: colors.grey.g400,
    grey500: colors.grey.g500,
    grey600: colors.grey.g600,
    grey700: colors.grey.g700,
    grey800: colors.grey.g800,
    white: colors.white,
    black: colors.black,
    error: colors.error,
    warning: colors.warning,
    success: colors.success,
    info: colors.info,
    transparent: colors.transparent
  },
  dark: {
    primaryDark: colors.primary.dark,
    primaryLight: colors.primary.light,
    secondaryYellow: colors.secondary.yellow,
    secondaryDarkGreen: colors.secondary.darkGreen,
    secondaryLightGreen: colors.secondary.lightGreen,
    grey100: colors.grey.g100,
    grey200: colors.grey.g200,
    grey300: colors.grey.g300,
    grey400: colors.grey.g400,
    grey500: colors.grey.g500,
    grey600: colors.grey.g600,
    grey700: colors.grey.g700,
    grey800: colors.grey.g800,
    white: colors.white,
    black: colors.black,
    error: colors.error,
    warning: colors.warning,
    success: colors.success,
    info: colors.info,
    transparent: colors.transparent
  }
}

const GlobalStyle = createGlobalStyle`
  ${({ size }: TGlobalStyle) => {
    return `
      html {
        font-size: ${size}px;
        color: ${colors.black};
      }
    `
  }}
`
export default GlobalStyle
