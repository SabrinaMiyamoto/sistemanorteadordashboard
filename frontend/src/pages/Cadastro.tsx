import { Alert, Box, Button, Container, Link, Paper, Snackbar, TextField, Typography } from '@mui/material'
import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { api } from '../api'
import ConfirmDialog from '../components/ConfirmDialog'
import type { NovoCliente } from '../types'

const VAZIO: NovoCliente = { nome: '', endereco: '', celular: '', email: '', usuario: '', senha: '' }

export default function Cadastro() {
  const navigate = useNavigate()
  const [dados, setDados] = useState<NovoCliente>(VAZIO)
  const [erro, setErro] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)
  const [saudacao, setSaudacao] = useState<string | null>(null)
  const [sucesso, setSucesso] = useState(false)

  const alterar = (campo: keyof NovoCliente) => (e: ChangeEvent<HTMLInputElement>) =>
    setDados((d) => ({ ...d, [campo]: e.target.value }))

  // Mesma ideia do antigo modal de boas-vindas ao sair do campo "nome"
  const saudar = () => {
    const nome = dados.nome.trim()
    if (nome) setSaudacao(`Olá, ${nome}! É um prazer ter você no Lavação Web.`)
  }

  const enviar = async (e: FormEvent) => {
    e.preventDefault()
    setErro(null)
    setEnviando(true)
    try {
      await api.cadastrarCliente(dados)
      setSucesso(true)
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Falha ao salvar os dados')
    } finally {
      setEnviando(false)
    }
  }

  const irParaLogin = () => navigate('/login', { state: { usuario: dados.usuario } })

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper variant="outlined" sx={{ p: { xs: 3, sm: 4 } }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Cadastro de Cliente
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          Insira os dados cadastrais da pessoa:
        </Typography>

        {erro && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {erro}
          </Alert>
        )}

        <Box component="form" onSubmit={enviar} sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
          <TextField label="Nome completo" value={dados.nome} onChange={alterar('nome')} onBlur={saudar} required sx={{ gridColumn: '1 / -1' }} />
          <TextField label="Endereço" value={dados.endereco} onChange={alterar('endereco')} required sx={{ gridColumn: '1 / -1' }} />
          <TextField label="Celular" type="tel" placeholder="(48) 99999-9999" value={dados.celular} onChange={alterar('celular')} required />
          <TextField label="E-mail" type="email" value={dados.email} onChange={alterar('email')} required />
          <TextField label="Nome de usuário" value={dados.usuario} onChange={alterar('usuario')} autoComplete="username" required />
          <TextField
            label="Senha"
            type="password"
            value={dados.senha}
            onChange={alterar('senha')}
            autoComplete="new-password"
            helperText="Mínimo de 6 caracteres"
            slotProps={{ htmlInput: { minLength: 6 } }}
            required
          />
          <Button type="submit" variant="contained" size="large" disabled={enviando} sx={{ gridColumn: '1 / -1' }}>
            {enviando ? 'Salvando...' : 'Cadastrar cliente'}
          </Button>
        </Box>

        <Typography variant="body2" align="center" sx={{ mt: 3 }}>
          Já tem conta?{' '}
          <Link component={RouterLink} to="/login">
            Entrar
          </Link>
        </Typography>
      </Paper>

      <Snackbar
        open={saudacao !== null && !sucesso}
        autoHideDuration={4000}
        onClose={() => setSaudacao(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" onClose={() => setSaudacao(null)}>
          {saudacao}
        </Alert>
      </Snackbar>

      <ConfirmDialog open={sucesso} titulo="Cadastro realizado!" textoBotao="Ir para o login" onClose={irParaLogin}>
        Seu cadastro foi concluído com sucesso.
        <br />
        Faça login para cadastrar veículos e agendar lavações.
      </ConfirmDialog>
    </Container>
  )
}
