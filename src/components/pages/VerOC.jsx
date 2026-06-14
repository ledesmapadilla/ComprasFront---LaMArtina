import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { api } from '../../services/api'

const fmtPrecio = (v) =>
  v == null ? '—'
  : new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 2 }).format(v)

const fmtNro = (n, src) =>
  src === 'berdina' ? `B-${String(n).padStart(3, '0')}` : `SP-${String(n).padStart(3, '0')}`

const fmtFecha = (d) =>
  d ? new Date(d).toLocaleDateString('es-AR') : '—'

const establecimientoLabel = (e) =>
  e === 'berdina' ? 'Berdina' : e === 'sanpablo' ? 'San Pablo' : e === 'mixto' ? 'Berdina + San Pablo' : e || '—'

export default function VerOC() {
  const { nro } = useParams()
  const navigate = useNavigate()
  const { state } = useLocation()
  const modoAnalisis = !!state?.item

  const [oc, setOc] = useState(null)
  const [proveedores, setProveedores] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    if (modoAnalisis) {
      const item = state.item
      api.get('/proveedores').catch(() => []).then(provs => {
        setProveedores(provs)
        const filas = [1, 2, 3]
          .filter(n => item[`proveedor${n}`])
          .map(n => ({
            nro_pedido:      item.nro_pedido,
            _src:            item._src,
            fecha:           item.fecha,
            nombre_repuesto: item.nombre_repuesto,
            cant:            item.cant,
            precio_unitario: item[`precio${n}`],
            precio_total:    item[`precio${n}`] != null && item.cant ? item[`precio${n}`] * item.cant : null,
            proveedor:       item[`proveedor${n}`],
            observaciones:   '',
          }))
        const precios = filas.map(f => f.precio_unitario).filter(v => v != null && v > 0)
        const totalMin = precios.length > 0 ? Math.min(...precios) * (item.cant || 0) : 0
        setOc({
          nro_oc_display: fmtNro(item.nro_pedido, item._src),
          fecha:          item.fecha,
          establecimiento: item._src,
          items:          filas,
          total:          totalMin,
          _modoAnalisis:  true,
        })
      })
      return
    }

    Promise.all([
      api.get(`/oc/by-display/${encodeURIComponent(nro)}`),
      api.get('/proveedores').catch(() => []),
    ])
      .then(([ocData, provs]) => { setOc(ocData); setProveedores(provs) })
      .catch(err => setError(err.message))
  }, [nro, modoAnalisis])

  const provNombre = (id) =>
    proveedores.find(p => p._id === id)?.razonsocial || id || '—'

  if (error) return (
    <div className="container pt-4 text-center">
      <p className="text-danger">{error}</p>
      <button className="btn btn-outline-dark btn-sm" onClick={() => navigate(-1)}>← Volver</button>
    </div>
  )

  if (!oc) return (
    <div className="container-fluid flex-grow-1 d-flex align-items-center justify-content-center">
      <div className="spinner-border text-secondary" role="status" />
    </div>
  )

  return (
    <div className="container-fluid flex-grow-1 d-flex flex-column pt-2">

      <div className="container d-flex justify-content-between align-items-center mb-2">
        <p className="mb-0" style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: 2 }}>
          {oc._modoAnalisis ? 'Análisis' : 'Orden de Compra'}
        </p>
        <button onClick={() => navigate(-1)} className="btn btn-outline-dark btn-sm">← Volver</button>
      </div>

      <div className="container">

        <div className="card mb-3 p-3">
          <div className="d-flex flex-wrap gap-4 align-items-center">
            <div>
              <div style={{ fontSize: 11, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>
                {oc._modoAnalisis ? 'N° Pedido' : 'N° OC'}
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: 1 }}>{oc.nro_oc_display}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Fecha</div>
              <div style={{ fontSize: 16, fontWeight: 500 }}>{fmtFecha(oc.fecha)}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Establecimiento</div>
              <div style={{ fontSize: 16, fontWeight: 500 }}>{establecimientoLabel(oc.establecimiento)}</div>
            </div>
            <div className="ms-auto">
              <div style={{ fontSize: 11, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>
                {oc._modoAnalisis ? 'Total mínimo' : 'Total'}
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-accent)' }}>{fmtPrecio(oc.total)}</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="table-responsive">
            <table className="table table-hover table-striped mb-0">
              <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                <tr>
                  <th>N° Pedido</th>
                  <th>Fecha</th>
                  <th>Repuesto</th>
                  <th className="text-center">Cant.</th>
                  <th className="text-end">Precio Unit.</th>
                  <th className="text-end">Precio Total</th>
                  <th>Proveedor</th>
                  {!oc._modoAnalisis && <th>Observaciones</th>}
                </tr>
              </thead>
              <tbody>
                {(oc.items || []).map((item, idx) => (
                  <tr key={idx}>
                    <td className="text-nowrap">{fmtNro(item.nro_pedido, item._src)}</td>
                    <td className="text-nowrap">{fmtFecha(item.fecha)}</td>
                    <td style={{ fontWeight: 500 }}>{item.nombre_repuesto}</td>
                    <td className="text-center">{item.cant ?? '—'}</td>
                    <td className="text-end">{fmtPrecio(item.precio_unitario)}</td>
                    <td className="text-end" style={{ fontWeight: 600 }}>{fmtPrecio(item.precio_total)}</td>
                    <td>{provNombre(item.proveedor)}</td>
                    {!oc._modoAnalisis && (
                      <td style={{ color: item.observaciones ? 'inherit' : 'var(--color-muted)', fontStyle: item.observaciones ? 'normal' : 'italic' }}>
                        {item.observaciones || 'Sin observaciones'}
                      </td>
                    )}
                  </tr>
                ))}
                {(oc.items || []).length === 0 && (
                  <tr><td colSpan={8} className="text-center text-muted py-3">Sin ítems</td></tr>
                )}
              </tbody>
              <tfoot>
                <tr style={{ backgroundColor: '#f4f6f8' }}>
                  <td colSpan={5} className="text-end" style={{ fontWeight: 700, fontSize: 15 }}>
                    {oc._modoAnalisis ? 'Total mínimo' : 'Total'}
                  </td>
                  <td className="text-end" style={{ fontWeight: 700, fontSize: 15, color: 'var(--color-accent)' }}>{fmtPrecio(oc.total)}</td>
                  <td colSpan={oc._modoAnalisis ? 1 : 2} />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}
