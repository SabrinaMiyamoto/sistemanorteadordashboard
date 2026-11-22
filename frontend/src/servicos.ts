// Catálogo de serviços (o mesmo das antigas páginas index.html e agendamento.html)
export interface Servico {
  id: string
  nome: string
  preco: number
  resumo: string
  descricao: string
}

export const SERVICOS: Servico[] = [
  {
    id: 'lavacao-completa',
    nome: 'Lavação Completa',
    preco: 50,
    resumo: 'Lavagem externa, interna e aspiração',
    descricao: 'Lavagem externa, interna básica e aspiração. O essencial para o dia a dia.',
  },
  {
    id: 'polimento-enceramento',
    nome: 'Polimento e Enceramento',
    preco: 120,
    resumo: 'Revitalização da pintura',
    descricao: 'Revitalização da pintura, removendo riscos leves e garantindo brilho duradouro.',
  },
  {
    id: 'higienizacao-motor',
    nome: 'Higienização de Motor',
    preco: 80,
    resumo: 'Limpeza técnica do motor',
    descricao: 'Limpeza técnica e segura do motor, protegendo componentes elétricos.',
  },
  {
    id: 'limpeza-detalhada',
    nome: 'Limpeza Detalhada Interna',
    preco: 90,
    resumo: 'Remoção de manchas e odores',
    descricao: 'Remoção de manchas nos bancos, teto e carpete, eliminando odores.',
  },
  {
    id: 'vidrificacao',
    nome: 'Vidrificação',
    preco: 200,
    resumo: 'Proteção de alta resistência',
    descricao: 'Aplicação de uma camada protetora de alta resistência e durabilidade sobre a pintura do veículo.',
  },
  {
    id: 'lavagem-seco',
    nome: 'Lavagem a Seco',
    preco: 40,
    resumo: 'Sem uso de água',
    descricao: 'Utiliza produtos específicos que encapsulam a sujeira, permitindo a remoção sem uso de água.',
  },
]

export const HORARIOS = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']

export const moeda = (valor: number) => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

/** "2026-07-15" -> "15/07/2026" */
export function formatarData(iso: string | null | undefined): string {
  if (!iso) return '-'
  const [data, hora] = iso.split('T')
  const [a, m, d] = data.split('-')
  return hora ? `${d}/${m}/${a} ${hora.slice(0, 5)}` : `${d}/${m}/${a}`
}

/** Placa só com letras maiúsculas e números, até 7 caracteres */
export const normalizarPlaca = (valor: string) => valor.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 7)

/** Data de hoje no fuso local, no formato "AAAA-MM-DD" */
export function hojeISO(): string {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}
