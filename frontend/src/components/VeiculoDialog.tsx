import CloseIcon from '@mui/icons-material/Close'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { useState, type FormEvent } from 'react'
import { api } from '../api'
import { normalizarPlaca } from '../servicos'
import type { Automovel, NovoAutomovel } from '../types'
import MarcaModeloFields from './MarcaModeloFields'

const VAZIO: NovoAutomovel = { marca: '', modelo: '', placa: '' }

interface Props {
  open: boolean
  onClose: () => void
  /** Chamado com o veículo que o backend acabou de salvar */
  onSalvo: (veiculo: Automovel) => void
}

/** Modal de cadastro de veículo (substitui o antigo veiculo.html + processa_automoveis.php) */
export default function VeiculoDialog({ open, onClose, onSalvo }: Props) {
  const telaPequena = useMediaQuery(useTheme().breakpoints.down('sm'))
  const [dados, setDados] = useState<NovoAutomovel>(VAZIO)
  const [erro, setErro] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  const limpar = () => {
    setDados(VAZIO)
    setErro(null)
  }

  const fechar = () => {
    if (enviando) return
    limpar()
    onClose()
  }

  const enviar = async (e: FormEvent) => {
    e.preventDefault()
    setErro(null)
    setEnviando(true)
    try {
      const salvo = await api.cadastrarAutomovel(dados)
      limpar()
      onSalvo(salvo)
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro ao salvar')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <Dialog open={open} onClose={fechar} fullWidth maxWidth="xs" fullScreen={telaPequena}>
      <Box component="form" onSubmit={enviar}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, pr: 6 }}>
          <DirectionsCarIcon color="primary" />
          Cadastrar veículo
          <IconButton onClick={fechar} aria-label="Fechar" sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ display: 'grid', gap: 2, pt: '8px !important' }}>
          {erro && <Alert severity="error">{erro}</Alert>}
          <MarcaModeloFields
            marca={dados.marca}
            modelo={dados.modelo}
            onChange={(v) => setDados((d) => ({ ...d, ...v }))}
          />
          <TextField
            label="Placa"
            placeholder="ABC1D23"
            value={dados.placa}
            onChange={(e) => setDados({ ...dados, placa: normalizarPlaca(e.target.value) })}
            helperText="Somente letras e números (7 caracteres)"
            slotProps={{ htmlInput: { minLength: 7, maxLength: 7, style: { fontFamily: 'monospace', letterSpacing: 2 } } }}
            required
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={fechar} disabled={enviando}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={enviando}>
            {enviando ? 'Salvando...' : 'Cadastrar veículo'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}
