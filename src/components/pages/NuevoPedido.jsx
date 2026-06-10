import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { api } from '../../services/api'

const URGENCIAS = ['Baja', 'Media', 'Alta', 'Crítica']
const GRUPOS    = ['Pulverizadora', 'Chancho', 'Nodriza', 'Desmalezadora', 'Hervicida', 'Abonadora', 'Riego', 'Arquito', 'Tractores', 'Camioneta', 'Manitou', 'Colectivos', 'Herreria', 'Gomeria', 'Stock', 'Otros']

const ITEM_INIT = { nombre_repuesto: '', cant: '', descripcion: '', urgencia: 'Media', grupo: 'Tractores', cc: '', estado: 'Pedido' }

export default function NuevoPedido() {
  const navigate = useNavigate()
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10))
  const [itemForm, setItemForm] = useState(ITEM_INIT)
  const [items, setItems] = useState([])
  const [editingId, setEditingId] = useState(null)

  const agregarFila = (e) => {
    e.preventDefault()
    if (editingId) {
      setItems(items.map(i => i._tmpId === editingId ? { ...itemForm, _tmpId: editingId } : i))
      setEditingId(null)
    } else {
      setItems([...items, { ...itemForm, _tmpId: Date.now() }])
    }
    setItemForm(ITEM_INIT)
  }

  const editarFila = (item) => {
    const { _tmpId, ...rest } = item
    setItemForm(rest)
    setEditingId(_tmpId)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const cancelarEdicion = () => { setItemForm(ITEM_INIT); setEditingId(null) }

  const quitarFila = (tmpId) => {
    setItems(items.filter(i => i._tmpId !== tmpId))
    if (editingId === tmpId) cancelarEdicion()
  }

  const guardar = async () => {
    if (items.length === 0) {
      Swal.fire({ icon: 'warning', title: 'Sin ítems', text: 'Agregá al menos un ítem antes de guardar.' })
      return
    }
    try {
      const itemsLimpios = items.map(({ _tmpId, cant, ...rest }) => ({
        ...rest,
        ...(cant !== '' && cant != null ? { cant: Number(cant) } : {}),
      }))
      await api.post('/berdina/pedidos', { fecha, items: itemsLimpios })
      Swal.fire({ icon: 'success', title: 'Pedido guardado', timer: 1500, showConfirmButton: false })
      navigate('/berdina/pedidos')
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.message })
    }
  }

  const badgeUrgencia = (u) => {
    const map = { Baja: 'secondary', Media: 'warning', Alta: 'danger', Crítica: 'dark' }
    return <span className={`badge bg-${map[u] || 'secondary'}`}>{u}</span>
  }

  return (
    <div className="container-fluid flex-grow-1 d-flex flex-column pt-1">

      <div className="container d-flex justify-content-between align-items-center mb-1">
        <p className="mb-0" style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: 2 }}>
          Compras · Berdina · Pedidos
        </p>
        <button onClick={() => navigate(-1)} className="btn btn-outline-dark btn-sm">← Volver</button>
      </div>

      <div className="container">
        <h4 className="text-center mb-2" style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2 }}>Nuevo Pedido</h4>

        {/* Formulario ítem */}
        <div className="card mb-3 mx-auto" style={{ maxWidth: 680 }}>
          <div className="card-header fw-semibold d-flex justify-content-between align-items-center" style={{ backgroundColor: editingId ? '#6a4a8a' : '#4a6b8a', color: '#fff' }}>
            <span>{editingId ? 'Editando ítem' : 'Agregar ítem'}</span>
            <div className="d-flex align-items-center gap-2">
              <label className="mb-0" style={{ fontSize: 13 }}>Fecha</label>
              <input type="date" className="form-control form-control-sm" style={{ width: 150 }}
                value={fecha} onChange={e => setFecha(e.target.value)} />
            </div>
          </div>
          <div className="card-body">
            <form onSubmit={agregarFila}>
              {/* Fila 1: Nombre · Cant. · C.C. · Urgencia */}
              <div className="row mb-2 g-2">
                <div className="col-5">
                  <label className="form-label form-label-sm w-100 text-center">Nombre repuesto*</label>
                  <input className="form-control form-control-sm" value={itemForm.nombre_repuesto}
                    onChange={e => setItemForm({ ...itemForm, nombre_repuesto: e.target.value })} required />
                </div>
                <div className="col-2">
                  <label className="form-label form-label-sm w-100 text-center">Cant.</label>
                  <input type="number" min="1" className="form-control form-control-sm" value={itemForm.cant}
                    onChange={e => setItemForm({ ...itemForm, cant: e.target.value })}
                    onKeyDown={e => ['e','E','+','-','.'].includes(e.key) && e.preventDefault()} />
                </div>
                <div className="col-2">
                  <label className="form-label form-label-sm w-100 text-center">C.C.*</label>
                  <input className="form-control form-control-sm" value={itemForm.cc}
                    onChange={e => setItemForm({ ...itemForm, cc: e.target.value })} required />
                </div>
                <div className="col-3">
                  <label className="form-label form-label-sm w-100 text-center">Urgencia*</label>
                  <select className="form-select form-select-sm" value={itemForm.urgencia}
                    onChange={e => setItemForm({ ...itemForm, urgencia: e.target.value })}>
                    {URGENCIAS.map(u => <option key={u}>{u}</option>)}
                  </select>
                </div>
              </div>

              {/* Fila 2: Descripción · Grupo */}
              <div className="row mb-3 g-2">
                <div className="col-8">
                  <label className="form-label form-label-sm w-100 text-center">Descripción</label>
                  <textarea className="form-control form-control-sm" rows={2} value={itemForm.descripcion}
                    onChange={e => setItemForm({ ...itemForm, descripcion: e.target.value })} />
                </div>
                <div className="col-4">
                  <label className="form-label form-label-sm w-100 text-center">Grupo*</label>
                  <select className="form-select form-select-sm" value={itemForm.grupo}
                    onChange={e => setItemForm({ ...itemForm, grupo: e.target.value })}>
                    {GRUPOS.map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
              </div>

              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-outline-dark btn-sm">
                  {editingId ? '✓ Actualizar' : '+ Agregar fila'}
                </button>
                {editingId && (
                  <button type="button" className="btn btn-outline-secondary btn-sm" onClick={cancelarEdicion}>
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Tabla de ítems cargados */}
        {items.length > 0 && (
          <div className="card mb-3">
            <div className="table-responsive">
              <table className="table table-hover table-striped mb-0">
                <thead>
                  <tr>
                    <th>Repuesto</th>
                    <th>Cant.</th>
                    <th>Descripción</th>
                    <th>Urgencia</th>
                    <th>Grupo</th>
                    <th>C.C.</th>
                    <th>Estado</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => (
                    <tr key={item._tmpId} style={editingId === item._tmpId ? { backgroundColor: 'rgba(106,74,138,0.08)' } : {}}>
                      <td>{item.nombre_repuesto}</td>
                      <td>{item.cant}</td>
                      <td>{item.descripcion}</td>
                      <td>{badgeUrgencia(item.urgencia)}</td>
                      <td>{item.grupo}</td>
                      <td>{item.cc}</td>
                      <td><span className="badge bg-primary">Pedido</span></td>
                      <td className="text-nowrap">
                        <button className="btn btn-sm btn-outline-secondary me-1" onClick={() => editarFila(item)}>Editar</button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => quitarFila(item._tmpId)}>✕</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Acciones */}
        <div className="d-flex justify-content-end gap-2 mb-4">
          <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>Cancelar</button>
          <button className="btn btn-outline-dark" onClick={guardar} disabled={items.length === 0}>
            Guardar pedido{items.length > 0 ? ` (${items.length} ítem${items.length !== 1 ? 's' : ''})` : ''}
          </button>
        </div>
      </div>
    </div>
  )
}
