import { Box, CircularProgress } from '@mui/material'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'

/** Só deixa entrar nas rotas filhas quem estiver logado; senão manda para /login */
export default function ProtectedRoute() {
  const { cliente, carregando } = useAuth()
  const location = useLocation()

  if (carregando) {
    return (
      <Box sx={{ display: 'grid', placeItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!cliente) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}
