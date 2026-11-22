import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { Alert, Avatar, Box, Button, Container, Link, Paper, TextField, Typography } from '@mui/material'
import { useState, type FormEvent } from 'react'
import { Navigate, Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

interface LocationState {
  from?: string
  usuario?: string
}

export default function Login() {
  const { cliente, login } = useAuth()
  const navigate = useNavigate()
  const state = (useLocation().state ?? {}) as LocationState

  const [usuario, setUsuario] = useState(state.usuario ?? '')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  if (cliente) return <Navigate to={state.from ?? '/dashboard'} replace />

  const entrar = async (e: FormEvent) => {
    e.preventDefault()
    setErro(null)
    setEnviando(true)
    try {
      await login(usuario, senha)
      navigate(state.from ?? '/dashboard', { replace: true })
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Não foi possível entrar')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <Container maxWidth="xs" sx={{ py: 8 }}>
      <Paper variant="outlined" sx={{ p: 4, borderColor: 'primary.main' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main', mb: 1 }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700 }}>
            Entrar
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Acesse seu painel da Lavação Web
          </Typography>
        </Box>

        {erro && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {erro}
          </Alert>
        )}

        <Box component="form" onSubmit={entrar}>
          <TextField
            label="Usuário"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            autoComplete="username"
            autoFocus={!usuario}
            required
            fullWidth
            margin="normal"
          />
          <TextField
            label="Senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            autoComplete="current-password"
            autoFocus={!!usuario}
            required
            fullWidth
            margin="normal"
          />
          <Button type="submit" variant="contained" fullWidth size="large" disabled={enviando} sx={{ mt: 2 }}>
            {enviando ? 'Entrando...' : 'Entrar'}
          </Button>
        </Box>

        <Typography variant="body2" align="center" sx={{ mt: 3 }}>
          Ainda não tem conta?{' '}
          <Link component={RouterLink} to="/cadastro">
            Cadastre-se
          </Link>
        </Typography>
      </Paper>
    </Container>
  )
}
