import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { api } from '../../services/api'

const FORM_INIT = { sigla: '', nombre: '' }

export default function CentrosCosto() {
  const navigate = useNavigate()
  const [centros, setCentros] = useState([])
  const [form, setForm] = useState(FORM_INIT)
  const [editId, setEditId] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [busqueda, setBusqueda] = useState('')

  const cargar = () => api.get('/centros-costo').then(setCentros).catch(() => {})
  useEffect(() => { cargar() }, [])

  const abrirNuevo = () => { setForm(FORM_INIT); setEditId(null); setShowModal(true) }
  const abrirEditar = (c) => { setForm({ sigla: c.sigla, nombre: c.nombre }); setEditId(c._id); setShowModal(true) }
  const cerrar = () => { setForm(FORM_INIT); setEditId(null); setShowModal(false) }

  const guardar = async (e) => {
    e.preventDefault()
    try {
      if (editId) await api.put(`/centros-costo/${editId}`, form)
      else        await api.post('/centros-costo', form)
      cargar(); cerrar()
      Swal.fire({ icon: 'success', title: 'Guardado', timer: 1500, showConfirmButton: false })
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.message })
    }
  }

  const borrar = async (id) => {
    const result = await Swal.fire({
      title: '¿Borrar centro de costo?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc3545',
    })
    if (!result.isConfirmed) return
    try {
      await api.delete(`/centros-costo/${id}`)
      cargar()
      Swal.fire({ icon: 'success', title: 'Borrado', timer: 1500, showConfirmButton: false })
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.message })
    }
  }

  const lista = centros.filter(c =>
    c.sigla.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.nombre.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div className="container py-4">
      <div className="w-75 mx-auto">

        <div className="d-flex justify-content-between align-items-center mb-2">
          <p className="mb-0" style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: 2 }}>
            Altas
          </p>
          <button onClick={() => navigate(-1)} className="btn btn-outline-dark btn-sm">← Volver</button>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="mb-0" style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2 }}>Centros de Costo</h4>
          <button className="btn btn-outline-dark" onClick={abrirNuevo}>+ Nuevo CC</button>
        </div>

        <div style={{ position: 'relative', width: '50%' }} className="mb-3">
          <input
            className="form-control"
            placeholder="Buscar por sigla o nombre..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
          {busqueda && (
            <span onClick={() => setBusqueda('')} style={{
              position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
              cursor: 'pointer', fontSize: 14, fontWeight: 900, color: 'var(--color-muted)', zIndex: 5, userSelect: 'none',
            }}>✕</span>
          )}
        </div>

        <div className="card">
          <div className="table-responsive">
            <table className="table table-hover table-striped mb-0">
              <thead className="thead-blue">
                <tr>
                  <th>Sigla</th>
                  <th>Nombre</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {lista.map(c => (
                  <tr key={c._id}>
                    <td><span className="badge bg-secondary">{c.sigla}</span></td>
                    <td>{c.nombre}</td>
                    <td className="text-nowrap">
                      <button className="btn btn-sm btn-outline-secondary me-1" onClick={() => abrirEditar(c)}>Editar</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => borrar(c._id)}>Borrar</button>
                    </td>
                  </tr>
                ))}
                {lista.length === 0 && (
                  <tr><td colSpan={3} className="text-center text-muted py-3">Sin resultados</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-sm">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editId ? 'Editar CC' : 'Nuevo CC'}</h5>
                <button type="button" className="btn-close" onClick={cerrar} />
              </div>
              <form onSubmit={guardar}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Sigla*</label>
                    <input className="form-control" value={form.sigla}
                      onChange={e => setForm({ ...form, sigla: e.target.value.toUpperCase() })}
                      placeholder="Ej: ADM" required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Nombre*</label>
                    <input className="form-control" value={form.nombre}
                      onChange={e => setForm({ ...form, nombre: e.target.value })}
                      placeholder="Ej: Administración" required />
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
