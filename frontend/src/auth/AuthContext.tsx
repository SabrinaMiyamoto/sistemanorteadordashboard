import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { api, setUnauthorizedHandler, tokenStorage } from '../api'
import type { Cliente } from '../types'

interface AuthState {
  cliente: Cliente | null
  carregando: boolean
  login: (usuario: string, senha: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [carregando, setCarregando] = useState(() => tokenStorage.get() !== null)

  const limpar = useCallback(() => {
    tokenStorage.clear()
    setCliente(null)
  }, [])

  // Se já existe token salvo, confere com o backend quem está logado
  useEffect(() => {
    setUnauthorizedHandler(limpar)
    if (!tokenStorage.get()) return
    api
      .me()
      .then(setCliente)
      .catch(limpar)
      .finally(() => setCarregando(false))
  }, [limpar])

  const login = useCallback(async (usuario: string, senha: string) => {
    const resposta = await api.login(usuario, senha)
    tokenStorage.set(resposta.token)
    setCliente(resposta.cliente)
  }, [])

  const logout = useCallback(async () => {
    await api.logout().catch(() => undefined)
    limpar()
  }, [limpar])

  const value = useMemo(() => ({ cliente, carregando, login, logout }), [cliente, carregando, login, logout])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>')
  return ctx
}
