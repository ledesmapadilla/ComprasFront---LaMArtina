import { useNavigate } from 'react-router-dom'

const tarjetas = [
  { titulo: 'Pedido', icono: 'bi-cart3', ruta: '/berdina/pedido' },
  { titulo: 'Pendientes', icono: 'bi-hourglass-split', ruta: '/berdina/pendientes' },
  { titulo: 'Stock', icono: 'bi-box-seam', ruta: '/berdina/stock' },
]

export default function Berdina() {
  const navigate = useNavigate()

  return (
    <div className="container py-5">
      <h4 className="mb-4">Berdina</h4>
      <div className="row g-4">
        {tarjetas.map(({ titulo, icono, ruta }) => (
          <div className="col-md-4" key={titulo}>
            <div
              className="card h-100 text-center shadow-sm"
              style={{ cursor: 'pointer', border: '1px solid #000' }}
              onClick={() => navigate(ruta)}
            >
              <div className="card-body d-flex flex-column align-items-center justify-content-center py-5">
                <i className={`bi ${icono} fs-1 mb-3`} />
                <h5 className="card-title mb-0">{titulo}</h5>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
