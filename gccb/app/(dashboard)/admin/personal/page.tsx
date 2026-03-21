"use client";
import { useState, useEffect } from 'react';
import { obtenerMeseros, eliminarMesero, registrarMesero } from '../../../(lib)/actions';

export default function PersonalPage() {
  const [meseros, setMeseros] = useState<any[]>([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState<{ texto: string; tipo: 'exito' | 'error' } | null>(null);

  useEffect(() => {
    async function cargar() {
      const data = await obtenerMeseros();
      setMeseros(data);
    }
    cargar();
  }, []);

  const manejarAlta = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCargando(true);
    setMensaje(null);
    const formData = new FormData(e.currentTarget);

    try {
      const res = await registrarMesero(formData); 
      
      if (res.success) {
        const dataActualizada = await obtenerMeseros();
        setMeseros(dataActualizada);
        setMensaje({ texto: res.mensaje || "¡Registro exitoso! Correo enviado.", tipo: 'exito' });
        (e.target as HTMLFormElement).reset();
        // Cerramos el modal tras un pequeño delay para que vean el éxito
        setTimeout(() => setModalAbierto(false), 2000);
      } else {
        setMensaje({ texto: res.error || "Error al registrar", tipo: 'error' });
      }
    } catch (error) {
      setMensaje({ texto: "Error de conexión con el servidor", tipo: 'error' });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="p-10 animate-in fade-in duration-500 relative z-0">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900">Equipo Villa</h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Control de acceso y perfiles</p>
        </div>
        <button 
          onClick={() => { setModalAbierto(true); setMensaje(null); }} 
          className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase hover:bg-orange-600 transition-all shadow-lg active:scale-95"
        >
          + Alta de Mesero
        </button>
      </header>

      {/* GRID DE PERSONAL (CUADRITOS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {meseros.map(m => (
          <div 
            key={m.id} 
            className="bg-white rounded-[3rem] p-8 shadow-xl border border-slate-100 flex flex-col items-center text-center transition-all hover:shadow-2xl hover:-translate-y-1 relative group"
          >
            {/* FOTO DE PERFIL */}
            <div className="w-24 h-24 bg-slate-100 rounded-[2.5rem] overflow-hidden mb-4 shadow-inner border-4 border-white relative">
              {m.fotoUrl ? (
                <img src={m.fotoUrl} className="w-full h-full object-cover" alt={m.nombre} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl bg-orange-100 text-orange-600 font-black italic uppercase">
                  {m.nombre.charAt(0)}
                </div>
              )}
              
              {/* INDICADOR DE ESTATUS */}
              <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${m.verificado ? 'bg-green-500' : 'bg-orange-500'}`}></div>
            </div>

            <div className="flex-1">
              <h3 className="text-sm font-black text-slate-900 uppercase leading-tight line-clamp-1">{m.nombre}</h3>
              <p className="text-[10px] text-slate-400 font-medium lowercase italic mb-3">{m.correo}</p>
              
              <span className={`px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-tighter ${m.verificado ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-orange-50 text-orange-600 border border-orange-100'}`}>
                {m.verificado ? 'Cuenta Activa' : 'Pendiente Verificación'}
              </span>
            </div>

            <button 
              onClick={async () => { if(confirm("¿Seguro que deseas eliminar a este empleado?")) { await eliminarMesero(m.id); setMeseros(meseros.filter(mes => mes.id !== m.id)); }}} 
              className="mt-6 text-red-300 hover:text-red-600 text-[10px] font-black uppercase transition tracking-widest opacity-0 group-hover:opacity-100"
            >
              Eliminar Empleado
            </button>
          </div>
        ))}
      </div>

      {/* MODAL: FORMULARIO CON FOTO */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4 text-slate-900">
          <div className="bg-white p-10 rounded-[3.5rem] w-full max-w-md shadow-2xl border border-white animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-8 border-b pb-4">
              <h2 className="text-2xl font-black uppercase italic tracking-tighter">📝 Nuevo Registro</h2>
              <button onClick={() => setModalAbierto(false)} className="text-slate-300 hover:text-red-500 transition">✕</button>
            </div>

            <form onSubmit={manejarAlta} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Nombre Completo *</label>
                <input name="nombre" required placeholder="Ej. Juan Pérez" className="p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-orange-500 text-slate-900 font-bold" />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Correo Electrónico *</label>
                <input name="correo" type="email" required placeholder="usuario@gmail.com" className="p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-orange-500 text-slate-900 font-bold" />
              </div>

              {/* NUEVO CAMPO DE FOTO */}
              <div className="flex flex-col gap-2 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fotografía de Perfil</label>
                <input type="file" name="imagenArchivo" accept="image/*" className="w-full text-[10px] font-black text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-slate-900 file:text-white hover:file:bg-orange-600 transition-all cursor-pointer" />
                <input name="fotoUrl" placeholder="O pega link de imagen" className="p-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-orange-500 text-slate-900 font-bold text-[10px]" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">RFC</label>
                  <input name="rfc" placeholder="Opcional" className="p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-orange-500 text-slate-900 font-bold uppercase" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Teléfono</label>
                  <input name="telefono" type="tel" placeholder="Opcional" className="p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-orange-500 text-slate-900 font-bold" />
                </div>
              </div>

              {mensaje && (
                <div className={`p-4 rounded-2xl text-[10px] font-black uppercase text-center animate-shake ${mensaje.tipo === 'exito' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                  {mensaje.texto}
                </div>
              )}

              <button 
                type="submit" 
                disabled={cargando} 
                className="mt-2 bg-slate-900 text-white p-5 rounded-2xl font-black shadow-xl uppercase tracking-widest active:scale-95 disabled:bg-slate-300 transition-all"
              >
                {cargando ? '🚀 PROCESANDO...' : 'REGISTRAR Y ENVIAR MAIL'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}