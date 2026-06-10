import { Link } from 'react-router-dom'

export default function Menu() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3" style={{ paddingLeft: '2rem' }}>
      <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
        <img
          src="/logo LM.jpg"
          alt="Logo La Martina"
          height="40"
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
              <li>
                <Link className="dropdown-item" to="/altas/proveedores">
                  Proveedores
                </Link>
              </li>
            </ul>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/berdina">Berdina</Link>
          </li>
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
            >
              San Pablo
            </a>
            <ul className="dropdown-menu dropdown-menu-dark">
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  )
}
