import DashboardIcon from '@mui/icons-material/Dashboard'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import EventIcon from '@mui/icons-material/Event'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import HomeIcon from '@mui/icons-material/Home'
import LogoutIcon from '@mui/icons-material/Logout'
import MenuIcon from '@mui/icons-material/Menu'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import {
  AppBar,
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'
import { useState, type ReactNode } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { cores } from '../theme'

const LARGURA_MENU = 248

interface ItemMenu {
  to: string
  label: string
  icon: ReactNode
  end?: boolean
}

const MENU: { titulo: string; itens: ItemMenu[] }[] = [
  {
    titulo: 'Geral',
    itens: [{ to: '/dashboard', label: 'Visão geral', icon: <DashboardIcon />, end: true }],
  },
  {
    titulo: 'Veículos',
    itens: [
      { to: '/dashboard/veiculos', label: 'Listar veículos', icon: <DirectionsCarIcon />, end: true },
      { to: '/dashboard/veiculos/novo', label: 'Cadastrar veículo', icon: <AddCircleIcon /> },
    ],
  },
  {
    titulo: 'Agendamentos',
    itens: [
      { to: '/dashboard/agendamentos', label: 'Listar agendamentos', icon: <EventIcon />, end: true },
      { to: '/dashboard/agendamentos/novo', label: 'Agendar lavação', icon: <EventAvailableIcon /> },
    ],
  },
]

export default function DashboardLayout() {
  const { cliente, logout } = useAuth()
  const navigate = useNavigate()
  const [menuAberto, setMenuAberto] = useState(false)

  const sair = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  const conteudoMenu = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar sx={{ justifyContent: 'center' }}>
        <Box component="img" src="/logo.png" alt="Logo" sx={{ height: 44, filter: `drop-shadow(0 0 8px ${cores.primaria})` }} />
      </Toolbar>
      <Divider />
      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        {MENU.map((grupo) => (
          <List key={grupo.titulo} subheader={<ListSubheader sx={{ bgcolor: 'transparent' }}>{grupo.titulo}</ListSubheader>}>
            {grupo.itens.map((item) => (
              <ListItemButton
                key={item.to}
                component={NavLink}
                to={item.to}
                end={item.end}
                onClick={() => setMenuAberto(false)}
                sx={{
                  mx: 1,
                  borderRadius: 2,
                  '&.active': { bgcolor: 'primary.main', color: 'primary.contrastText' },
                  '&.active .MuiListItemIcon-root': { color: 'primary.contrastText' },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
        ))}
      </Box>
      <Divider />
      <List>
        <ListItemButton component={NavLink} to="/" sx={{ mx: 1, borderRadius: 2 }}>
          <ListItemIcon sx={{ minWidth: 40 }}>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Site público" />
        </ListItemButton>
      </List>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar position="fixed" sx={{ width: { md: `calc(100% - ${LARGURA_MENU}px)` }, ml: { md: `${LARGURA_MENU}px` } }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={() => setMenuAberto(true)} sx={{ mr: 1, display: { md: 'none' } }} aria-label="Abrir menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flex: 1 }} noWrap>
            Painel
          </Typography>
          <Typography variant="body2" sx={{ mr: 1.5, display: { xs: 'none', sm: 'block' } }}>
            {cliente?.nome}
          </Typography>
          <Avatar sx={{ bgcolor: 'secondary.main', width: 34, height: 34, mr: 1 }}>
            {cliente?.nome.charAt(0).toUpperCase()}
          </Avatar>
          <Tooltip title="Sair">
            <IconButton color="inherit" onClick={sair} aria-label="Sair">
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: LARGURA_MENU }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={menuAberto}
          onClose={() => setMenuAberto(false)}
          sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: LARGURA_MENU } }}
        >
          {conteudoMenu}
        </Drawer>
        <Drawer
          variant="permanent"
          open
          sx={{ display: { xs: 'none', md: 'block' }, '& .MuiDrawer-paper': { width: LARGURA_MENU, boxSizing: 'border-box' } }}
        >
          {conteudoMenu}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flex: 1, minWidth: 0, p: { xs: 2, sm: 3 } }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  )
}
