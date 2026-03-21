"use client";
import { useState, useEffect } from 'react';
import { obtenerResumenHoy, agregarGasto, realizarCorteDiario,eliminarGasto } from '@/app/(lib)/actions';

export default function CorteCajaPage() {
  const [resumen, setResumen] = useState<any>(null);
  const [nuevaDesc, setNuevaDesc] = useState("");
  const [nuevoMonto, setNuevoMonto] = useState("");

  useEffect(() => { cargarDatos(); }, []);

  const cargarDatos = async () => {
    const data = await obtenerResumenHoy();
    setResumen(data);
  };

  if (!resumen) return <div className="p-10 font-black italic">Cargando cuentas...</div>;

  const totalCaja = resumen.efectivo - resumen.totalGastos;

  return (
    <div className="p-10 bg-slate-50 min-h-screen">
      <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-10">Corte de Caja</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* COLUMNA 1: RESUMEN DE VENTAS */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Ventas del Día</h2>
          <div className="space-y-6">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">Efectivo Bruto</p>
              <p className="text-3xl font-black text-green-600">${resumen.efectivo.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">Pagos Digitales</p>
              <p className="text-3xl font-black text-blue-600">${resumen.digital.toFixed(2)}</p>
            </div>
            <hr />
            <div className="bg-slate-900 p-6 rounded-3xl text-white">
              <p className="text-[10px] font-black uppercase opacity-60">Efectivo Real en Caja</p>
              <p className="text-4xl font-black italic text-orange-500">${totalCaja.toFixed(2)}</p>
              <p className="text-[8px] mt-2 opacity-50">* (Efectivo - Gastos)</p>
            </div>
          </div>
        </div>

        {/* COLUMNA 2: GASTOS DIARIOS */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 lg:col-span-2">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Gastos del Día</h2>
          
          <div className="flex gap-4 mb-8">
            <input 
              placeholder="Descripción (ej. Tienda, Gas)" 
              className="flex-1 bg-slate-100 p-4 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-orange-500"
              value={nuevaDesc} onChange={(e) => setNuevaDesc(e.target.value)}
            />
            <input 
              type="number" placeholder="$0.00" 
              className="w-32 bg-slate-100 p-4 rounded-2xl text-xs font-bold outline-none"
              value={nuevoMonto} onChange={(e) => setNuevoMonto(e.target.value)}
            />
            <button 
              onClick={async () => {
                await agregarGasto(nuevaDesc, parseFloat(nuevoMonto));
                setNuevaDesc(""); setNuevoMonto(""); cargarDatos();
              }}
              className="bg-orange-500 text-white px-6 rounded-2xl font-black text-[10px] uppercase"
            >Agregar</button>
          </div>

          <div className="space-y-2 h-48 overflow-y-auto">
            {resumen.gastos.map((g: any) => (
              <div key={g.id} className="flex justify-between p-4 bg-slate-50 rounded-xl border-l-4 border-red-500">
                <span className="text-xs font-bold uppercase">{g.descripcion}</span>
                <span className="text-xs font-black text-red-600">-${g.monto.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* SECCIÓN DE HISTORIAL SEMANAL (Boceto) */}
      <div className="mt-12">
        <h2 className="text-2xl font-black italic uppercase mb-6">Historial Semanal</h2>
        <div className="bg-white rounded-[2.5rem] p-8 shadow-md">
           <p className="text-slate-400 text-xs italic font-bold">Aquí se agruparán los cortes por semana al finalizar cada día...</p>
        </div>
      </div>
    </div>
  );
}