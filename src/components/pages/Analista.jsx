import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { api } from '../../services/api'

const tarjetas = [
  { titulo: 'Pedidos',    icono: 'bi-cart3',           ruta: '/analista/pedidos',    color: 'linear-gradient(135deg, #7a1828, #4a0812)' },
  { titulo: 'Pendientes', icono: 'bi-hourglass-split', ruta: '/analista/pendientes', color: 'linear-gradient(135deg, #316650, #1a3326)' },
  { titulo: 'Stock',      icono: 'bi-box-seam',        ruta: '/analista/stock',      color: 'linear-gradient(135deg, #5a5a5a, #2a2a2a)' },
]

const ESTADOS_ANALISIS  = new Set(['Pedido', 'En analisis', 'Para analisis', 'Para revision'])
const ESTADOS_HACER_OC  = new Set(['Para hacer OC', 'Autorizar'])
const ESTADOS_RETIRAR   = new Set(['Para retirar'])

function Tarjeta({ titulo, icono, ruta, color }) {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onClick={() => navigate(ruta)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 260, height: 260, cursor: 'pointer', borderRadius: 14,
        background: color, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 14,
        transition: 'transform 0.18s ease, box-shadow 0.18s ease',
        transform: hovered ? 'translateY(-6px) scale(1.03)' : 'translateY(0) scale(1)',
        border: '1px solid rgba(0,0,0,0.12)',
        boxShadow: hovered ? '0 12px 32px rgba(0,0,0,0.22), 0 0 24px rgba(0,0,0,0.10)' : '0 3px 10px rgba(0,0,0,0.12)',
      }}
    >
      <i className={`bi ${icono}`} style={{ fontSize: 56, color: '#fff' }} />
      <span style={{ fontWeight: 700, fontSize: 19, color: '#fff', letterSpacing: 1, textTransform: 'uppercase' }}>{titulo}</span>
    </div>
  )
}

function Stat({ label, valor, color }) {
  return (
    <div style={{ textAlign: 'center', padding: '0 20px' }}>
      <div style={{ fontSize: 28, fontWeight: 700, color, lineHeight: 1 }}>{valor ?? '—'}</div>
      <div style={{ fontSize: 11, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 }}>{label}</div>
    </div>
  )
}

export default function Analista() {
  const navigate = useNavigate()
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
        analisis:  items.filter(i => ESTADOS_ANALISIS.has(i.estado)).length,
        hacerOC:   items.filter(i => ESTADOS_HACER_OC.has(i.estado)).length,
        retirar:   items.filter(i => ESTADOS_RETIRAR.has(i.estado)).length,
      })
    }
    cargar()
  }, [])

  return (
    <div className="container-fluid flex-grow-1 d-flex flex-column py-4">
      <div className="container d-flex justify-content-between align-items-center mb-5">
        <p className="mb-0" style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: 2 }}>
          Analista
        </p>
        <button onClick={() => navigate(-1)} className="btn btn-outline-dark btn-sm">← Volver</button>
      </div>
      <div className="container flex-grow-1 d-flex flex-column align-items-center justify-content-center gap-4" style={{ paddingBottom: '6vh' }}>
        <h2 className="mb-3" style={{ fontWeight: 700, fontSize: 36, color: 'var(--color-text)', textTransform: 'uppercase', letterSpacing: 3 }}>
          Analista
        </h2>

        {/* Tarjeta de resumen */}
        <div className="card mb-2" style={{ borderRadius: 12, padding: '16px 8px', minWidth: 340 }}>
          <div className="d-flex justify-content-center align-items-center" style={{ gap: 0 }}>
            <Stat label="Para analisis" valor={conteos?.analisis} color="#0d6efd" />
            <div style={{ width: 1, height: 40, background: '#ddd' }} />
            <Stat label="Hacer OC"      valor={conteos?.hacerOC}  color="#198754" />
            <div style={{ width: 1, height: 40, background: '#ddd' }} />
            <Stat label="Para retirar"  valor={conteos?.retirar}  color="#6f42c1" />
          </div>
        </div>

        <div className="d-flex flex-wrap justify-content-center gap-4">
          {tarjetas.map((t) => <Tarjeta key={t.titulo} {...t} />)}
        </div>
      </div>
    </div>
  )
}
