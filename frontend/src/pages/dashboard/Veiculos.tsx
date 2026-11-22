import AddIcon from '@mui/icons-material/Add'
import RefreshIcon from '@mui/icons-material/Refresh'
import {
  Alert,
  Box,
  Button,
  Chip,
  FormControlLabel,
  IconButton,
  LinearProgress,
  Paper,
  Snackbar,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material'
import { useCallback, useState } from 'react'
import { Link as RouterLink, useMatch, useNavigate } from 'react-router-dom'
import { api } from '../../api'
import PageHeader from '../../components/PageHeader'
import VeiculoDialog from '../../components/VeiculoDialog'
import { useCarregar } from '../../hooks/useCarregar'
import { formatarData } from '../../servicos'
import type { Automovel } from '../../types'

/**
 * Substitui o antigo listar_veiculos.html (que usava XMLHttpRequest).
 * Na rota /dashboard/veiculos/novo o modal de cadastro abre por cima da lista.
 */
export default function Veiculos() {
  const navigate = useNavigate()
  const modalAberto = useMatch('/dashboard/veiculos/novo') !== null
  const [somenteMeus, setSomenteMeus] = useState(false)
  const [salvo, setSalvo] = useState<Automovel | null>(null)
  const buscar = useCallback(() => api.listarAutomoveis(somenteMeus), [somenteMeus])
  const { dados: veiculos, erro, carregando, recarregar } = useCarregar(buscar)
  const alternarFiltro = (marcado: boolean) => {
    setSomenteMeus(marcado)
    recarregar()
  }

  const fecharModal = () => navigate('/dashboard/veiculos')

  const aoSalvar = (veiculo: Automovel) => {
    setSalvo(veiculo)
    fecharModal()
    recarregar()
  }

  return (
    <>
      <PageHeader
        titulo="Veículos cadastrados"
        subtitulo="Dados obtidos do backend Java"
        acao={
          <Button variant="contained" startIcon={<AddIcon />} component={RouterLink} to="/dashboard/veiculos/novo">
            Novo veículo
          </Button>
        }
      />

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <FormControlLabel
          control={<Switch checked={somenteMeus} onChange={(e) => alternarFiltro(e.target.checked)} />}
          label="Somente meus veículos"
          sx={{ flex: 1 }}
        />
        <Tooltip title="Recarregar">
          <IconButton onClick={recarregar} aria-label="Recarregar">
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {erro && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {erro}
        </Alert>
      )}

      <TableContainer component={Paper} variant="outlined">
        {carregando && <LinearProgress />}
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Marca</TableCell>
              <TableCell>Modelo</TableCell>
              <TableCell>Placa</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Cadastrado em</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {veiculos?.map((v) => (
              <TableRow key={v.id} hover>
                <TableCell>{v.id}</TableCell>
                <TableCell>{v.marca}</TableCell>
                <TableCell>{v.modelo}</TableCell>
                <TableCell>
                  <Chip label={v.placa} size="small" color="primary" variant="outlined" sx={{ fontFamily: 'monospace', letterSpacing: 1 }} />
                </TableCell>
                <TableCell>{v.clienteNome ?? '-'}</TableCell>
                <TableCell>{formatarData(v.criadoEm)}</TableCell>
              </TableRow>
            ))}
            {!carregando && veiculos?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Nenhum veículo cadastrado até o momento.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {veiculos && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Total de veículos: {veiculos.length}
        </Typography>
      )}

      <VeiculoDialog open={modalAberto} onClose={fecharModal} onSalvo={aoSalvar} />

      <Snackbar
        open={salvo !== null}
        autoHideDuration={6000}
        onClose={() => setSalvo(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setSalvo(null)}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => navigate('/dashboard/agendamentos/novo', { state: { placa: salvo?.placa } })}
            >
              Agendar lavação
            </Button>
          }
        >
          {salvo?.marca} {salvo?.modelo} ({salvo?.placa}) cadastrado com sucesso!
        </Alert>
      </Snackbar>
    </>
  )
}
