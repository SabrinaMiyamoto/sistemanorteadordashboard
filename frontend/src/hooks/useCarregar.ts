import { useCallback, useEffect, useState } from 'react'

/** Carrega dados de uma função assíncrona e controla os estados de carregando/erro */
export function useCarregar<T>(buscar: () => Promise<T>) {
  const [dados, setDados] = useState<T | null>(null)
  const [erro, setErro] = useState<string | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [versao, setVersao] = useState(0)

  useEffect(() => {
    let ativo = true // ignora respostas de requisições antigas
    buscar()
      .then((d) => {
        if (ativo) {
          setDados(d)
          setErro(null)
        }
      })
      .catch((e: unknown) => ativo && setErro(e instanceof Error ? e.message : 'Erro ao carregar dados'))
      .finally(() => ativo && setCarregando(false))
    return () => {
      ativo = false
    }
  }, [buscar, versao])

  const recarregar = useCallback(() => {
    setCarregando(true)
    setVersao((v) => v + 1)
  }, [])

  return { dados, erro, carregando, recarregar }
}
