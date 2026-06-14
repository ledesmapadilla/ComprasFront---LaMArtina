import { Link, NavLink } from 'react-router-dom'

const closeMenu = () => {
  const el = document.getElementById('navMenu')
  if (el?.classList.contains('show')) el.classList.remove('show')
}

export default function Menu() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
      <div className="container position-relative">
      <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
        <img
          src="/logo LM.jpg"
          alt="Logo La Martina"
          height="54"
          style={{
            maskImage: 'linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
            maskComposite: 'intersect',
            WebkitMaskComposite: 'destination-in',
          }}
        />
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navMenu"
      >
        <span className="navbar-toggler-icon" />
      </button>
      <div className="collapse navbar-collapse" id="navMenu">
        <ul className="navbar-nav navbar-nav-center">
          <li className="nav-item">
            <NavLink className={({ isActive }) => `nav-link${isActive ? ' nav-activo' : ''}`} to="/berdina" onClick={closeMenu}>Berdina</NavLink>
          </li>
          <li className="nav-item">
            <NavLink className={({ isActive }) => `nav-link${isActive ? ' nav-activo' : ''}`} to="/sanpablo" onClick={closeMenu}>San Pablo</NavLink>
          </li>
          <li className="nav-item">
            <NavLink className={({ isActive }) => `nav-link${isActive ? ' nav-activo' : ''}`} to="/analista" onClick={closeMenu}>Analista</NavLink>
          </li>
          <li className="nav-item">
            <NavLink className={({ isActive }) => `nav-link${isActive ? ' nav-activo' : ''}`} to="/comprador" onClick={closeMenu}>Comprador</NavLink>
          </li>
          <li className="nav-item">
            <NavLink className={({ isActive }) => `nav-link${isActive ? ' nav-activo' : ''}`} to="/gerencia" onClick={closeMenu}>Gerencia</NavLink>
          </li>
        </ul>
        <ul className="navbar-nav ms-auto">
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
            >
              Altas
            </a>
            <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end">
              <li>
                <Link className="dropdown-item" to="/altas/usuarios" onClick={closeMenu}>
                  Usuarios
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/altas/proveedores" onClick={closeMenu}>
                  Proveedores
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/altas/centros-costo" onClick={closeMenu}>
                  Centros de Costo (CC)
                </Link>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      </div>
    </nav>
  )
}
