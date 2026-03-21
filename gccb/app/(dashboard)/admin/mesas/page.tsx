"use client";
import { useState, useEffect } from 'react';
import { obtenerMesas, obtenerConsumoMesa, cerrarMesa, cancelarMesa, cambiarEstadoMesa } from '../../../(lib)/actions';

export default function AdminDashboard() {
  const [mesas, setMesas] = useState<any[]>([]);
  const [mesaSeleccionada, setMesaSeleccionada] = useState<any | null>(null);
  const [detallesConsumo, setDetallesConsumo] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  
  const [vista, setVista] = useState<'resumen' | 'efectivo' | 'digital'>('resumen');
  const [pagoCon, setPagoCon] = useState<string>("");
  const [cambio, setCambio] = useState(0);

  // NUEVO: Estado para la mini ventana de confirmación
  const [metodoAConfirmar, setMetodoAConfirmar] = useState<'terminal' | 'transferencia' | null>(null);

  useEffect(() => {
    refrescarMesas();
  }, []);

  useEffect(() => {
    const pago = parseFloat(pagoCon) || 0;
    setCambio(pago > total ? pago - total : 0);
  }, [pagoCon, total]);

  async function refrescarMesas() {
    const data = await obtenerMesas();
    setMesas(data);
  }

  const abrirMesa = async (mesa: any) => {
    if (mesa.estado !== 'disponible') {
      const consumo = await obtenerConsumoMesa(mesa.id);
      setDetallesConsumo(consumo);
      const suma = consumo.reduce((acc: number, item: any) => acc + (item.precio * item.cantidad), 0);
      setTotal(suma);
    }
    setMesaSeleccionada(mesa);
    setVista('resumen');
  };

  const finalizarPagoDigital = async () => {
    if (metodoAConfirmar) {
      await cerrarMesa(mesaSeleccionada.id, metodoAConfirmar);
      cerrarModal();
      refrescarMesas();
    }
  };

  const cerrarModal = () => {
    setMesaSeleccionada(null);
    setDetallesConsumo([]);
    setVista('resumen');
    setPagoCon("");
    setTotal(0);
    setMetodoAConfirmar(null);
  };

  return (
    <div className="p-10 bg-slate-50 min-h-screen">
      <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900 mb-10">Control de Mesas</h1>

      {/* GRID DE MESAS */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {mesas.map((mesa) => (
          <button
            key={mesa.id}
            onClick={() => abrirMesa(mesa)}
            className={`p-8 rounded-[2.5rem] shadow-xl transition-all active:scale-95 flex flex-col items-center gap-2 border-4 ${
              mesa.estado === 'ocupada' ? 'bg-red-500 border-red-600 text-white' : 
              mesa.estado === 'proceso_pago' ? 'bg-orange-500 border-orange-600 text-white' : 
              'bg-green-500 border-green-600 text-white'
            }`}
          >
            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Mesa</span>
            <span className="text-4xl font-black">{mesa.numero}</span>
            <span className="text-[9px] font-bold uppercase">{mesa.estado === 'disponible' ? 'Libre' : mesa.estado}</span>
          </button>
        ))}
      </div>

      {/* MODAL MULTI-VISTA */}
      {mesaSeleccionada && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
            
            {/* MINI VENTANA DE CONFIRMACIÓN (Sobrepuesta al modal) */}
            {metodoAConfirmar && (
              <div className="absolute inset-0 bg-white/90 backdrop-blur-md z-[110] flex items-center justify-center p-8 animate-in fade-in zoom-in duration-200">
                <div className="text-center max-w-xs">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${metodoAConfirmar === 'terminal' ? 'bg-blue-100 text-blue-600' : 'bg-indigo-100 text-indigo-600'}`}>
                     <span className="text-2xl">{metodoAConfirmar === 'terminal' ? '📟' : '📲'}</span>
                  </div>
                  <h3 className="text-xl font-black uppercase italic mb-2">¿Confirmar Pago?</h3>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-8">
                    ¿Estás seguro que recibiste el pago por <span className="text-slate-900">{metodoAConfirmar}</span>?
                  </p>
                  <div className="flex flex-col gap-2">
                    <button onClick={finalizarPagoDigital} className="w-full bg-slate-900 text-white p-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-orange-600 transition">
                      Sí, Finalizar Pago
                    </button>
                    <button onClick={() => setMetodoAConfirmar(null)} className="w-full text-slate-400 p-2 font-black uppercase text-[10px] hover:text-red-500">
                      No, Regresar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* CONTENIDO SEGÚN VISTA */}
            {vista === 'resumen' && (
              <>
                <div className="flex justify-between items-start mb-8">
                   <h2 className="text-3xl font-black uppercase italic tracking-tighter">Mesa {mesaSeleccionada.numero}</h2>
                   <button onClick={cerrarModal} className="text-slate-300 hover:text-red-500 text-2xl">✕</button>
                </div>
                {/* ... resto del código del resumen igual al anterior ... */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="bg-slate-50 rounded-[2rem] p-6 border border-slate-100 h-64 overflow-y-auto">
                    <ul className="flex flex-col gap-3">
                      {detallesConsumo.map((item, idx) => (
                        <li key={idx} className="flex justify-between text-sm font-bold border-b border-slate-200 pb-2">
                          <span>{item.cantidad}x {item.platillo}</span>
                          <span className="text-orange-600">${(item.precio * item.cantidad).toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total</p>
                      <p className="text-5xl font-black text-slate-900 italic tracking-tighter">${total.toFixed(2)}</p>
                    </div>
                    <div className="flex flex-col gap-3 mt-8">
                      <button onClick={async () => { await cambiarEstadoMesa(mesaSeleccionada.id, 'proceso_pago'); refrescarMesas(); cerrarModal(); }} className="bg-slate-900 text-white p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest">
                        {mesaSeleccionada.estado === 'proceso_pago' ? '📋 Reimprimir Ticket' : '🖨️ Imprimir Ticket'}
                      </button>
                      <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => setVista('digital')} className="bg-blue-600 text-white p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest">💳 Digital</button>
                        <button onClick={() => setVista('efectivo')} className="bg-green-600 text-white p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest">💵 Efectivo</button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {vista === 'efectivo' && (
              /* ... Vista de efectivo igual al anterior ... */
              <div className="flex flex-col items-center">
                <h2 className="text-4xl font-black uppercase italic mb-10">Cobro Efectivo</h2>
                <div className="w-full max-w-sm space-y-6">
                  <input type="number" value={pagoCon} onChange={(e) => setPagoCon(e.target.value)} placeholder="0.00" className="w-full bg-slate-100 rounded-3xl p-6 text-3xl font-black text-center outline-none" />
                  <div className="bg-orange-500 text-white p-8 rounded-[2.5rem] text-center shadow-xl">
                    <p className="text-[10px] font-black uppercase opacity-80">Cambio</p>
                    <p className="text-5xl font-black italic">${cambio.toFixed(2)}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => setVista('resumen')} className="bg-slate-100 p-5 rounded-2xl text-[10px] font-black uppercase">Atrás</button>
                    <button onClick={async () => { await cerrarMesa(mesaSeleccionada.id, 'efectivo'); cerrarModal(); refrescarMesas(); }} disabled={parseFloat(pagoCon) < total} className="bg-slate-900 text-white p-5 rounded-2xl text-[10px] font-black uppercase disabled:opacity-50">Pagar</button>
                  </div>
                </div>
              </div>
            )}

            {vista === 'digital' && (
              <div className="flex flex-col items-center text-center">
                <h2 className="text-4xl font-black uppercase italic mb-2">Pago Digital</h2>
                <p className="text-orange-500 font-black text-[10px] uppercase tracking-widest mb-12">Selecciona método</p>
                <div className="grid grid-cols-1 gap-4 w-full max-w-sm">
                  <button onClick={() => setMetodoAConfirmar('terminal')} className="bg-blue-600 text-white p-8 rounded-[2rem] shadow-xl hover:scale-[1.02] transition-all">
                    <p className="text-3xl mb-1">📟</p>
                    <p className="font-black uppercase text-xl italic">Terminal</p>
                  </button>
                  <button onClick={() => setMetodoAConfirmar('transferencia')} className="bg-indigo-600 text-white p-8 rounded-[2rem] shadow-xl hover:scale-[1.02] transition-all">
                    <p className="text-3xl mb-1">📲</p>
                    <p className="font-black uppercase text-xl italic">Transferencia</p>
                  </button>
                  <button onClick={() => setVista('resumen')} className="text-slate-400 font-black uppercase text-[10px] mt-6">Volver</button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}