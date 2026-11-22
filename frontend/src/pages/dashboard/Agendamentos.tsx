import AddIcon from '@mui/icons-material/Add'
import {
  Alert,
  Button,
  Chip,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { api } from '../../api'
import PageHeader from '../../components/PageHeader'
import { useCarregar } from '../../hooks/useCarregar'
import { formatarData, hojeISO } from '../../servicos'

export default function Agendamentos() {
  const { dados: agendamentos, erro, carregando } = useCarregar(api.listarAgendamentos)
  const hoje = hojeISO()

  return (
    <>
      <PageHeader
        titulo="Agendamentos"
        subtitulo="Todos os serviços agendados"
        acao={
          <Button variant="contained" startIcon={<AddIcon />} component={RouterLink} to="/dashboard/agendamentos/novo">
            Novo agendamento
          </Button>
        }
      />

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
              <TableCell>Data</TableCell>
              <TableCell>Horário</TableCell>
              <TableCell>Serviço</TableCell>
              <TableCell>Veículo</TableCell>
              <TableCell>Placa</TableCell>
              <TableCell>Observações</TableCell>
              <TableCell>Situação</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {agendamentos?.map((a) => (
              <TableRow key={a.id} hover>
                <TableCell>{formatarData(a.data)}</TableCell>
                <TableCell>{a.horario.slice(0, 5)}</TableCell>
                <TableCell>{a.servico}</TableCell>
                <TableCell>
                  {a.marca} {a.modelo}
                </TableCell>
                <TableCell sx={{ fontFamily: 'monospace' }}>{a.placa}</TableCell>
                <TableCell sx={{ maxWidth: 260 }}>{a.observacoes || '-'}</TableCell>
                <TableCell>
                  {a.data >= hoje ? (
                    <Chip size="small" color="success" label="Agendado" />
                  ) : (
                    <Chip size="small" variant="outlined" label="Realizado" />
                  )}
                </TableCell>
              </TableRow>
            ))}
            {!carregando && agendamentos?.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Nenhum agendamento até o momento.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}
