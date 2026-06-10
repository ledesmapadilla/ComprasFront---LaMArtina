import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { api } from '../../services/api'

const URGENCIAS = ['Baja', 'Media', 'Alta', 'Crítica']
const ESTADOS   = ['Pendiente', 'En proceso', 'Completado', 'Cancelado']
const FORM_INIT = { fecha: '', nombre_repuesto: '', descripcion: '', urgencia: 'Media', destino: '', estado: 'Pendiente' }

export default function BerdinaPedidos() {
  const navigate = useNavigate()
  const [pedidos, setPedidos] = useState([])
  const [form, setForm] = useState(FORM_INIT)
  const [editId, setEditId] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [busqueda, setBusqueda] = useState('')

  const cargar = () => api.get('/berdina/pedidos').then(setPedidos).catch(() => {})
  useEffect(() => { cargar() }, [])

  const abrirNuevo = () => {
    setForm({ ...FORM_INIT, fecha: new Date().toISOString().slice(0, 10) })
    setEditId(null)
    setShowModal(true)
  }

  const abrirEditar = (p) => {
    setForm({
      fecha: p.fecha?.slice(0, 10) || '',
      nombre_repuesto: p.nombre_repuesto,
      descripcion: p.descripcion,
      urgencia: p.urgencia,
      destino: p.destino,
      estado: p.estado,
    })
    setEditId(p._id)
    setShowModal(true)
  }

  const cerrar = () => { setForm(FORM_INIT); setEditId(null); setShowModal(false) }

  const guardar = async (e) => {
    e.preventDefault()
    try {
      if (editId) {
        await api.put(`/berdina/pedidos/${editId}`, form)
      } else {
        await api.post('/berdina/pedidos', form)
      }
      cargar()
      cerrar()
      Swal.fire({ icon: 'success', title: 'Guardado', timer: 1500, showConfirmButton: false })
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.message })
    }
  }

  const borrar = async (id) => {
    const result = await Swal.fire({
      title: '¿Borrar pedido?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#4a0812',
    })
    if (!result.isConfirmed) return
    try {
      await api.delete(`/berdina/pedidos/${id}`)
      cargar()
      Swal.fire({ icon: 'success', title: 'Borrado', timer: 1500, showConfirmButton: false })
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.message })
    }
  }

  const lista = pedidos.filter(p =>
    [p.nombre_repuesto, p.descripcion, p.destino, p.urgencia, p.estado]
      .some(v => v?.toLowerCase().includes(busqueda.toLowerCase()))
  )

  const badgeUrgencia = (u) => {
    const map = { Baja: 'secondary', Media: 'warning', Alta: 'danger', Crítica: 'dark' }
    return <span className={`badge bg-${map[u] || 'secondary'}`}>{u}</span>
  }

  const badgeEstado = (e) => {
    const map = { Pendiente: 'secondary', 'En proceso': 'primary', Completado: 'success', Cancelado: 'danger' }
    return <span className={`badge bg-${map[e] || 'secondary'}`}>{e}</span>
  }

  return (
    <div className="container-fluid flex-grow-1 d-flex flex-column pt-2">

      {/* Header */}
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
            placeholder="Buscar por repuesto, destino, urgencia, estado..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
          <button className="btn btn-outline-dark" onClick={abrirNuevo}>+ Nuevo pedido</button>
        </div>

        <div className="card">
          <div className="table-responsive">
            <table className="table table-hover table-striped mb-0">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Repuesto</th>
                  <th>Descripción</th>
                  <th>Urgencia</th>
                  <th>Destino</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {lista.map(p => (
                  <tr key={p._id}>
                    <td>{p.fecha?.slice(0, 10)}</td>
                    <td>{p.nombre_repuesto}</td>
                    <td>{p.descripcion}</td>
                    <td>{badgeUrgencia(p.urgencia)}</td>
                    <td>{p.destino}</td>
                    <td>{badgeEstado(p.estado)}</td>
                    <td className="text-nowrap">
                      <button className="btn btn-sm btn-outline-secondary me-1" onClick={() => abrirEditar(p)}>Editar</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => borrar(p._id)}>Borrar</button>
                    </td>
                  </tr>
                ))}
                {lista.length === 0 && (
                  <tr><td colSpan={7} className="text-center text-muted py-3">Sin resultados</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editId ? 'Editar pedido' : 'Nuevo pedido'}</h5>
                <button type="button" className="btn-close" onClick={cerrar} />
              </div>
              <form onSubmit={guardar}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Fecha*</label>
                    <input type="date" className="form-control" value={form.fecha}
                      onChange={e => setForm({ ...form, fecha: e.target.value })} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Nombre repuesto*</label>
                    <input className="form-control" value={form.nombre_repuesto}
                      onChange={e => setForm({ ...form, nombre_repuesto: e.target.value })} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Descripción</label>
                    <textarea className="form-control" rows={2} value={form.descripcion}
                      onChange={e => setForm({ ...form, descripcion: e.target.value })} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Urgencia*</label>
                    <select className="form-select" value={form.urgencia}
                      onChange={e => setForm({ ...form, urgencia: e.target.value })}>
                      {URGENCIAS.map(u => <option key={u}>{u}</option>)}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Destino*</label>
                    <input className="form-control" value={form.destino}
                      onChange={e => setForm({ ...form, destino: e.target.value })} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Estado*</label>
                    <select className="form-select" value={form.estado}
                      onChange={e => setForm({ ...form, estado: e.target.value })}>
                      {ESTADOS.map(s => <option key={s}>{s}</option>)}
                    </select>
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
