import { Box, Button, Card, CardContent, Container, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import heroImg from '../assets/bugatti-chiron-2.webp'
import { SERVICOS } from '../servicos'
import { cores } from '../theme'

const PILARES = [
  { titulo: 'Sustentabilidade', cor: cores.destaque, texto: 'Uso eficiente de água e produtos biodegradáveis, cuidando do seu carro e do planeta.' },
  { titulo: 'Qualidade', cor: cores.secundaria, texto: 'Processos rigorosos e atenção a cada detalhe, garantindo um resultado impecável.' },
  { titulo: 'Tecnologia', cor: cores.primaria, texto: 'Equipamentos modernos e os melhores produtos do mercado para o seu veículo.' },
]

const grade = { display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' } }

export default function Home() {
  return (
    <>
      <Box
        sx={{
          minHeight: { xs: '60vh', md: '75vh' },
          display: 'grid',
          placeItems: 'center',
          textAlign: 'center',
          px: 2,
          background: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.9)), url(${heroImg}) center / cover no-repeat`,
        }}
      >
        <Box>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 800, textShadow: `0 0 18px ${cores.primaria}` }}>
            Cuidado Premium para o seu Veículo
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mt: 2, mb: 4 }}>
            Qualidade, agilidade e sustentabilidade em cada lavagem.
          </Typography>
          <Button
            size="large"
            variant="contained"
            component={RouterLink}
            to="/dashboard/agendamentos/novo"
            sx={{ boxShadow: `0 0 20px ${cores.primaria}` }}
          >
            Agende sua lavação
          </Button>
        </Box>
      </Box>

      <Container id="servicos" sx={{ py: 8, scrollMarginTop: 64 }}>
        <Typography variant="h4" component="h2" sx={{ fontWeight: 700 }}>
          Nossos Serviços
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          Escolha o plano que melhor se encaixa na sua necessidade.
        </Typography>
        <Box sx={grade}>
          {SERVICOS.map((s) => (
            <Card key={s.id} variant="outlined" sx={{ '&:hover': { borderColor: 'primary.main' } }}>
              <CardContent>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                  {s.nome}
                </Typography>
                <Typography color="text.secondary">{s.descricao}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>

      <Box id="pilares" sx={{ bgcolor: 'background.paper', py: 8, scrollMarginTop: 64 }}>
        <Container>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 700 }}>
            Nossos Pilares
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 4 }}>
            O que nos move e o que você pode esperar de nós.
          </Typography>
          <Box sx={grade}>
            {PILARES.map((p) => (
              <Box key={p.titulo} sx={{ borderLeft: `4px solid ${p.cor}`, pl: 2 }}>
                <Typography variant="h6" sx={{ color: p.cor, fontWeight: 700 }}>
                  {p.titulo}
                </Typography>
                <Typography color="text.secondary">{p.texto}</Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>
    </>
  )
}
