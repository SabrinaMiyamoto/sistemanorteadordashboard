import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material'
import { useState, type FormEvent } from 'react'
import { api } from '../api'
import type { Marca } from '../types'

interface Props {
  nomeInicial?: string
  onClose: () => void
  onSalva: (marca: Marca) => void
}

/** Modal para adicionar uma marca que não está na Tabela FIPE (fica salva no banco) */
export default function MarcaDialog({ nomeInicial = '', onClose, onSalva }: Props) {
  const [nome, setNome] = useState(nomeInicial)
  const [erro, setErro] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  const enviar = async (e: FormEvent) => {
    e.preventDefault()
    // Este modal pode abrir dentro de outro formulário: impede que o "submit" chegue nele
    e.stopPropagation()
    setErro(null)
    setEnviando(true)
    try {
      onSalva(await api.adicionarMarca(nome))
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro ao salvar a marca')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <Dialog open onClose={() => !enviando && onClose()} fullWidth maxWidth="xs">
      <Box component="form" onSubmit={enviar}>
        <DialogTitle>Adicionar marca</DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Use quando a marca não aparece na lista da Tabela FIPE. Ela ficará disponível para todos os usuários.
          </Typography>
          {erro && <Alert severity="error">{erro}</Alert>}
          <TextField
            label="Nome da marca"
            placeholder="Ex: Troller"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            slotProps={{ htmlInput: { maxLength: 50 } }}
            autoFocus
            required
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onClose} disabled={enviando}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={enviando || !nome.trim()}>
            {enviando ? 'Salvando...' : 'Adicionar marca'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}
