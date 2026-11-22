import { Box, Button, Dialog, DialogActions, DialogContent, Typography } from '@mui/material'
import type { ReactNode } from 'react'

interface Props {
  open: boolean
  titulo: string
  children: ReactNode
  textoBotao?: string
  onClose: () => void
}

/** Substitui o antigo "modalConfirmacao" das páginas HTML */
export default function ConfirmDialog({ open, titulo, children, textoBotao = 'Continuar', onClose }: Props) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogContent sx={{ textAlign: 'center', pt: 4 }}>
        <Box sx={{ fontSize: 48, mb: 1 }} aria-hidden>
          🚗✨
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          {titulo}
        </Typography>
        <Typography color="text.secondary" component="div">
          {children}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
        <Button variant="contained" onClick={onClose} autoFocus>
          {textoBotao}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
