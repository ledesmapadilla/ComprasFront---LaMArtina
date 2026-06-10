import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const tarjetas = [
  { titulo: 'Pedidos',    icono: 'bi-cart3',          ruta: '/berdina/pedidos',    color: 'var(--card-pedido)' },
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
        width: 260,
        height: 260,
        cursor: 'pointer',
        borderRadius: 14,
        backgroundColor: color,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 14,
        transition: 'transform 0.18s ease, box-shadow 0.18s ease',
        transform: hovered ? 'translateY(-6px) scale(1.03)' : 'translateY(0) scale(1)',
        border: '1px solid rgba(0,0,0,0.12)',
        boxShadow: hovered
          ? '0 12px 32px rgba(0,0,0,0.22), 0 0 24px rgba(0,0,0,0.10)'
          : '0 3px 10px rgba(0,0,0,0.12)',
      }}
    >
      <i className={`bi ${icono}`} style={{ fontSize: 56, color: '#fff' }} />
      <span style={{ fontWeight: 700, fontSize: 19, color: '#fff', letterSpacing: 0.5 }}>{titulo}</span>
    </div>
  )
}

export default function Berdina() {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 40,
    }}>
      <h2 style={{ margin: 0, fontWeight: 700, fontSize: 36, color: 'var(--color-text)' }}>
        Berdina
      </h2>
      <div style={{ display: 'flex', gap: 36, flexWrap: 'wrap', justifyContent: 'center' }}>
        {tarjetas.map((t) => <Tarjeta key={t.titulo} {...t} />)}
      </div>
    </div>
  )
}
