import { Link } from 'react-router-dom'

export default function Menu() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
        <img src="/logo LM.jpg" alt="Logo La Martina" height="40" />
        <span className="text-secondary fw-normal fs-6">Compras</span>
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
        <ul className="navbar-nav ms-3">
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
            >
              Altas
            </a>
            <ul className="dropdown-menu dropdown-menu-dark">
              <li>
                <Link className="dropdown-item" to="/altas/usuarios">
                  Usuarios
                </Link>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  )
}
