// import { Theme } from 'theme-ui'
import type { Theme } from './theme.types'

export const theme: Theme = {
  colors: {
    primary: '#FFFFFF',
    secondary: '#1a1d22',
    background: '#1a1d22',
    text: '#FFFFFF',
  },
  fonts: {
    body: '"Tomorrow", serif',
    heading: '"Tomorrow", serif',
  },
  shadows: {
    game: "0px 2px 3px rgba(0,0,0,0.6), 0px 4px 13px rgba(0,0,0,0.1), 0px 8px 23px rgba(0,0,0,0.1)",
  },
  buttons: {
    base: {
      borderRadius: 8,
      height: 56,
      fontWeight: 500,
      textTransform: 'uppercase',
      fontFamily: '"Tomorrow", serif',
      cursor: 'pointer',
      transition: 'all 50ms ease-in-out',
      '&:hover': {
        filter: 'brightness(1.25) opacity(1)',
      },
      '&:active': {
        filter: 'brightness(0.85) opacity(1)',
      },
      '&:disabled': {
        '&, &:hover, &:active': {
          filter: 'opacity(0.75)',
          cursor: 'not-allowed',
        },
      },
    },
    primary: {
      variant: 'buttons.base',
      bg: 'primary',
      color: 'secondary',
      filter: 'opacity(0.9)',
    },
    secondary: {
      variant: 'buttons.base',
      bg: 'secondary',
      color: 'primary',
    }
  },
  styles: {
    body: {
      backgroundColor: 'background',
    },
    root: {
      fontFamily: 'body',
      fontSize: 18,
    },
    h1: {
      fontFamily: 'heading',
      fontWeight: 700,
    },
    h2: {
      fontFamily: 'heading',
      fontWeight: 600,
    },
    h3: {
      fontFamily: 'heading',
      fontWeight: 500,
    },
  },
  zIndices: {
    panorama: 1,
    map: 2,
    menu: 3,
    audioPlayer: 4,
  }
}