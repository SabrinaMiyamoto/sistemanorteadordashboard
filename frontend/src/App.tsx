import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './auth/ProtectedRoute'
import DashboardLayout from './components/DashboardLayout'
import PublicLayout from './components/PublicLayout'
import Cadastro from './pages/Cadastro'
import Home from './pages/Home'
import Login from './pages/Login'
import AgendamentoNovo from './pages/dashboard/AgendamentoNovo'
import Agendamentos from './pages/dashboard/Agendamentos'
import DashboardHome from './pages/dashboard/DashboardHome'
import Veiculos from './pages/dashboard/Veiculos'

export default function App() {
  return (
    <Routes>
      {/* Páginas públicas */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
      </Route>

      {/* Dashboard: só com login */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          {/* /dashboard/veiculos/novo abre o modal de cadastro por cima da lista */}
          <Route path="veiculos" element={<Veiculos />}>
            <Route path="novo" element={null} />
          </Route>
          <Route path="agendamentos" element={<Agendamentos />} />
          <Route path="agendamentos/novo" element={<AgendamentoNovo />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
