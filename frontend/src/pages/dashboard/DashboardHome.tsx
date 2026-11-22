import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import EventIcon from '@mui/icons-material/Event'
import GarageIcon from '@mui/icons-material/Garage'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemText,
  Paper,
  Skeleton,
  Typography,
} from '@mui/material'
import { useCallback, type ReactNode } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { api } from '../../api'
import { useAuth } from '../../auth/AuthContext'
import PageHeader from '../../components/PageHeader'
import { useCarregar } from '../../hooks/useCarregar'
import { formatarData, hojeISO } from '../../servicos'

function Indicador({ titulo, valor, icone, cor }: { titulo: string; valor: ReactNode; icone: ReactNode; cor: string }) {
  return (
    <Card variant="outlined">
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ color: cor, display: 'flex', fontSize: 40 }}>{icone}</Box>
        <Box>
          <Typography variant="body2" color="text.secondary">
            {titulo}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {valor}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default function DashboardHome() {
  const { cliente } = useAuth()

  const buscar = useCallback(
    () => Promise.all([api.listarAutomoveis(), api.listarAgendamentos()]),
    [],
  )
  const { dados, erro, carregando } = useCarregar(buscar)
  const [veiculos, agendamentos] = dados ?? [[], []]

  const hoje = hojeISO()
  const proximos = agendamentos.filter((a) => a.data >= hoje)
  const meus = veiculos.filter((v) => v.clienteId === cliente?.id)
  const valor = (n: number) => (carregando ? <Skeleton width={40} /> : n)

  return (
    <>
      <PageHeader
        titulo={`Olá, ${cliente?.nome.split(' ')[0]}!`}
        subtitulo="Resumo da Lavação Web"
        acao={
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button variant="outlined" color="success" component={RouterLink} to="/dashboard/veiculos/novo">
              Adicionar veículo
            </Button>
            <Button variant="contained" component={RouterLink} to="/dashboard/agendamentos/novo">
              Agendar lavação
            </Button>
          </Box>
        }
      />

      {erro && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {erro}
        </Alert>
      )}

      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, mb: 3 }}>
        <Indicador titulo="Meus veículos" valor={valor(meus.length)} icone={<GarageIcon fontSize="inherit" />} cor="#00ff88" />
        <Indicador titulo="Veículos cadastrados" valor={valor(veiculos.length)} icone={<DirectionsCarIcon fontSize="inherit" />} cor="#00f5ff" />
        <Indicador titulo="Próximos agendamentos" valor={valor(proximos.length)} icone={<EventIcon fontSize="inherit" />} cor="#ff00ff" />
      </Box>

      <Paper variant="outlined" sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" sx={{ flex: 1 }}>
            Próximos agendamentos
          </Typography>
          <Button component={RouterLink} to="/dashboard/agendamentos">
            Ver todos
          </Button>
        </Box>
        {!carregando && proximos.length === 0 && (
          <Typography color="text.secondary">Nenhum agendamento futuro.</Typography>
        )}
        <List dense>
          {proximos.slice(0, 5).map((a) => (
            <ListItem key={a.id} divider secondaryAction={<Chip size="small" label={a.placa} variant="outlined" />}>
              <ListItemText
                primary={a.servico}
                secondary={`${formatarData(a.data)} às ${a.horario.slice(0, 5)} • ${a.marca} ${a.modelo}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </>
  )
}
