// Tipos que espelham os DTOs do backend Java (backend/.../dto/Dtos.java)

export interface Cliente {
  id: number
  nome: string
  email: string
  usuario: string
  celular: string | null
  endereco: string | null
}

export interface LoginResponse {
  token: string
  cliente: Cliente
}

export interface NovoCliente {
  nome: string
  endereco: string
  celular: string
  email: string
  usuario: string
  senha: string
}

export interface Automovel {
  id: number
  marca: string
  modelo: string
  placa: string
  clienteId: number | null
  clienteNome: string | null
  criadoEm: string | null
}

export interface NovoAutomovel {
  marca: string
  modelo: string
  placa: string
}

export interface Agendamento {
  id: number
  servico: string
  data: string // "2026-07-15"
  horario: string // "14:30:00"
  marca: string
  modelo: string
  placa: string
  observacoes: string | null
  criadoEm: string | null
}

export type NovoAgendamento = Omit<Agendamento, 'id' | 'criadoEm'>

export interface Marca {
  /** "fipe-23" (Tabela FIPE) ou "p-5" (personalizada); null se a FIPE estiver fora do ar */
  codigo: string | null
  nome: string
  popular: boolean
  origem: 'FIPE' | 'PERSONALIZADA'
}

export interface MarcasResponse {
  marcas: Marca[]
  fipeDisponivel: boolean
}
