import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Menu from './components/shared/Menu'
import Footer from './components/shared/Footer'
import RutaProtegida from './components/shared/RutaProtegida'
import Login from './components/pages/Login'
import Inicio from './components/pages/Inicio'
import Usuarios from './components/pages/Usuarios'
import Proveedores from './components/pages/Proveedores'
import CentrosCosto from './components/pages/CentrosCosto'
import Berdina from './components/pages/Berdina'
import SanPablo from './components/pages/SanPablo'
import Analista from './components/pages/Analista'
import AnalistaPedidos from './components/pages/AnalistaPedidos'
import AnalizarItem from './components/pages/AnalizarItem'
import SanPabloPedidos from './components/pages/SanPabloPedidos'
import SanPabloNuevoPedido from './components/pages/SanPabloNuevoPedido'
import BerdinaPedidos from './components/pages/BerdinaPedidos'
import NuevoPedido from './components/pages/NuevoPedido'
import OrdenCompra from './components/pages/OrdenCompra'
import Gerencia from './components/pages/Gerencia'
import GerenciaHistorial from './components/pages/GerenciaHistorial'
import VerOC from './components/pages/VerOC'
import Pendientes from './components/pages/Pendientes'
import AnalistaPendientes from './components/pages/AnalistaPendientes'
import Error404 from './components/pages/Error404'

const TODOS = ['superadmin', 'solicitante', 'analista', 'comprador', 'gerente']

const SIN_SOLICITANTE = TODOS.filter(r => r !== 'solicitante')

const ROLES = {
  todos:    TODOS,
  gerencia: ['gerente', 'superadmin'],
  admin:    ['superadmin', 'analista', 'comprador'],
  sinSolicitante: SIN_SOLICITANTE,
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Menu />
        <main>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/" element={<RutaProtegida><Inicio /></RutaProtegida>} />

            <Route path="/berdina" element={<RutaProtegida roles={ROLES.todos}><Berdina /></RutaProtegida>} />
            <Route path="/berdina/pedidos" element={<RutaProtegida roles={ROLES.todos}><BerdinaPedidos /></RutaProtegida>} />
            <Route path="/berdina/pedidos/nuevo" element={<RutaProtegida roles={ROLES.todos}><NuevoPedido /></RutaProtegida>} />
            <Route path="/berdina/pendientes" element={<RutaProtegida roles={ROLES.todos}><Pendientes taller="berdina" /></RutaProtegida>} />

            <Route path="/sanpablo" element={<RutaProtegida roles={ROLES.todos}><SanPablo /></RutaProtegida>} />
            <Route path="/sanpablo/pedidos" element={<RutaProtegida roles={ROLES.todos}><SanPabloPedidos /></RutaProtegida>} />
            <Route path="/sanpablo/pedidos/nuevo" element={<RutaProtegida roles={ROLES.todos}><SanPabloNuevoPedido /></RutaProtegida>} />
            <Route path="/sanpablo/pendientes" element={<RutaProtegida roles={ROLES.todos}><Pendientes taller="sanpablo" /></RutaProtegida>} />

            <Route path="/analista" element={<RutaProtegida roles={ROLES.sinSolicitante}><Analista /></RutaProtegida>} />
            <Route path="/analista/pedidos" element={<RutaProtegida roles={ROLES.sinSolicitante}><AnalistaPedidos key="analista" /></RutaProtegida>} />
            <Route path="/analista/pendientes" element={<RutaProtegida roles={ROLES.sinSolicitante}><AnalistaPendientes /></RutaProtegida>} />
            <Route path="/analista/analizar" element={<RutaProtegida roles={ROLES.sinSolicitante}><AnalizarItem /></RutaProtegida>} />

            <Route path="/comprador" element={<RutaProtegida roles={ROLES.sinSolicitante}><AnalistaPedidos key="comprador" /></RutaProtegida>} />
            <Route path="/comprador/oc" element={<RutaProtegida roles={ROLES.sinSolicitante}><OrdenCompra /></RutaProtegida>} />

            <Route path="/gerencia" element={<RutaProtegida roles={ROLES.gerencia}><Gerencia /></RutaProtegida>} />
            <Route path="/gerencia/historial" element={<RutaProtegida roles={ROLES.gerencia}><GerenciaHistorial /></RutaProtegida>} />

            <Route path="/oc/ver" element={<RutaProtegida><VerOC /></RutaProtegida>} />
            <Route path="/oc/:nro" element={<RutaProtegida><VerOC /></RutaProtegida>} />

            <Route path="/altas/usuarios" element={<RutaProtegida roles={['superadmin']}><Usuarios /></RutaProtegida>} />
            <Route path="/altas/proveedores" element={<RutaProtegida roles={ROLES.sinSolicitante}><Proveedores /></RutaProtegida>} />
            <Route path="/altas/centros-costo" element={<RutaProtegida roles={ROLES.sinSolicitante}><CentrosCosto /></RutaProtegida>} />

            <Route path="*" element={<Error404 />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
