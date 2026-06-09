import { useState } from 'react'

const USUARIOS_INIT = [
  { id: 1, nombre: 'Juan Pérez', email: 'juan@lamartinacompras.com', rol: 'solicitante', activo: true },
  { id: 2, nombre: 'María García', email: 'maria@lamartinacompras.com', rol: 'aprobador', activo: true },
]

const FORM_INIT = { nombre: '', email: '', rol: 'solicitante', activo: true }

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState(USUARIOS_INIT)
  const [form, setForm] = useState(FORM_INIT)
  const [editId, setEditId] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const guardar = (e) => {
    e.preventDefault()
    if (editId) {
      setUsuarios(usuarios.map(u => u.id === editId ? { ...u, ...form } : u))
    } else {
      setUsuarios([...usuarios, { ...form, id: Date.now() }])
    }
    setForm(FORM_INIT)
    setEditId(null)
    setShowForm(false)
  }

  const editar = (u) => {
    setForm({ nombre: u.nombre, email: u.email, rol: u.rol, activo: u.activo })
    setEditId(u.id)
    setShowForm(true)
  }

  const cancelar = () => {
    setForm(FORM_INIT)
    setEditId(null)
    setShowForm(false)
  }

  const toggleActivo = (id) => {
    setUsuarios(usuarios.map(u => u.id === id ? { ...u, activo: !u.activo } : u))
  }

  return (
    <div className="container py-4">
      <div className="w-75 mx-auto">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">Usuarios</h4>
        {!showForm && (
          <button className="btn btn-dark" onClick={() => setShowForm(true)}>
            + Nuevo usuario
          </button>
        )}
      </div>

      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h6 className="card-title mb-3">{editId ? 'Editar usuario' : 'Nuevo usuario'}</h6>
            <form onSubmit={guardar}>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Nombre</label>
                  <input
                    className="form-control"
                    value={form.nombre}
                    onChange={e => setForm({ ...form, nombre: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Rol</label>
                  <select
                    className="form-select"
                    value={form.rol}
                    onChange={e => setForm({ ...form, rol: e.target.value })}
                  >
                    <option value="solicitante">Solicitante</option>
                    <option value="aprobador">Aprobador</option>
                    <option value="comprador">Comprador</option>
                    <option value="almacen">Almacén</option>
                  </select>
                </div>
              </div>
              <div className="mt-3 d-flex gap-2">
                <button type="submit" className="btn btn-dark">Guardar</button>
                <button type="button" className="btn btn-secondary" onClick={cancelar}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map(u => (
                <tr key={u.id}>
                  <td>{u.nombre}</td>
                  <td>{u.email}</td>
                  <td><span className="badge bg-secondary">{u.rol}</span></td>
                  <td>
                    <span className={`badge ${u.activo ? 'bg-success' : 'bg-danger'}`}>
                      {u.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="text-nowrap">
                    <button className="btn btn-sm btn-outline-secondary me-1" onClick={() => editar(u)}>Editar</button>
                    <button
                      className={`btn btn-sm ${u.activo ? 'btn-outline-danger' : 'btn-outline-success'}`}
                      onClick={() => toggleActivo(u.id)}
                    >
                      {u.activo ? 'Desactivar' : 'Activar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </div>
  )
}
