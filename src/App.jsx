import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Menu from './components/shared/Menu'
import Footer from './components/shared/Footer'
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
import Error404 from './components/pages/Error404'

function App() {
  return (
    <BrowserRouter>
      <Menu />
      <main>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/altas/usuarios" element={<Usuarios />} />
          <Route path="/altas/proveedores" element={<Proveedores />} />
          <Route path="/altas/centros-costo" element={<CentrosCosto />} />
          <Route path="/berdina" element={<Berdina />} />
          <Route path="/sanpablo" element={<SanPablo />} />
          <Route path="/analista" element={<Analista />} />
          <Route path="/analista/pedidos" element={<AnalistaPedidos key="analista" />} />
          <Route path="/analista/analizar" element={<AnalizarItem />} />
          <Route path="/comprador" element={<AnalistaPedidos key="comprador" />} />
          <Route path="/comprador/oc" element={<OrdenCompra />} />
          <Route path="/sanpablo/pedidos" element={<SanPabloPedidos />} />
          <Route path="/sanpablo/pedidos/nuevo" element={<SanPabloNuevoPedido />} />
          <Route path="/berdina/pedidos" element={<BerdinaPedidos />} />
          <Route path="/berdina/pedidos/nuevo" element={<NuevoPedido />} />
          <Route path="/berdina/pendientes" element={<Pendientes taller="berdina" />} />
          <Route path="/sanpablo/pendientes" element={<Pendientes taller="sanpablo" />} />
          <Route path="/gerencia" element={<Gerencia />} />
          <Route path="/gerencia/historial" element={<GerenciaHistorial />} />
          <Route path="/oc/ver" element={<VerOC />} />
          <Route path="/oc/:nro" element={<VerOC />} />
          <Route path="*" element={<Error404 />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}

export default App
