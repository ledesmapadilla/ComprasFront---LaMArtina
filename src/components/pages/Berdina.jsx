import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const tarjetas = [
  { titulo: 'Pedido', icono: 'bi-cart3', ruta: '/berdina/pedido' },
  { titulo: 'Pendientes', icono: 'bi-hourglass-split', ruta: '/berdina/pendientes' },
  { titulo: 'Stock', icono: 'bi-box-seam', ruta: '/berdina/stock' },
]

function Tarjeta({ titulo, icono, ruta }) {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onClick={() => navigate(ruta)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 200,
        height: 200,
        cursor: 'pointer',
        border: '1.5px solid #000',
        borderRadius: 12,
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        transition: 'transform 0.18s ease, box-shadow 0.18s ease',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered
          ? '0 8px 24px rgba(0,0,0,0.18), 0 0 16px rgba(0,0,0,0.10)'
          : '0 2px 6px rgba(0,0,0,0.08)',
      }}
    >
      <i className={`bi ${icono}`} style={{ fontSize: 48, color: hovered ? '#000' : '#444', transition: 'color 0.18s' }} />
      <span style={{ fontWeight: 600, fontSize: 17, color: '#000' }}>{titulo}</span>
    </div>
  )
}

export default function Berdina() {
  return (
    <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 32 }}>
      <h4 className="mb-2">Berdina</h4>
      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
        {tarjetas.map((t) => <Tarjeta key={t.titulo} {...t} />)}
      </div>
    </div>
  )
}
