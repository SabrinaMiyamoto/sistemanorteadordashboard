import type {
  Agendamento,
  Automovel,
  Cliente,
  LoginResponse,
  Marca,
  MarcasResponse,
  NovoAgendamento,
  NovoAutomovel,
  NovoCliente,
} from './types'

// Em dev o Vite redireciona /api para http://localhost:8080 (ver vite.config.ts).
// Para outro servidor, defina VITE_API_URL no arquivo .env
const BASE_URL = import.meta.env.VITE_API_URL ?? ''
const TOKEN_KEY = 'norteador.token'

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
}

export class ApiError extends Error {
  readonly status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

// Chamado quando o backend responde 401 (token expirado/inválido)
let onUnauthorized: () => void = () => {}
export function setUnauthorizedHandler(fn: () => void) {
  onUnauthorized = fn
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers)
  headers.set('Content-Type', 'application/json')
  const token = tokenStorage.get()
  if (token) headers.set('Authorization', `Bearer ${token}`)

  let response: Response
  try {
    response = await fetch(`${BASE_URL}${path}`, { ...options, headers })
  } catch {
    throw new ApiError(0, 'O servidor não respondeu. Verifique se o backend Java está rodando.')
  }

  if (response.status === 204) return undefined as T

  const body = await response.json().catch(() => null)
  if (!response.ok) {
    if (response.status === 401 && token) onUnauthorized()
    throw new ApiError(response.status, body?.message ?? `Erro HTTP ${response.status}`)
  }
  return body as T
}

const post = <T>(path: string, data?: unknown) =>
  request<T>(path, { method: 'POST', body: data === undefined ? undefined : JSON.stringify(data) })

export const api = {
  login: (usuario: string, senha: string) => post<LoginResponse>('/api/auth/login', { usuario, senha }),
  logout: () => post<void>('/api/auth/logout'),
  me: () => request<Cliente>('/api/auth/me'),

  cadastrarCliente: (dados: NovoCliente) => post<Cliente>('/api/clientes', dados),

  listarAutomoveis: (meus = false) => request<Automovel[]>(`/api/automoveis${meus ? '?meus=true' : ''}`),
  cadastrarAutomovel: (dados: NovoAutomovel) => post<Automovel>('/api/automoveis', dados),

  listarAgendamentos: () => request<Agendamento[]>('/api/agendamentos'),
  agendar: (dados: NovoAgendamento) => post<Agendamento>('/api/agendamentos', dados),

  // Marcas e modelos: o backend Java consulta a Tabela FIPE e junta com as marcas personalizadas
  listarMarcas: () => request<MarcasResponse>('/api/marcas'),
  listarModelos: (codigoMarca: string) => request<string[]>(`/api/marcas/${encodeURIComponent(codigoMarca)}/modelos`),
  adicionarMarca: (nome: string) => post<Marca>('/api/marcas', { nome }),
}
