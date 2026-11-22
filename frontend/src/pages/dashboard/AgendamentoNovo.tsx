import AddIcon from '@mui/icons-material/Add'
import {
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs, { type Dayjs } from 'dayjs'
import { useCallback, useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { api } from '../../api'
import ConfirmDialog from '../../components/ConfirmDialog'
import PageHeader from '../../components/PageHeader'
import { useCarregar } from '../../hooks/useCarregar'
import { HORARIOS, hojeISO, moeda, normalizarPlaca, SERVICOS } from '../../servicos'
import MarcaModeloFields from '../../components/MarcaModeloFields'
import VeiculoDialog from '../../components/VeiculoDialog'
import { cores } from '../../theme'
import type { Automovel, NovoAgendamento } from '../../types'

const VAZIO: NovoAgendamento = { servico: '', data: '', horario: '', marca: '', modelo: '', placa: '', observacoes: '' }

function Secao({ titulo, acao, children }: { titulo: string; acao?: ReactNode; children: ReactNode }) {
  return (
    <Paper variant="outlined" sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1, mb: 2 }}>
        <Typography variant="h6" sx={{ flex: 1 }}>
          {titulo}
        </Typography>
        {acao}
      </Box>
      {children}
    </Paper>
  )
}

/** Substitui o antigo agendamento.html + processa_agendamento.php */
export default function AgendamentoNovo() {
  const navigate = useNavigate()
  const placaInicial = (useLocation().state as { placa?: string } | null)?.placa
  const [dados, setDados] = useState<NovoAgendamento>(VAZIO)
  const [erro, setErro] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)
  const [sucesso, setSucesso] = useState(false)

  const buscarMeus = useCallback(() => api.listarAutomoveis(true), [])
  const { dados: meusVeiculos, recarregar: recarregarMeus } = useCarregar(buscarMeus)
  const [modalVeiculo, setModalVeiculo] = useState(false)

  // Veículo cadastrado pelo modal: atualiza a lista e já preenche os campos
  const veiculoCadastrado = (v: Automovel) => {
    setModalVeiculo(false)
    recarregarMeus()
    setDados((d) => ({ ...d, marca: v.marca, modelo: v.modelo, placa: v.placa }))
  }

  const escolherVeiculo = useCallback(
    (placa: string) => {
      const v = meusVeiculos?.find((x) => x.placa === placa)
      if (v) setDados((d) => ({ ...d, marca: v.marca, modelo: v.modelo, placa: v.placa }))
    },
    [meusVeiculos],
  )

  // Veio da tela de cadastro de veículo: já preenche com o carro recém-cadastrado
  useEffect(() => {
    if (placaInicial) escolherVeiculo(placaInicial)
  }, [placaInicial, escolherVeiculo])

  const set = <K extends keyof NovoAgendamento>(campo: K, valor: NovoAgendamento[K]) =>
    setDados((d) => ({ ...d, [campo]: valor }))

  const hoje = hojeISO()
  const veiculoSelecionado = meusVeiculos?.some((v) => v.placa === dados.placa) ? dados.placa : ''

  const horarioPassou = (h: string, data = dados.data) => data === hoje && h <= dayjs().format('HH:mm')

  const escolherData = (valor: Dayjs | null) => {
    const data = valor?.isValid() ? valor.format('YYYY-MM-DD') : ''
    setDados((d) => ({ ...d, data, horario: horarioPassou(d.horario, data) ? '' : d.horario }))
  }

  const enviar = async (e: FormEvent) => {
    e.preventDefault()
    if (!dados.servico) {
      setErro('Escolha um serviço')
      return
    }
    if (!dados.data || dados.data < hoje) {
      setErro('Escolha uma data válida a partir de hoje')
      return
    }
    setErro(null)
    setEnviando(true)
    try {
      await api.agendar(dados)
      setSucesso(true)
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro ao salvar')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <>
      <PageHeader titulo="Agendar lavação" subtitulo="Preencha os dados abaixo para agendar seu serviço" />

      <Box component="form" onSubmit={enviar} sx={{ display: 'grid', gap: 3, maxWidth: 960 }}>
        <Secao titulo="📋 Escolha o serviço">
          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3, 1fr)' } }}>
            {SERVICOS.map((s) => {
              const ativo = dados.servico === s.nome
              return (
                <Card
                  key={s.id}
                  variant="outlined"
                  sx={{ borderColor: ativo ? 'primary.main' : undefined, boxShadow: ativo ? '0 0 12px #00f5ff66' : undefined }}
                >
                  <CardActionArea onClick={() => set('servico', s.nome)} aria-pressed={ativo} sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography sx={{ fontWeight: 700 }}>{s.nome}</Typography>
                      <Typography color="success.main" sx={{ fontWeight: 700 }}>
                        {moeda(s.preco)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {s.resumo}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              )
            })}
          </Box>
        </Secao>

        <Secao titulo="📅 Data e horário">
          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
            <DatePicker
              label="Data desejada"
              format="DD/MM/YYYY"
              value={dados.data ? dayjs(dados.data) : null}
              onChange={escolherData}
              disablePast
              maxDate={dayjs().add(3, 'month')}
              slotProps={{
                textField: { required: true, helperText: 'Agendamentos para os próximos 3 meses' },
                day: {
                  sx: {
                    '&.Mui-selected, &.Mui-selected:hover, &.Mui-selected:focus': {
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                      boxShadow: `0 0 10px ${cores.primaria}`,
                    },
                    '&.MuiPickersDay-today:not(.Mui-selected)': { borderColor: cores.destaque },
                  },
                },
              }}
            />
            <TextField
              select
              label="Horário preferencial"
              value={dados.horario}
              onChange={(e) => set('horario', e.target.value)}
              helperText={dados.data === hoje ? 'Horários que já passaram ficam indisponíveis' : ' '}
              required
            >
              {HORARIOS.map((h) => (
                <MenuItem key={h} value={h} disabled={horarioPassou(h)}>
                  {h}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </Secao>

        <Secao
          titulo="🚗 Dados do veículo"
          acao={
            <Button size="small" variant="outlined" startIcon={<AddIcon />} onClick={() => setModalVeiculo(true)}>
              Cadastrar novo veículo
            </Button>
          }
        >
          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
            {meusVeiculos && meusVeiculos.length > 0 && (
              <TextField
                select
                label="Usar um dos meus veículos"
                value={veiculoSelecionado}
                onChange={(e) => escolherVeiculo(e.target.value)}
                sx={{ gridColumn: '1 / -1' }}
              >
                {meusVeiculos.map((v) => (
                  <MenuItem key={v.id} value={v.placa}>
                    {v.marca} {v.modelo} — {v.placa}
                  </MenuItem>
                ))}
              </TextField>
            )}
            <MarcaModeloFields
              marca={dados.marca}
              modelo={dados.modelo}
              onChange={(v) => setDados((d) => ({ ...d, ...v }))}
            />
            <TextField
              label="Placa"
              placeholder="ABC1D23"
              value={dados.placa}
              onChange={(e) => set('placa', normalizarPlaca(e.target.value))}
              slotProps={{ htmlInput: { maxLength: 7 } }}
              required
            />
          </Box>
        </Secao>

        <Secao titulo="📝 Observações">
          <TextField
            label="Alguma observação especial?"
            placeholder="Ex: mancha específica no banco, problema no ar-condicionado..."
            value={dados.observacoes ?? ''}
            onChange={(e) => set('observacoes', e.target.value)}
            multiline
            minRows={3}
            fullWidth
          />
        </Secao>

        {erro && <Alert severity="error">{erro}</Alert>}

        <Button type="submit" variant="contained" size="large" disabled={enviando}>
          {enviando ? 'Enviando...' : '✅ Confirmar agendamento'}
        </Button>
      </Box>

      <ConfirmDialog open={sucesso} titulo="Agendamento confirmado!" onClose={() => navigate('/dashboard/agendamentos')}>
        Sua lavação foi agendada com sucesso!
      </ConfirmDialog>

      <VeiculoDialog open={modalVeiculo} onClose={() => setModalVeiculo(false)} onSalvo={veiculoCadastrado} />
    </>
  )
}
