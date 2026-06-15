import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const TARJETAS = [
  { titulo: 'San Pablo / Berdina', icono: 'bi-tools',     ruta: '/talleres', color: 'linear-gradient(135deg, #2d5540, #1a3326)', col: 1, row: 1 },
  { titulo: 'Analista',            icono: 'bi-search',    ruta: '/analista', color: 'linear-gradient(135deg, #555555, #2a2a2a)', col: 3, row: 1 },
  { titulo: 'Comprador',           icono: 'bi-bag-check', ruta: '/comprador',color: 'linear-gradient(135deg, #7a1022, #4a0812)', col: 1, row: 3 },
  { titulo: 'Gerencia',            icono: 'bi-briefcase', ruta: '/gerencia', color: 'linear-gradient(135deg, #2a4070, #1a2a4a)', col: 3, row: 3 },
]

function Tarjeta({ titulo, subtitulo, icono, ruta, color, col, row }) {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onClick={() => navigate(ruta)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        gridColumn: col, gridRow: row,
        width: 160, height: 160, cursor: 'pointer', borderRadius: 14,
        background: color, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 10,
        transition: 'transform 0.18s ease, box-shadow 0.18s ease',
        transform: hovered ? 'translateY(-5px) scale(1.04)' : 'translateY(0) scale(1)',
        border: '1px solid rgba(0,0,0,0.12)',
        boxShadow: hovered ? '0 12px 32px rgba(0,0,0,0.25)' : '0 3px 10px rgba(0,0,0,0.12)',
        userSelect: 'none',
      }}
    >
      <i className={`bi ${icono}`} style={{ fontSize: 40, color: '#fff' }} />
      <div style={{ textAlign: 'center', lineHeight: 1.3 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: '#fff', letterSpacing: 1, textTransform: 'uppercase' }}>{titulo}</div>
        {subtitulo && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.5 }}>{subtitulo}</div>}
      </div>
    </div>
  )
}

export default function Inicio() {
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '160px auto 160px',
        gridTemplateRows: '160px auto 160px',
        gap: 8,
      }}>
        {TARJETAS.map(t => <Tarjeta key={t.titulo} {...t} />)}

        <div style={{
          gridColumn: 2, gridRow: 2,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }}>
          <img src="/logo LM-transp.png" alt="Logo La Martina" style={{ width: 280 }} />
          <p style={{ marginTop: 10, marginBottom: 0, fontWeight: 700, fontSize: 17, letterSpacing: 6, textTransform: 'uppercase', color: 'var(--color-muted)' }}>
            Compras
          </p>
        </div>
      </div>
    </div>
  )
}
