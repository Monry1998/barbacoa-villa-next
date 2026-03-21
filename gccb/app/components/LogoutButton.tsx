"use client";

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom'; // 👈 Importamos el Portal
import { cerrarSesion } from "@/app/(lib)/actions";

export default function BotonLogout() {
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 💡 Importante: En Next.js necesitamos confirmar que el componente 
  // ya se cargó en el navegador antes de usar "document.body"
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* BOTÓN PRINCIPAL DEL SIDEBAR (Se queda igual) */}
      <button
        onClick={() => setMostrarConfirmacion(true)}
        className="w-full bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest transition-all border border-red-600/20 shadow-lg active:scale-95"
      >
        Cerrar Sesión
      </button>

      {/* 🧙‍♂️ EL PORTAL: Teletransporta el modal al final del BODY */}
      {mounted && mostrarConfirmacion && createPortal(
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xs rounded-[2.5rem] p-8 shadow-2xl text-center border border-slate-100 transform animate-in zoom-in duration-300">
            {/* ICONO O CABECERA */}
            <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
            </div>

            <h3 className="text-xl font-black text-slate-900 italic tracking-tighter mb-2 uppercase">
              ¿Ya te vas?
            </h3>
            <p className="text-slate-500 text-xs font-bold leading-relaxed mb-8 px-4">
              Estás a punto de cerrar tu sesión administrativa.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={async () => {
                  setMostrarConfirmacion(false);
                  await cerrarSesion();
                }}
                className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest hover:bg-orange-600 transition-colors shadow-lg"
              >
                Sí, cerrar sesión
              </button>
              
              <button
                onClick={() => setMostrarConfirmacion(false)}
                className="w-full bg-slate-100 text-slate-400 font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-colors"
              >
                No, volver
              </button>
            </div>
          </div>
        </div>,
        document.body // 👈 Aquí es donde se "pega" el modal
      )}
    </>
  );
}