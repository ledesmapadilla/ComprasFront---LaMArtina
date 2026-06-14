import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../services/api'

const fmtNro = (n, src) =>
  src === 'berdina' ? `B-${String(n).padStart(3, '0')}` : `SP-${String(n).padStart(3, '0')}`

const fmtFecha = (f) =>
  f ? new Date(f).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' }) : '—'

const DECISION = {
  'Para hacer OC': { label: 'Aprobado', cls: 'text-success', fw: 700 },
  'Cancelado':     { label: 'Rechazado', cls: 'text-danger', fw: 700 },
  'Para analisis': { label: 'A revisar', cls: 'text-warning', fw: 700 },
}

export default function GerenciaHistorial() {
  const navigate = useNavigate()
  const [filas, setFilas] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const cargar = async () => {
      const [berdina, sanpablo] = await Promise.all([
        api.get('/berdina/pedidos/historial-gerencia').catch(() => []),
        api.get('/sanpablo/pedidos/historial-gerencia').catch(() => []),
      ])
      const todas = [
        ...berdina.map(i => ({ ...i, _src: 'berdina' })),
        ...sanpablo.map(i => ({ ...i, _src: 'sanpablo' })),
      ]
      const grupos = Object.values(
        todas.reduce((acc, item) => {
          const key = `${item._src}-${item.nro_pedido}`
          if (!acc[key]) acc[key] = { _src: item._src, nro_pedido: item.nro_pedido, items: [] }
          acc[key].items.push(item)
          return acc
        }, {})
      ).sort((a, b) => {
        const fa = a.items[0]?.accionesGerencia.at(-1)?.fecha
        const fb = b.items[0]?.accionesGerencia.at(-1)?.fecha
        return new Date(fb) - new Date(fa)
      })
      setFilas(grupos)
      setCargando(false)
    }
    cargar()
  }, [])

  const badgeTaller = (src) => (
    <span
      className="badge"
      style={{
        backgroundColor: src === 'berdina' ? '#1a3326' : '#4a0812',
        fontSize: 12,
        letterSpacing: 0.5,
        minWidth: 28,
      }}
    >
      {src === 'berdina' ? 'B' : 'SP'}
    </span>
  )

  return (
    <div className="container-fluid flex-grow-1 d-flex flex-column pt-2">

      <div className="container d-flex justify-content-between align-items-center mb-2">
        <p className="mb-0" style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: 2 }}>
          Gerencia · Historial
        </p>
        <button onClick={() => navigate(-1)} className="btn btn-outline-dark btn-sm">← Volver</button>
      </div>

      <div className="container">
        <h4 className="text-center mb-4" style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2 }}>
          Historial de Gerencia{' '}
          {!cargando && (
            <span style={{ fontWeight: 400, fontSize: '0.75em', letterSpacing: 1, textTransform: 'none' }}>
              ({filas.length} pedidos)
            </span>
          )}
        </h4>

        {cargando ? (
          <div className="text-center py-5">
            <div className="spinner-border text-secondary" role="status" />
          </div>
        ) : (
          <div className="card">
            <div className="table-responsive">
              <table className="table table-hover table-striped mb-0">
                <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                  <tr>
                    <th className="text-center" style={{ width: 64 }}>Taller</th>
                    <th>Repuesto</th>
                    <th className="text-center" style={{ width: 110 }}>Decisión</th>
                    <th style={{ width: 130 }}>Fecha</th>
                    <th>Nota</th>
                    <th style={{ width: 120 }}>Estado actual</th>
                  </tr>
                </thead>
                <tbody>
                  {filas.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center text-muted py-4">
                        Sin registros de Gerencia todavía
                      </td>
                    </tr>
                  )}
                  {filas.map((grupo) => {
                    const ultimaAccion = grupo.items[0]?.accionesGerencia.at(-1)
                    const dec = DECISION[ultimaAccion?.estado] ?? { label: ultimaAccion?.estado || '—', cls: '', fw: 400 }
                    const nota = grupo.items.map(i => i.accionesGerencia.at(-1)?.nota).find(Boolean)
                    return (
                      <tr key={`${grupo._src}-${grupo.nro_pedido}`} style={{ verticalAlign: 'middle' }}>
                        <td className="text-center">
                          {badgeTaller(grupo._src)}
                          <div style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 3 }}>
                            {fmtNro(grupo.nro_pedido, grupo._src)}
                          </div>
                        </td>
                        <td>
                          {grupo.items.length === 1 ? (
                            <>
                              <div style={{ fontWeight: 600, fontSize: 14 }}>{grupo.items[0].nombre_repuesto}</div>
                              {grupo.items[0].cant && (
                                <div style={{ fontSize: 11, color: 'var(--color-muted)' }}>x{grupo.items[0].cant}</div>
                              )}
                            </>
                          ) : (
                            <ul className="mb-0 ps-3" style={{ fontSize: 13 }}>
                              {grupo.items.map((item, i) => (
                                <li key={i}>
                                  <span style={{ fontWeight: 600 }}>{item.nombre_repuesto}</span>
                                  {item.cant && <span style={{ color: 'var(--color-muted)', fontSize: 11 }}> x{item.cant}</span>}
                                </li>
                              ))}
                            </ul>
                          )}
                        </td>
                        <td className={`text-center ${dec.cls}`} style={{ fontWeight: dec.fw, fontSize: 13 }}>
                          {dec.label}
                        </td>
                        <td style={{ fontSize: 12, color: 'var(--color-muted)' }}>
                          {fmtFecha(ultimaAccion?.fecha)}
                        </td>
                        <td style={{ fontSize: 12, color: '#555' }}>
                          {nota || <span className="text-muted">—</span>}
                        </td>
                        <td style={{ fontSize: 12 }}>
                          {grupo.items.length === 1
                            ? grupo.items[0].estado || '—'
                            : [...new Set(grupo.items.map(i => i.estado))].join(', ')
                          }
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}
