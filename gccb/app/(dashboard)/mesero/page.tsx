"use client";
import { mesasGCCB } from '../../(lib)/data';
import { useState } from 'react';

export default function MeseroPage() {
  const [mesas, setMesas] = useState(mesasGCCB);

  const toggleMesa = (id: number) => {
    setMesas(mesas.map(m => {
      if (m.id === id) {
        return { ...m, estado: m.estado === 'disponible' ? 'ocupada' : 'disponible' };
      }
      return m;
    }));
  };

  return (
    <div className="p-6">
      <header className="mb-8">
        <h1 className="text-2xl font-black text-slate-800 uppercase italic tracking-tighter text-center md:text-left">Gestión de Piso</h1>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {mesas.map((mesa) => (
          <button 
            key={mesa.id} 
            onClick={() => toggleMesa(mesa.id)}
            className={`p-10 rounded-[2.5rem] border-8 transition-all duration-150 active:scale-90 shadow-xl flex flex-col items-center justify-center ${
              mesa.estado === 'disponible' 
              ? 'border-green-500 bg-white' 
              : 'border-red-500 bg-red-50 shadow-red-100'
            }`}
          >
            <span className={`text-5xl font-black mb-1 ${mesa.estado === 'disponible' ? 'text-green-600' : 'text-red-600'}`}>
              {mesa.id}
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">
              {mesa.estado === 'disponible' ? 'LIBRE' : 'OCUPADA'}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}