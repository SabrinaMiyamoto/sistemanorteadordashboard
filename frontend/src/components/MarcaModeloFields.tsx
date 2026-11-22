import AddIcon from '@mui/icons-material/Add'
import { Alert, Autocomplete, Box, Button, Chip, Link, TextField } from '@mui/material'
import { useCallback, useMemo, useState } from 'react'
import { api } from '../api'
import { useCarregar } from '../hooks/useCarregar'
import type { Marca, MarcasResponse } from '../types'
import MarcaDialog from './MarcaDialog'

// A lista de marcas é buscada uma vez só e reaproveitada entre as telas
let cacheMarcas: Promise<MarcasResponse> | null = null
function carregarMarcas() {
  cacheMarcas ??= api.listarMarcas().catch((e) => {
    cacheMarcas = null // tenta de novo na próxima vez
    throw e
  })
  return cacheMarcas
}

/** Compara sem acento e sem diferenciar maiúsculas ("citroen" = "Citroën") */
const chave = (texto: string) =>
  texto.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().trim()

interface Props {
  marca: string
  modelo: string
  onChange: (valor: { marca: string; modelo: string }) => void
}

/**
 * Campos "Marca" e "Modelo" com busca.
 * Marcas e modelos vêm da Tabela FIPE (via backend Java); marcas que faltam podem ser adicionadas pelo modal.
 */
export default function MarcaModeloFields({ marca, modelo, onChange }: Props) {
  const { dados, carregando, erro } = useCarregar(carregarMarcas)
  const [adicionadas, setAdicionadas] = useState<Marca[]>([])
  const [textoBusca, setTextoBusca] = useState('')
  const [modal, setModal] = useState<string | null>(null) // nome inicial do modal; null = fechado

  // Populares primeiro (na ordem do backend), depois as outras em ordem alfabética
  const opcoes = useMemo(() => {
    const todas = [...(dados?.marcas ?? []), ...adicionadas]
    const populares = todas.filter((m) => m.popular)
    const outras = todas.filter((m) => !m.popular).sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
    return [...populares, ...outras]
  }, [dados, adicionadas])

  // Marca já preenchida (ex.: veículo antigo) que não está na lista: mostra mesmo assim
  const selecionada = useMemo<Marca | null>(() => {
    if (!marca) return null
    return opcoes.find((m) => chave(m.nome) === chave(marca)) ?? { codigo: null, nome: marca, popular: false, origem: 'PERSONALIZADA' }
  }, [marca, opcoes])

  const codigo = selecionada?.codigo ?? null
  const buscarModelos = useCallback(() => (codigo ? api.listarModelos(codigo) : Promise.resolve([])), [codigo])
  const { dados: modelos, carregando: carregandoModelos } = useCarregar(buscarModelos)

  const marcaSalva = (nova: Marca) => {
    cacheMarcas = null // a próxima tela já busca a lista com a marca nova
    setAdicionadas((lista) => [...lista, nova])
    setModal(null)
    onChange({ marca: nova.nome, modelo: '' })
  }

  const abrirModal = () => setModal(textoBusca.trim())

  return (
    <>
      {erro && (
        <Alert severity="warning" sx={{ gridColumn: '1 / -1' }}>
          Não foi possível carregar as marcas: {erro}
        </Alert>
      )}
      {dados && !dados.fipeDisponivel && (
        <Alert severity="info" sx={{ gridColumn: '1 / -1' }}>
          A Tabela FIPE está fora do ar no momento. Mostrando só as marcas populares; digite o modelo manualmente.
        </Alert>
      )}

      <Autocomplete
        options={selecionada && !opcoes.includes(selecionada) ? [selecionada, ...opcoes] : opcoes}
        value={selecionada}
        onChange={(_, nova) => onChange({ marca: nova?.nome ?? '', modelo: '' })}
        inputValue={textoBusca}
        onInputChange={(_, texto) => setTextoBusca(texto)}
        getOptionLabel={(m) => m.nome}
        isOptionEqualToValue={(a, b) => chave(a.nome) === chave(b.nome)}
        groupBy={(m) => (m.popular ? 'Marcas populares' : 'Outras marcas')}
        loading={carregando}
        loadingText="Carregando marcas da Tabela FIPE..."
        noOptionsText={
          <Box>
            Nenhuma marca encontrada.
            <Button
              size="small"
              startIcon={<AddIcon />}
              onMouseDown={(e) => e.preventDefault()} // não deixa a lista fechar antes do clique
              onClick={abrirModal}
              sx={{ display: 'flex', mt: 1 }}
            >
              Adicionar {textoBusca.trim() ? `"${textoBusca.trim()}"` : 'nova marca'}
            </Button>
          </Box>
        }
        renderOption={(props, m) => {
          const { key, ...resto } = props
          return (
            <li key={key} {...resto}>
              {m.nome}
              {m.origem === 'PERSONALIZADA' && <Chip label="adicionada" size="small" variant="outlined" sx={{ ml: 1 }} />}
            </li>
          )
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Marca"
            placeholder="Digite para buscar..."
            required
            helperText={
              <Link component="button" type="button" variant="caption" onClick={abrirModal}>
                Não encontrou a marca? Adicione aqui
              </Link>
            }
          />
        )}
      />

      <Autocomplete
        freeSolo
        options={modelos ?? []}
        inputValue={modelo}
        onInputChange={(_, texto) => onChange({ marca, modelo: texto })}
        disabled={!marca}
        loading={!!codigo && carregandoModelos}
        loadingText="Carregando modelos..."
        renderInput={(params) => (
          <TextField
            {...params}
            label="Modelo"
            placeholder={marca ? 'Escolha ou digite o modelo' : 'Escolha a marca primeiro'}
            required
            helperText={
              codigo && carregandoModelos
                ? 'Carregando modelos da Tabela FIPE...'
                : codigo
                  ? 'Modelos da Tabela FIPE; você também pode digitar'
                  : marca
                    ? 'Digite o modelo'
                    : ' '
            }
          />
        )}
      />

      {modal !== null && <MarcaDialog nomeInicial={modal} onClose={() => setModal(null)} onSalva={marcaSalva} />}
    </>
  )
}
