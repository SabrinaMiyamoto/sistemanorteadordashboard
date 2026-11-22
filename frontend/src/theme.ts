import { createTheme } from '@mui/material/styles'

// Cores neon do projeto original (style/header.css)
export const cores = {
  primaria: '#00f5ff',
  secundaria: '#ff00ff',
  destaque: '#00ff88',
  fundo: '#0a0a0a',
}

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: cores.primaria, contrastText: '#001014' },
    secondary: { main: cores.secundaria },
    success: { main: cores.destaque },
    background: { default: cores.fundo, paper: '#121418' },
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(10,10,10,0.92)',
          borderBottom: `1px solid ${cores.primaria}`,
          boxShadow: `0 0 10px ${cores.primaria}55`,
        },
      },
    },
  },
})
