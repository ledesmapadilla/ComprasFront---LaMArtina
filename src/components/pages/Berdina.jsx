import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const tarjetas = [
  { titulo: 'Pedido',     icono: 'bi-cart3',          ruta: '/berdina/pedido',     color: 'var(--card-pedido)' },
  { titulo: 'Pendientes', icono: 'bi-hourglass-split', ruta: '/berdina/pendientes', color: 'var(--card-pendientes)' },
  { titulo: 'Stock',      icono: 'bi-box-seam',        ruta: '/berdina/stock',      color: 'var(--card-stock)' },
]

function Tarjeta({ titulo, icono, ruta, color }) {
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
        borderRadius: 14,
        backgroundColor: color,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        transition: 'transform 0.18s ease, box-shadow 0.18s ease',
        transform: hovered ? 'translateY(-6px) scale(1.03)' : 'translateY(0) scale(1)',
        border: '1px solid rgba(45,58,74,0.15)',
        boxShadow: hovered
          ? '0 12px 32px rgba(0,0,0,0.15), 0 0 24px rgba(0,0,0,0.08)'
          : '0 2px 8px rgba(0,0,0,0.08)',
      }}
    >
      <i className={`bi ${icono}`} style={{ fontSize: 52, color: 'var(--color-primary)' }} />
      <span style={{ fontWeight: 700, fontSize: 17, color: 'var(--color-primary)', letterSpacing: 0.5 }}>{titulo}</span>
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
