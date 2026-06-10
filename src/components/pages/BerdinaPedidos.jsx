import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { api } from '../../services/api'

const URGENCIAS = ['Baja', 'Media', 'Alta', 'Crítica']
const ESTADOS   = ['Pedido', 'Pendiente', 'En proceso', 'Completado', 'Cancelado']
const GRUPOS    = ['Pulverizadora', 'Chancho', 'Nodriza', 'Desmalezadora', 'Hervicida', 'Abonadora', 'Riego', 'Arquito', 'Tractores', 'Camioneta', 'Manitou', 'Colectivos', 'Herreria', 'Gomeria', 'Stock', 'Otros']

const ITEM_INIT = { nombre_repuesto: '', cant: '', descripcion: '', urgencia: 'Media', grupo: 'Tractores', cc: '', estado: 'Pendiente' }

export default function BerdinaPedidos() {
  const navigate = useNavigate()
  const [pedidos, setPedidos] = useState([])
  const [form, setForm] = useState(ITEM_INIT)
  const [editPedidoId, setEditPedidoId] = useState(null)
  const [editItemId, setEditItemId] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [busqueda, setBusqueda] = useState('')

  const cargar = () => api.get('/berdina/pedidos').then(setPedidos).catch(() => {})
  useEffect(() => { cargar() }, [])

  const items = pedidos.flatMap(p =>
    (p.items || []).map(item => ({ ...item, nro_pedido: p.nro_pedido, fecha: p.fecha, pedidoId: p._id }))
  )

  const lista = items.filter(item =>
    [item.nombre_repuesto, item.descripcion, item.grupo, item.cc, item.urgencia, item.estado]
      .some(v => v?.toLowerCase().includes(busqueda.toLowerCase()))
  )

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

        <div className="d-flex justify-content-between align-items-center mb-3">
          <input
            className="form-control w-25"
            placeholder="Buscar por repuesto, grupo, urgencia, estado..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
          <button className="btn btn-outline-dark" onClick={() => navigate('/berdina/pedidos/nuevo')}>+ Nuevo pedido</button>
        </div>

        <div className="card">
          <div style={{ maxHeight: 500, overflowY: 'auto', overflowX: 'auto' }}>
            <table className="table table-hover table-striped mb-0">
              <thead style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: 'var(--color-primary)', color: '#fff' }}>
                <tr>
                  <th>N° Pedido</th>
                  <th>Fecha</th>
                  <th>Repuesto</th>
                  <th>Cant.</th>
                  <th>Descripción</th>
                  <th>Urgencia</th>
                  <th>Grupo</th>
                  <th>C.C.</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {lista.map(item => (
                  <tr key={item._id}>
                    <td>{item.nro_pedido}</td>
                    <td>{item.fecha?.slice(0, 10).split('-').reverse().join('/')}</td>
                    <td>{item.nombre_repuesto}</td>
                    <td>{item.cant}</td>
                    <td>{item.descripcion}</td>
                    <td>{badgeUrgencia(item.urgencia)}</td>
                    <td>{item.grupo}</td>
                    <td>{item.cc}</td>
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
