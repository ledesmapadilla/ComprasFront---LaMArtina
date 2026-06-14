import { useLocation, useNavigate } from 'react-router-dom'

const fmtPrecio = (n) =>
  n != null && n !== '' && !isNaN(n)
    ? new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n)
    : '—'

const fmtNro = (n, src) =>
  src === 'berdina' ? `B-${String(n).padStart(3, '0')}` : `SP-${String(n).padStart(3, '0')}`

const fmtFecha = (d) =>
  d ? d.slice(0, 10).split('-').reverse().join('/') : '—'

export default function VerAnalisis() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const item = state?.item

  if (!item) return (
    <div className="container pt-4 text-center">
      <p className="text-muted">Sin datos para mostrar.</p>
      <button className="btn btn-outline-dark btn-sm" onClick={() => navigate(-1)}>← Volver</button>
    </div>
  )

  const precios = [1, 2, 3].filter(n => item[`proveedor${n}`])
  const valoresPrecios = precios.map(n => item[`precio${n}`]).filter(v => v != null && v > 0)
  const precioMin = valoresPrecios.length > 0 ? Math.min(...valoresPrecios) : null
  const precioTotal = precioMin != null && item.cant ? precioMin * item.cant : null

  const badgeUrgencia = (u) => {
    const bg = { Baja: '#6c757d', Media: '#c87800', Alta: '#dc3545', 'Crítica': '#7b0000' }
    return <span className="badge" style={{ backgroundColor: bg[u] || '#6c757d' }}>{u}</span>
  }

  return (
    <div className="container-fluid flex-grow-1 d-flex flex-column pt-2">

      <div className="container d-flex justify-content-between align-items-center mb-2">
        <p className="mb-0" style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: 2 }}>
          Gerencia
        </p>
        <button onClick={() => navigate(-1)} className="btn btn-outline-dark btn-sm">← Volver</button>
      </div>

      <div className="container">

        {/* Encabezado */}
        <div className="card mb-3 p-3">
          <div className="d-flex flex-wrap gap-4 align-items-start">
            <div style={{ flex: '1 1 auto' }}>
              <div style={{ fontSize: 11, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Repuesto</div>
              <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.2 }}>{item.nombre_repuesto}</div>
              <div style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: 4 }}>
                {fmtNro(item.nro_pedido, item._src)} · {fmtFecha(item.fecha)}
              </div>
            </div>
            <div className="d-flex flex-wrap gap-3">
              {item.cant != null && item.cant !== '' && (
                <div>
                  <div style={{ fontSize: 11, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Cant.</div>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>{item.cant}{item.unidad ? ` ${item.unidad}` : ''}</div>
                </div>
              )}
              {item.cc && (
                <div>
                  <div style={{ fontSize: 11, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>C.C.</div>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>{item.cc}</div>
                </div>
              )}
              {item.grupo && (
                <div>
                  <div style={{ fontSize: 11, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Grupo</div>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>{item.grupo}</div>
                </div>
              )}
              {item.solicita && (
                <div>
                  <div style={{ fontSize: 11, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Solicita</div>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>{item.solicita}</div>
                </div>
              )}
              <div>
                <div style={{ fontSize: 11, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Urgencia</div>
                <div style={{ marginTop: 2 }}>{badgeUrgencia(item.urgencia)}</div>
              </div>
              {precioTotal != null && (
                <div>
                  <div style={{ fontSize: 11, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Total mínimo</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-accent)' }}>{fmtPrecio(precioTotal)}</div>
                </div>
              )}
            </div>
          </div>
          {item.descripcion && (
            <div className="mt-3 pt-3" style={{ borderTop: '1px solid #dee2e6', fontSize: 13, color: '#444' }}>
              <span style={{ color: 'var(--color-muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 }}>Descripción</span>
              <div style={{ marginTop: 2 }}>{item.descripcion}</div>
            </div>
          )}
        </div>

        {/* Tabla de análisis */}
        <div className="card">
          <div className="table-responsive">
            <table className="table table-hover table-striped mb-0">
              <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                <tr>
                  <th>Proveedor</th>
                  <th className="text-end">Precio unit.</th>
                  <th className="text-end">Precio total</th>
                </tr>
              </thead>
              <tbody>
                {precios.length === 0 && (
                  <tr>
                    <td colSpan={3} className="text-center text-muted py-4 fst-italic">
                      Sin datos de análisis cargados.
                    </td>
                  </tr>
                )}
                {precios.map(n => {
                  const pu = item[`precio${n}`]
                  const pt = pu != null && item.cant ? pu * item.cant : null
                  const esMin = pu === precioMin
                  return (
                    <tr key={n} style={esMin && precios.length > 1 ? { backgroundColor: 'rgba(25,135,84,0.08)' } : {}}>
                      <td style={{ fontWeight: 500 }}>
                        {item[`proveedor${n}`]}
                        {esMin && precios.length > 1 && (
                          <span className="badge ms-2" style={{ backgroundColor: '#198754', fontSize: 10 }}>precio mínimo</span>
                        )}
                      </td>
                      <td className="text-end" style={{ fontWeight: esMin ? 700 : 400 }}>{fmtPrecio(pu)}</td>
                      <td className="text-end" style={{ fontWeight: esMin ? 700 : 400 }}>{fmtPrecio(pt)}</td>
                    </tr>
                  )
                })}
              </tbody>
              {precioTotal != null && (
                <tfoot>
                  <tr style={{ backgroundColor: '#f4f6f8' }}>
                    <td colSpan={2} className="text-end" style={{ fontWeight: 700, fontSize: 15 }}>Total mínimo</td>
                    <td className="text-end" style={{ fontWeight: 700, fontSize: 15, color: 'var(--color-accent)' }}>{fmtPrecio(precioTotal)}</td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}
