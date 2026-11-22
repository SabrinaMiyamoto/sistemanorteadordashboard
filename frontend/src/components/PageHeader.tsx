import { Box, Typography } from '@mui/material'
import type { ReactNode } from 'react'

interface Props {
  titulo: string
  subtitulo?: string
  acao?: ReactNode
}

export default function PageHeader({ titulo, subtitulo, acao }: Props) {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, mb: 3 }}>
      <Box sx={{ flex: 1, minWidth: 200 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          {titulo}
        </Typography>
        {subtitulo && <Typography color="text.secondary">{subtitulo}</Typography>}
      </Box>
      {acao}
    </Box>
  )
}
