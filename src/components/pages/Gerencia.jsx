import { useState, useEffect, Fragment } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { api } from '../../services/api'

const fmtPrecio = (n) =>
  n != null && n !== '' && !isNaN(n)
    ? new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n)
    : '—'

const fmtNro = (n, src) =>
  src === 'berdina' ? `B-${String(n).padStart(3, '0')}` : `SP-${String(n).padStart(3, '0')}`

const URG_ORDER = { 'Crítica': 0, 'Alta': 1, 'Media': 2, 'Baja': 3 }

export default function Gerencia() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [expandedId, setExpandedId] = useState(null)
  const [cargando, setCargando] = useState(true)

  const cargar = async () => {
    setCargando(true)
    const [berdina, sanpablo] = await Promise.all([
      api.get('/berdina/pedidos').catch(() => []),
      api.get('/sanpablo/pedidos').catch(() => []),
    ])
    const todos = [
      ...berdina.map(p => ({ ...p, _src: 'berdina' })),
      ...sanpablo.map(p => ({ ...p, _src: 'sanpablo' })),
    ]
    const autorizar = todos
      .flatMap(p =>
        (p.items || [])
          .filter(i => i.estado === 'Autorizar')
          .map(i => ({
            ...i,
            nro_pedido: p.nro_pedido,
            fecha: p.fecha,
            pedidoId: p._id,
            _src: p._src,
          }))
      )
      .sort((a, b) => {
        const ua = URG_ORDER[a.urgencia] ?? 4
        const ub = URG_ORDER[b.urgencia] ?? 4
        return ua !== ub ? ua - ub : new Date(b.fecha) - new Date(a.fecha)
      })
    setItems(autorizar)
    setCargando(false)
  }

  useEffect(() => { cargar() }, [])

  const toggleExpand = (id) => setExpandedId(prev => (prev === id ? null : id))

  const aprobar = async (item) => {
    const { isConfirmed } = await Swal.fire({
      title: '¿Aprobar repuesto?',
      html: `<div style="font-weight:600;margin-bottom:6px">${item.nombre_repuesto}</div>
             <div style="font-size:13px;color:#555">El estado pasará a <strong>Para hacer OC</strong>.</div>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Aprobar',
      cancelButtonText: 'Cancelar',
      buttonsStyling: false,
      customClass: { confirmButton: 'btn btn-outline-success me-2', cancelButton: 'btn btn-outline-secondary' },
    })
    if (!isConfirmed) return
    try {
      const base = item._src === 'berdina' ? '/berdina/pedidos' : '/sanpablo/pedidos'
      await api.put(`${base}/${item.pedidoId}/items/${item._id}`, {
        estado: 'Para hacer OC',
        usuario: 'Gerencia',
      })
      cargar()
      Swal.fire({ icon: 'success', title: 'Aprobado', timer: 1500, showConfirmButton: false })
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.message })
    }
  }

  const rechazar = async (item) => {
    const { value: motivo, isConfirmed } = await Swal.fire({
      title: '¿Rechazar repuesto?',
      html: `<div style="font-weight:600;margin-bottom:8px">${item.nombre_repuesto}</div>`,
      input: 'textarea',
      inputLabel: 'Motivo del rechazo',
      inputPlaceholder: 'Explicá el motivo...',
      showCancelButton: true,
      confirmButtonText: 'Rechazar',
      cancelButtonText: 'Cancelar',
      buttonsStyling: false,
      customClass: { confirmButton: 'btn btn-outline-danger me-2', cancelButton: 'btn btn-outline-secondary' },
      preConfirm: (val) => {
        if (!val?.trim()) { Swal.showValidationMessage('El motivo es obligatorio'); return false }
        return val.trim()
      },
    })
    if (!isConfirmed) return
    try {
      const base = item._src === 'berdina' ? '/berdina/pedidos' : '/sanpablo/pedidos'
      await api.put(`${base}/${item.pedidoId}/items/${item._id}`, {
        estado: 'Cancelado',
        usuario: 'Gerencia',
        nota: motivo,
      })
      cargar()
      Swal.fire({ icon: 'success', title: 'Rechazado', timer: 1500, showConfirmButton: false })
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.message })
    }
  }

  const revisar = async (item) => {
    const { isConfirmed } = await Swal.fire({
      title: '¿Enviar a revisión?',
      html: `<div style="font-weight:600;margin-bottom:6px">${item.nombre_repuesto}</div>
             <div style="font-size:13px;color:#555">Volverá al analista para revisión.</div>`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Enviar a revisar',
      cancelButtonText: 'Cancelar',
      buttonsStyling: false,
      customClass: { confirmButton: 'btn btn-outline-warning me-2', cancelButton: 'btn btn-outline-secondary' },
    })
    if (!isConfirmed) return
    try {
      const base = item._src === 'berdina' ? '/berdina/pedidos' : '/sanpablo/pedidos'
      await api.put(`${base}/${item.pedidoId}/items/${item._id}`, {
        estado: 'Para analisis',
        usuario: 'Gerencia',
        nota: 'Enviado a revisión por Gerencia',
      })
      cargar()
      Swal.fire({ icon: 'success', title: 'Enviado a revisar', timer: 1500, showConfirmButton: false })
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.message })
    }
  }

  const badgeUrgencia = (u) => {
    const bg = { Baja: '#6c757d', Media: '#c87800', Alta: '#dc3545', 'Crítica': '#7b0000' }
    return (
      <span className="badge" style={{ backgroundColor: bg[u] || '#6c757d', fontSize: 11, letterSpacing: 0.3 }}>
        {u}
      </span>
    )
  }

  const badgeTaller = (src) => (
    <span
      className="badge"
      style={{
        backgroundColor: src === 'berdina' ? '#1a3326' : '#4a0812',
        fontSize: 13,
        letterSpacing: 0.5,
        minWidth: 32,
      }}
    >
      {src === 'berdina' ? 'B' : 'SP'}
    </span>
  )

  return (
    <div className="container-fluid flex-grow-1 d-flex flex-column pt-2">

      <div className="container d-flex justify-content-between align-items-center mb-2">
        <p className="mb-0" style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: 2 }}>
          Gerencia
        </p>
        <button onClick={() => navigate(-1)} className="btn btn-outline-dark btn-sm">← Volver</button>
      </div>

      <div className="container">
        <h4 className="text-center mb-4" style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2 }}>
          Para Autorizar{' '}
          {!cargando && (
            <span style={{ fontWeight: 400, fontSize: '0.75em', letterSpacing: 1, textTransform: 'none' }}>
              ({items.length})
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
                    <th className="text-center" style={{ width: 48 }}>Taller</th>
                    <th>Repuesto</th>
                    <th className="text-center" style={{ width: 80 }}>Urgencia</th>
                    <th style={{ width: 140 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center text-muted py-4">
                        Sin repuestos para autorizar
                      </td>
                    </tr>
                  )}
                  {items.map(item => {
                    const isExpanded = expandedId === item._id
                    const tieneAnalisis = item.proveedor1 || item.proveedor2 || item.proveedor3
                    return (
                      <Fragment key={item._id}>
                        <tr
                          className={item.urgencia === 'Crítica' ? 'row-critica' : ''}
                          style={{ verticalAlign: 'middle' }}
                        >
                          <td className="text-center">
                            {badgeTaller(item._src)}
                          </td>
                          <td>
                            <div style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.3 }}>
                              {item.nombre_repuesto}
                            </div>
                            <div style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 2 }}>
                              {fmtNro(item.nro_pedido, item._src)}
                              {item.fecha ? ` · ${item.fecha.slice(0, 10).split('-').reverse().join('/')}` : ''}
                              {item.cc ? ` · CC: ${item.cc}` : ''}
                            </div>
                            <button
                              className="btn btn-sm btn-outline-secondary mt-1"
                              style={{ fontSize: 11, padding: '1px 8px', lineHeight: 1.6 }}
                              onClick={() => toggleExpand(item._id)}
                            >
                              {isExpanded ? '▲ Ocultar' : '▼ Ver'}
                            </button>
                          </td>
                          <td className="text-center">
                            {badgeUrgencia(item.urgencia)}
                          </td>
                          <td>
                            <div className="d-flex flex-column gap-1 align-items-stretch">
                              <button
                                className="btn btn-sm btn-outline-danger"
                                style={{ fontSize: 12, padding: '3px 6px' }}
                                onClick={() => rechazar(item)}
                              >
                                Rechazar
                              </button>
                              <button
                                className="btn btn-sm btn-outline-warning"
                                style={{ fontSize: 12, padding: '3px 6px' }}
                                onClick={() => revisar(item)}
                              >
                                Revisar
                              </button>
                              <button
                                className="btn btn-sm btn-outline-success"
                                style={{ fontSize: 12, padding: '3px 6px' }}
                                onClick={() => aprobar(item)}
                              >
                                Aprobar
                              </button>
                            </div>
                          </td>
                        </tr>

                        {isExpanded && (
                          <tr style={{ backgroundColor: '#f4f6f8' }}>
                            <td colSpan={4} style={{ padding: '10px 14px 14px' }}>
                              <div style={{ fontSize: 12 }}>

                                <div className="d-flex flex-wrap gap-3 mb-2" style={{ color: '#333' }}>
                                  {item.cant != null && item.cant !== '' && (
                                    <div>
                                      <span style={{ color: 'var(--color-muted)' }}>Cant:</span>{' '}
                                      <strong>{item.cant}{item.unidad ? ` ${item.unidad}` : ''}</strong>
                                    </div>
                                  )}
                                  {item.grupo && (
                                    <div>
                                      <span style={{ color: 'var(--color-muted)' }}>Grupo:</span>{' '}
                                      <strong>{item.grupo}</strong>
                                    </div>
                                  )}
                                  {item.solicita && (
                                    <div>
                                      <span style={{ color: 'var(--color-muted)' }}>Solicita:</span>{' '}
                                      <strong>{item.solicita}</strong>
                                    </div>
                                  )}
                                  {item.stock != null && item.stock !== '' && (
                                    <div>
                                      <span style={{ color: 'var(--color-muted)' }}>Stock:</span>{' '}
                                      <strong>{item.stock}</strong>
                                    </div>
                                  )}
                                </div>

                                {item.descripcion && (
                                  <div className="mb-2" style={{ color: '#444' }}>
                                    <span style={{ color: 'var(--color-muted)' }}>Descripción:</span>{' '}
                                    {item.descripcion}
                                  </div>
                                )}

                                {tieneAnalisis && (
                                  <>
                                    <div style={{ fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--color-muted)', marginBottom: 4 }}>
                                      Análisis de precios
                                    </div>
                                    <table className="table table-sm table-bordered mb-0" style={{ fontSize: 12, backgroundColor: '#fff' }}>
                                      <thead>
                                        <tr>
                                          <th style={{ fontWeight: 600, width: '55%' }}>Proveedor</th>
                                          <th style={{ fontWeight: 600 }}>Precio</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {[1, 2, 3].map(n =>
                                          item[`proveedor${n}`] ? (
                                            <tr key={n}>
                                              <td>{item[`proveedor${n}`]}</td>
                                              <td style={{ fontWeight: 500 }}>{fmtPrecio(item[`precio${n}`])}</td>
                                            </tr>
                                          ) : null
                                        )}
                                      </tbody>
                                    </table>
                                  </>
                                )}

                                {!tieneAnalisis && (
                                  <div style={{ color: 'var(--color-muted)', fontStyle: 'italic' }}>
                                    Sin datos de análisis cargados.
                                  </div>
                                )}

                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
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
