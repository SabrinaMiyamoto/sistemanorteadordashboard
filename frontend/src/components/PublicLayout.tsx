import { AppBar, Box, Button, Container, Link, Stack, Toolbar, Typography } from '@mui/material'
import { Link as RouterLink, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { cores } from '../theme'

const ANO = new Date().getFullYear()

export default function PublicLayout() {
  const { cliente } = useAuth()

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="sticky">
        <Toolbar sx={{ gap: 1 }}>
          <Box component={RouterLink} to="/" sx={{ display: 'flex', alignItems: 'center', mr: 'auto' }}>
            <Box
              component="img"
              src="/logo.png"
              alt="Logo Lavação Web"
              sx={{ height: 44, filter: `drop-shadow(0 0 8px ${cores.primaria})` }}
            />
          </Box>
          <Button color="inherit" href="/#servicos" sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>
            Serviços
          </Button>
          <Button color="inherit" href="/#pilares" sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>
            Pilares
          </Button>
          {cliente ? (
            <Button variant="contained" component={RouterLink} to="/dashboard">
              Meu painel
            </Button>
          ) : (
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" color="success" component={RouterLink} to="/cadastro">
                Cadastrar
              </Button>
              <Button variant="contained" component={RouterLink} to="/login">
                Entrar
              </Button>
            </Stack>
          )}
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flex: 1 }}>
        <Outlet />
      </Box>

      <Box component="footer" sx={{ py: 3, borderTop: `1px solid ${cores.primaria}33` }}>
        <Container>
          <Typography variant="body2" color="text.secondary" align="center">
            &copy; {ANO} Lavação Web. Todos os direitos reservados. |{' '}
            <Link component={RouterLink} to="/">
              Home
            </Link>
          </Typography>
        </Container>
      </Box>
    </Box>
  )
}
