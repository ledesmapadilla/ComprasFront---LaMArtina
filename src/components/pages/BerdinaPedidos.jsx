import { useState, useEffect } from 'react'

const fmtNro = (n) => `B-${String(n).padStart(3, '0')}`
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { api } from '../../services/api'

const URGENCIAS = ['Baja', 'Media', 'Alta', 'Crítica']
const ESTADOS   = ['Pedido', 'Pendiente', 'En proceso', 'Completado', 'Cancelado']
const GRUPOS    = ['Pulverizadora', 'Chancho', 'Nodriza', 'Desmalezadora', 'Herbicida', 'Abonadora', 'Riego', 'Arquito', 'Tractores', 'Camioneta', 'Manitou', 'Colectivos', 'Herreria', 'Gomeria', 'Stock', 'Otros']

const ITEM_INIT = { nombre_repuesto: '', cant: '', descripcion: '', urgencia: 'Media', grupo: 'Tractores', cc: '', estado: 'Pendiente' }

const estiloX = {
  position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
  cursor: 'pointer', fontSize: 13, fontWeight: 900, color: 'var(--color-muted)',
  zIndex: 5, userSelect: 'none', lineHeight: 1,
}

export default function BerdinaPedidos() {
  const navigate = useNavigate()
  const [pedidos, setPedidos] = useState([])
  const [form, setForm] = useState(ITEM_INIT)
  const [editPedidoId, setEditPedidoId] = useState(null)
  const [editItemId, setEditItemId] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const FILTROS_INIT = { nro: '', fecha: '', cc: '', repuesto: '', urgencia: '', grupo: '', estado: '' }
  const [filtros, setFiltros] = useState(FILTROS_INIT)
  const setF = (k, v) => setFiltros(f => ({ ...f, [k]: v }))
  const limpiar = () => setFiltros(FILTROS_INIT)
  const hayFiltros = Object.values(filtros).some(v => v !== '')

  const cargar = () => api.get('/berdina/pedidos').then(setPedidos).catch(() => {})
  useEffect(() => { cargar() }, [])

  const items = pedidos.flatMap(p =>
    (p.items || []).map(item => ({ ...item, nro_pedido: p.nro_pedido, fecha: p.fecha, pedidoId: p._id }))
  )

  const lista = items.filter(item => {
    if (filtros.nro && !fmtNro(item.nro_pedido).includes(filtros.nro.toUpperCase())) return false
    if (filtros.fecha && item.fecha?.slice(0, 10) !== filtros.fecha) return false
    if (filtros.cc && !item.cc?.toLowerCase().includes(filtros.cc.toLowerCase())) return false
    if (filtros.repuesto && !item.nombre_repuesto?.toLowerCase().includes(filtros.repuesto.toLowerCase())) return false
    if (filtros.urgencia && item.urgencia !== filtros.urgencia) return false
    if (filtros.grupo && item.grupo !== filtros.grupo) return false
    if (filtros.estado && item.estado !== filtros.estado) return false
    return true
  })

  const abrirEditar = (item) => {
    setForm({
      nombre_repuesto: item.nombre_repuesto,
      cant: item.cant || '',
      descripcion: item.descripcion || '',
      urgencia: item.urgencia,
      grupo: item.grupo,
      cc: item.cc || '',
      estado: item.estado,
    })
    setEditPedidoId(item.pedidoId)
    setEditItemId(item._id)
    setShowModal(true)
  }

  const cerrar = () => { setForm(ITEM_INIT); setEditPedidoId(null); setEditItemId(null); setShowModal(false) }

  const guardar = async (e) => {
    e.preventDefault()
    try {
      const { cant, ...rest } = form
      const payload = { ...rest, ...(cant !== '' && cant != null ? { cant: Number(cant) } : {}) }
      await api.put(`/berdina/pedidos/${editPedidoId}/items/${editItemId}`, payload)
      cargar()
      cerrar()
      Swal.fire({ icon: 'success', title: 'Guardado', timer: 1500, showConfirmButton: false })
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.message })
    }
  }

  const borrar = async (item) => {
    const result = await Swal.fire({
      title: '¿Borrar ítem?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#4a0812',
    })
    if (!result.isConfirmed) return
    try {
      await api.delete(`/berdina/pedidos/${item.pedidoId}/items/${item._id}`)
      cargar()
      Swal.fire({ icon: 'success', title: 'Borrado', timer: 1500, showConfirmButton: false })
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.message })
    }
  }

  const badgeUrgencia = (u) => {
    const map = { Baja: 'secondary', Media: 'warning', Alta: 'danger', Crítica: 'dark' }
    return <span className={`badge bg-${map[u] || 'secondary'}`}>{u}</span>
  }

  const badgeEstado = (e) => {
    const map = { Pedido: 'primary', Pendiente: 'secondary', 'En proceso': 'warning', Completado: 'success', Cancelado: 'danger' }
    return <span className={`badge bg-${map[e] || 'secondary'}`}>{e}</span>
  }

  return (
    <div className="container-fluid flex-grow-1 d-flex flex-column pt-2">

      <div className="container d-flex justify-content-between align-items-center mb-2">
        <p className="mb-0" style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: 2 }}>
          Compras · Berdina
        </p>
        <button onClick={() => navigate(-1)} className="btn btn-outline-dark btn-sm">← Volver</button>
      </div>

      <div className="container">
        <h4 className="text-center mb-2" style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2 }}>Pedidos</h4>

        <div className="d-flex flex-wrap gap-2 align-items-end mb-3">
          {/* N° Pedido */}
          <div>
            <label className="form-label form-label-sm mb-1 d-block" style={{ fontSize: 11 }}>N° Pedido</label>
            <div style={{ position: 'relative' }}>
              <input className="form-control form-control-sm" style={{ width: 80 }} value={filtros.nro} onChange={e => setF('nro', e.target.value)} placeholder="N°" />
              {filtros.nro && <span onClick={() => setF('nro', '')} style={estiloX}>✕</span>}
            </div>
          </div>
          {/* Fecha */}
          <div>
            <label className="form-label form-label-sm mb-1 d-block" style={{ fontSize: 11 }}>Fecha</label>
            <div style={{ position: 'relative' }}>
              <input type="date" className="form-control form-control-sm" value={filtros.fecha} onChange={e => setF('fecha', e.target.value)} />
              {filtros.fecha && <span onClick={() => setF('fecha', '')} style={estiloX}>✕</span>}
            </div>
          </div>
          {/* C.C. */}
          <div>
            <label className="form-label form-label-sm mb-1 d-block" style={{ fontSize: 11 }}>C.C.</label>
            <div style={{ position: 'relative' }}>
              <input className="form-control form-control-sm" style={{ width: 80 }} value={filtros.cc} onChange={e => setF('cc', e.target.value)} placeholder="C.C." />
              {filtros.cc && <span onClick={() => setF('cc', '')} style={estiloX}>✕</span>}
            </div>
          </div>
          {/* Repuesto */}
          <div>
            <label className="form-label form-label-sm mb-1 d-block" style={{ fontSize: 11 }}>Repuesto</label>
            <div style={{ position: 'relative' }}>
              <input className="form-control form-control-sm" style={{ width: 160 }} value={filtros.repuesto} onChange={e => setF('repuesto', e.target.value)} placeholder="Repuesto..." />
              {filtros.repuesto && <span onClick={() => setF('repuesto', '')} style={estiloX}>✕</span>}
            </div>
          </div>
          {/* Urgencia */}
          <div>
            <label className="form-label form-label-sm mb-1 d-block" style={{ fontSize: 11 }}>Urgencia</label>
            <div style={{ position: 'relative' }}>
              <select className="form-select form-select-sm" style={{ width: 110, ...(filtros.urgencia ? { backgroundImage: 'none' } : {}) }} value={filtros.urgencia} onChange={e => setF('urgencia', e.target.value)}>
                <option value="">Todas</option>
                {URGENCIAS.map(u => <option key={u}>{u}</option>)}
              </select>
              {filtros.urgencia && <span onClick={() => setF('urgencia', '')} style={estiloX}>✕</span>}
            </div>
          </div>
          {/* Grupo */}
          <div>
            <label className="form-label form-label-sm mb-1 d-block" style={{ fontSize: 11 }}>Grupo</label>
            <div style={{ position: 'relative' }}>
              <select className="form-select form-select-sm" style={{ width: 140, ...(filtros.grupo ? { backgroundImage: 'none' } : {}) }} value={filtros.grupo} onChange={e => setF('grupo', e.target.value)}>
                <option value="">Todos</option>
                {GRUPOS.map(g => <option key={g}>{g}</option>)}
              </select>
              {filtros.grupo && <span onClick={() => setF('grupo', '')} style={estiloX}>✕</span>}
            </div>
          </div>
          {/* Estado */}
          <div>
            <label className="form-label form-label-sm mb-1 d-block" style={{ fontSize: 11 }}>Estado</label>
            <div style={{ position: 'relative' }}>
              <select className="form-select form-select-sm" style={{ width: 130, ...(filtros.estado ? { backgroundImage: 'none' } : {}) }} value={filtros.estado} onChange={e => setF('estado', e.target.value)}>
                <option value="">Todos</option>
                {ESTADOS.map(s => <option key={s}>{s}</option>)}
              </select>
              {filtros.estado && <span onClick={() => setF('estado', '')} style={estiloX}>✕</span>}
            </div>
          </div>

          <div className="ms-auto d-flex gap-2 align-items-end">
            {hayFiltros && <button className="btn btn-sm btn-outline-secondary" onClick={limpiar}>Limpiar</button>}
            <button className="btn btn-outline-dark btn-sm" onClick={() => navigate('/berdina/pedidos/nuevo')}>+ Nuevo pedido</button>
          </div>
        </div>

        <div className="card">
          <div className="table-responsive" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
            <table className="table table-hover table-striped mb-0">
              <thead className="thead-blue thead-light" style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                <tr>
                  <th>N° Pedido</th>
                  <th>Fecha</th>
                  <th>C.C.</th>
                  <th>Repuesto</th>
                  <th>Cant.</th>
                  <th>Descripción</th>
                  <th>Urgencia</th>
                  <th>Grupo</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {lista.map(item => (
                  <tr key={item._id} className={item.urgencia === 'Crítica' ? 'row-critica' : ''}>
                    <td>{fmtNro(item.nro_pedido)}</td>
                    <td>{item.fecha?.slice(0, 10).split('-').reverse().join('/')}</td>
                    <td>{item.cc}</td>
                    <td>{item.nombre_repuesto}</td>
                    <td>{item.cant}</td>
                    <td>{item.descripcion}</td>
                    <td>{badgeUrgencia(item.urgencia)}</td>
                    <td>{item.grupo}</td>
                    <td>{badgeEstado(item.estado)}</td>
                    <td className="text-nowrap">
                      <button className="btn btn-sm btn-outline-secondary me-1" onClick={() => abrirEditar(item)}>Editar</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => borrar(item)}>Borrar</button>
                    </td>
                  </tr>
                ))}
                {lista.length === 0 && (
                  <tr><td colSpan={10} className="text-center text-muted py-3">Sin resultados</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar ítem</h5>
                <button type="button" className="btn-close" onClick={cerrar} />
              </div>
              <form onSubmit={guardar}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Nombre repuesto*</label>
                    <input className="form-control" value={form.nombre_repuesto}
                      onChange={e => setForm({ ...form, nombre_repuesto: e.target.value })} required />
                  </div>
                  <div className="row mb-3">
                    <div className="col">
                      <label className="form-label">Cant.</label>
                      <input type="number" min="1" className="form-control" value={form.cant}
                        onChange={e => setForm({ ...form, cant: e.target.value })} />
                    </div>
                    <div className="col">
                      <label className="form-label">C.C.</label>
                      <input className="form-control" value={form.cc}
                        onChange={e => setForm({ ...form, cc: e.target.value })} />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Descripción</label>
                    <textarea className="form-control" rows={2} value={form.descripcion}
                      onChange={e => setForm({ ...form, descripcion: e.target.value })} />
                  </div>
                  <div className="row mb-3">
                    <div className="col">
                      <label className="form-label">Grupo*</label>
                      <select className="form-select" value={form.grupo}
                        onChange={e => setForm({ ...form, grupo: e.target.value })}>
                        {GRUPOS.map(g => <option key={g}>{g}</option>)}
                      </select>
                    </div>
                    <div className="col">
                      <label className="form-label">Urgencia*</label>
                      <select className="form-select" value={form.urgencia}
                        onChange={e => setForm({ ...form, urgencia: e.target.value })}>
                        {URGENCIAS.map(u => <option key={u}>{u}</option>)}
                      </select>
                    </div>
                    <div className="col">
                      <label className="form-label">Estado*</label>
                      <select className="form-select" value={form.estado}
                        onChange={e => setForm({ ...form, estado: e.target.value })}>
                        {ESTADOS.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" onClick={cerrar}>Cancelar</button>
                  <button type="submit" className="btn btn-outline-dark">Guardar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
