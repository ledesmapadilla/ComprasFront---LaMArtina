import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../services/api'

const ESTADOS_ANALISIS = new Set(['Pedido', 'En analisis', 'Para analisis', 'Para revision'])
const ESTADOS_HACER_OC = new Set(['Para hacer OC', 'Autorizar'])
const ESTADOS_RETIRAR  = new Set(['Para retirar'])

const TARJETAS = [
  { titulo: 'San Pablo / Berdina', icono: 'bi-tools',     ruta: '/talleres', color: 'linear-gradient(135deg, #316650, #1a3326)', col: 1, row: 1 },
  { titulo: 'Analista',            icono: 'bi-search',    ruta: '/analista', color: 'linear-gradient(135deg, #5a5a5a, #2a2a2a)', col: 3, row: 1 },
  { titulo: 'Comprador',           icono: 'bi-bag-check', ruta: '/comprador',color: 'linear-gradient(135deg, #7a1828, #4a0812)', col: 1, row: 3 },
  { titulo: 'Gerencia',            icono: 'bi-briefcase', ruta: '/gerencia', color: 'linear-gradient(135deg, #2e4880, #1a2a4a)', col: 3, row: 3 },
]

function Tarjeta({ titulo, subtitulo, icono, ruta, color, col, row, children }) {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onClick={() => navigate(ruta)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        gridColumn: col, gridRow: row,
        width: 190, height: 190, cursor: 'pointer', borderRadius: 14,
        background: color, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 8,
        transition: 'transform 0.18s ease, box-shadow 0.18s ease',
        transform: hovered ? 'translateY(-5px) scale(1.04)' : 'translateY(0) scale(1)',
        border: '1px solid rgba(0,0,0,0.12)',
        boxShadow: hovered ? '0 12px 32px rgba(0,0,0,0.25)' : '0 3px 10px rgba(0,0,0,0.12)',
        userSelect: 'none',
        padding: '10px 8px',
      }}
    >
      <i className={`bi ${icono}`} style={{ fontSize: 32, color: '#fff' }} />
      <div style={{ textAlign: 'center', lineHeight: 1.3 }}>
        <div style={{ fontWeight: 400, fontSize: 13, color: '#fff', letterSpacing: 1, textTransform: 'uppercase' }}>{titulo}</div>
        {subtitulo && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.5 }}>{subtitulo}</div>}
      </div>
      {children}
    </div>
  )
}

export default function Inicio() {
  const [conteos, setConteos] = useState(null)

  useEffect(() => {
    const cargar = async () => {
      const [berdina, sanpablo] = await Promise.all([
        api.get('/berdina/pedidos').catch(() => []),
        api.get('/sanpablo/pedidos').catch(() => []),
      ])
      const items = [
        ...berdina.flatMap(p => p.items || []),
        ...sanpablo.flatMap(p => p.items || []),
      ]
      setConteos({
        analisis: items.filter(i => ESTADOS_ANALISIS.has(i.estado)).length,
        hacerOC:  items.filter(i => ESTADOS_HACER_OC.has(i.estado)).length,
        retirar:  items.filter(i => ESTADOS_RETIRAR.has(i.estado)).length,
      })
    }
    cargar()
  }, [])

  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '190px auto 190px',
        gridTemplateRows: '190px auto 190px',
        gap: 8,
      }}>
        {TARJETAS.map(t => (
          <Tarjeta key={t.titulo} {...t}>
            {t.titulo === 'Analista' && conteos && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', marginTop: 2 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'rgba(255,255,255,0.85)', padding: '0 6px' }}>
                  <span>Analisis</span><span style={{ fontWeight: 600 }}>{conteos.analisis}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'rgba(255,255,255,0.85)', padding: '0 6px' }}>
                  <span>Hacer OC</span><span style={{ fontWeight: 600 }}>{conteos.hacerOC}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'rgba(255,255,255,0.85)', padding: '0 6px' }}>
                  <span>Retirar</span><span style={{ fontWeight: 600 }}>{conteos.retirar}</span>
                </div>
              </div>
            )}
          </Tarjeta>
        ))}

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
