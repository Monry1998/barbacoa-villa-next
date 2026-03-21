// app/public/PlatilloCard.tsx
"use client";
import { useState, useEffect } from 'react';

export default function PlatilloCard({ p, forzarAbierto }: { p: any, forzarAbierto: boolean }) {
  const [abierto, setAbierto] = useState(false);

  // Sincronizar con el botón global de "Ver todas las fotos"
  useEffect(() => {
    setAbierto(forzarAbierto);
  }, [forzarAbierto]);

  return (
    <div className="bg-white p-3 md:p-5 rounded-2xl md:rounded-3xl shadow-sm border border-slate-100 flex flex-col transition-all hover:shadow-md w-full">
      
      {/* INFO DEL PLATILLO */}
      <div className="mb-2 md:mb-3 text-left">
        <h3 className="font-black text-slate-900 uppercase text-[10px] md:text-xs leading-tight line-clamp-2">
          {p.nombre}
        </h3>
        <p className="text-orange-600 font-black text-xs md:text-sm mt-1">${p.precio}</p>
      </div>
      
      {/* DESCRIPCIÓN */}
      <p className="text-slate-400 text-[8px] md:text-[10px] leading-tight mb-3 flex-grow line-clamp-3 text-left">
        {p.descripcion || "Pregunta a tu mesero por los detalles."}
      </p>

      {/* BOTÓN Y FOTO ANIMADA */}
      {p.imagenUrl && (
        <div className="mt-auto">
          <button 
            onClick={() => setAbierto(!abierto)}
            className="w-full text-[8px] md:text-[9px] font-black uppercase text-slate-400 hover:text-orange-600 transition-colors bg-slate-50 py-1.5 md:py-2 rounded-lg md:rounded-xl text-center flex items-center justify-center gap-1 active:scale-95"
          >
            📸 <span>{abierto ? 'Ocultar' : 'Ver Foto'}</span>
            <span className={`text-[7px] transition-transform duration-500 ${abierto ? 'rotate-180 text-orange-600' : ''}`}>
              ▼
            </span>
          </button>

          <div className={`grid transition-all duration-500 ease-in-out ${abierto ? 'grid-rows-[1fr] opacity-100 mt-3' : 'grid-rows-[0fr] opacity-0'}`}>
            <div className="overflow-hidden min-h-0">
              <div className="h-28 md:h-40 bg-slate-100 rounded-xl md:rounded-2xl relative w-full border border-slate-50">
                <img 
                  src={p.imagenUrl} 
                  className="w-full h-full object-cover rounded-xl md:rounded-2xl" 
                  alt={p.nombre} 
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}