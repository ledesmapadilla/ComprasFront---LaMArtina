import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Menu from './components/shared/Menu'
import Footer from './components/shared/Footer'
import Inicio from './components/pages/Inicio'
import Usuarios from './components/pages/Usuarios'
import Proveedores from './components/pages/Proveedores'
import Berdina from './components/pages/Berdina'
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
          <Route path="/berdina" element={<Berdina />} />
          <Route path="*" element={<Error404 />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}

export default App
