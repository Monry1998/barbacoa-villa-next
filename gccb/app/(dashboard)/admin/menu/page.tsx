"use client";
import { useState, useEffect } from 'react';
import { obtenerMenu, agregarPlatillo, eliminarPlatillo, toggleDisponibilidad, editarPlatillo } from '../../../(lib)/actions';

export default function MenuAdminPage() {
  const [menu, setMenu] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [platilloEditando, setPlatilloEditando] = useState<any | null>(null);
  const [cargando, setCargando] = useState(false);

  useEffect(() => { cargarMenu(); }, []);

  async function cargarMenu() {
    const data = await obtenerMenu();
    setMenu(data);
  }

  const menuFiltrado = menu.filter(p => 
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
    p.categoria.toLowerCase().includes(busqueda.toLowerCase())
  );

  const manejarGuardar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCargando(true);
    const formData = new FormData(e.currentTarget);
    try {
      if (platilloEditando) {
        await editarPlatillo(platilloEditando.id, formData);
      } else {
        await agregarPlatillo(formData);
      }
      await cargarMenu();
      cerrarModal();
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Hubo un error al guardar el platillo.");
    } finally {
      setCargando(false);
    }
  };

  const manejarEliminar = async (id: number) => {
    if (confirm("¿Estás seguro de eliminar este platillo permanentemente?")) {
      await eliminarPlatillo(id);
      await cargarMenu();
    }
  };

  const manejarDisponibilidad = async (id: number, estadoActual: boolean) => {
    await toggleDisponibilidad(id, estadoActual);
    await cargarMenu();
  };

  const abrirModalEditar = (platillo: any) => {
    setPlatilloEditando(platillo);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setPlatilloEditando(null);
    setModalAbierto(false);
  };

  return (
    /* 🛠️ AJUSTE: Añadimos relative y z-0 para que el contenido principal sea la capa base */
    <div className="p-10 animate-in fade-in duration-500 relative z-0">
      
      {/* HEADER: BUSCADOR + BOTÓN REGISTRAR */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-12">
        <div className="relative w-full md:w-96">
          <span className="absolute inset-y-0 left-4 flex items-center text-slate-400">🔍</span>
          <input 
            type="text" 
            placeholder="Buscar por nombre o categoría..." 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-50 transition-all font-bold text-slate-700 shadow-sm"
          />
        </div>

        <button 
          onClick={() => setModalAbierto(true)} 
          className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase hover:bg-orange-600 transition-all shadow-lg active:scale-95 whitespace-nowrap"
        >
          + Registrar Platillo
        </button>
      </div>

      {/* GRID DE PLATILLOS (LOS CUADRITOS) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {menuFiltrado.map((p) => (
          <div 
            key={p.id} 
            /* 🛠️ AJUSTE: Añadimos relative y z-0 a cada tarjeta */
            className={`bg-white rounded-[2.5rem] p-5 shadow-xl border border-slate-100 flex flex-col transition-all hover:shadow-2xl hover:-translate-y-1 relative z-0 ${!p.disponible ? 'opacity-60 grayscale' : ''}`}
          >
            {/* IMAGEN DEL CUADRITO */}
            <div className="w-full aspect-square bg-slate-100 rounded-[1.8rem] overflow-hidden mb-4 shadow-inner relative">
              {p.imagenUrl ? (
                <img src={p.imagenUrl} className="w-full h-full object-cover" alt={p.nombre} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-300 font-black italic uppercase">Sin Foto</div>
              )}
              
              <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-xl shadow-sm">
                <p className="text-orange-600 font-black text-xs">${p.precio}</p>
              </div>
            </div>

            {/* INFO DEL PLATILLO */}
            <div className="flex-1 px-1">
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">{p.categoria}</p>
              <h3 className="text-xs font-black text-slate-900 uppercase leading-tight line-clamp-2">{p.nombre}</h3>
            </div>

            {/* ACCIONES DEL CUADRITO */}
            <div className="mt-4 pt-4 border-t border-slate-50 flex flex-col gap-2">
              <button 
                onClick={() => manejarDisponibilidad(p.id, p.disponible)}
                className={`w-full py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${p.disponible ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
              >
                {p.disponible ? 'Activo' : 'Agotado'}
              </button>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => abrirModalEditar(p)}
                  className="flex-1 bg-slate-900 text-white py-2 rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-blue-600 transition-colors"
                >
                  Editar
                </button>
                <button 
                  onClick={() => manejarEliminar(p.id)}
                  className="px-3 bg-slate-100 text-slate-400 py-2 rounded-xl text-[8px] font-black uppercase hover:bg-red-500 hover:text-white transition-colors"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: FORMULARIO */}
      {/* 🛠️ NOTA: Aquí el z-[100] está bien porque queremos que este modal específico sí tape al menú */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4 text-slate-900">
          <div className="bg-white p-10 rounded-[3.5rem] w-full max-w-md shadow-2xl border border-white animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-8 border-b pb-4">
              <h2 className="text-2xl font-black uppercase italic tracking-tighter">
                {platilloEditando ? '✏️ Editar Platillo' : '📝 Nuevo Platillo'}
              </h2>
              <button onClick={cerrarModal} className="text-slate-300 hover:text-red-500 transition">✕</button>
            </div>

            <form onSubmit={manejarGuardar} encType="multipart/form-data" className="flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Nombre del Platillo *</label>
                <input name="nombre" defaultValue={platilloEditando?.nombre || ''} required className="p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-orange-500 text-slate-900 font-bold" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Precio ($) *</label>
                  <input name="precio" type="number" step="0.01" defaultValue={platilloEditando?.precio || ''} required className="p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-orange-500 text-slate-900 font-bold" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Categoría *</label>
                  <select name="categoria" defaultValue={platilloEditando?.categoria || 'Tacos y Lonches'} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-orange-500 text-slate-900 font-bold cursor-pointer">
                    <option>Tacos y Lonches</option>
                    <option>Birrias y Quesabirrias</option>
                    <option>Especiales</option>
                    <option>Bebidas</option>
                    <option>Postres</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Descripción</label>
                <textarea name="descripcion" defaultValue={platilloEditando?.descripcion || ''} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl h-24 text-slate-900 font-bold outline-none resize-none" />
              </div>

              <div className="flex flex-col gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fotografía</label>
                <input type="file" name="imagenArchivo" accept="image/*" className="w-full text-[10px] font-black text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-slate-900 file:text-white hover:file:bg-orange-600 transition-all cursor-pointer" />
                <input name="imagenUrl" defaultValue={platilloEditando?.imagenUrl || ''} placeholder="O pega un link aquí" className="p-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-orange-500 text-slate-900 font-bold text-[10px]" />
              </div>

              <button type="submit" disabled={cargando} className="mt-2 bg-slate-900 text-white p-5 rounded-2xl font-black shadow-xl uppercase tracking-widest active:scale-95 disabled:bg-slate-300 transition-all">
                {cargando ? '⏳ Guardando...' : platilloEditando ? '💾 Guardar Cambios' : '🚀 Registrar Platillo'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}