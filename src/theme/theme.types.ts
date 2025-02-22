import type { Theme as ThemeUITheme } from 'theme-ui'

declare module 'theme-ui' {
  interface ThemeUITheme {
    colors: {
      primary: string
      secondary: string
      background: string
      text: string
    }
    buttons: {
      primary: {
        bg: string
        color: string
        '&:hover': {
          bg: string
        }
      }
    }
    zIndices: {
      menu: number
      audioPlayer: number
      map: number
      panorama: number
    }
    textShadows: {
      game: string
    }
  }
}

export type Theme = ThemeUITheme

