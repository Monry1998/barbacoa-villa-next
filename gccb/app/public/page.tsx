"use client"; 
import { useState, useEffect } from 'react';
import { obtenerMenu } from '../(lib)/actions'; 
import PublicNavbar from '../components/PublicNavbar'; // 👈 Importamos el nuevo Navbar
import PlatilloCard from './PlatilloCard';

export default function MenuPublico() {
  const [platillos, setPlatillos] = useState<any[]>([]);
  const [galeriaActiva, setGaleriaActiva] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function fetchMenu() {
      const data = await obtenerMenu();
      setPlatillos(data.filter((p: any) => p.disponible));
      setCargando(false);
    }
    fetchMenu();
  }, []);

  const categorias = [
    "Tacos y Lonches", 
    "Birrias y Quesabirrias", 
    "Especiales", 
    "Bebidas", 
    "Postres"
  ];

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen font-sans">
      
      {/* NAVEGACIÓN GLOBAL */}
      <PublicNavbar />

      {/* CONTROLES ESPECÍFICOS DEL MENÚ */}
      <div className="max-w-6xl mx-auto flex justify-end mb-8">
        <button 
          onClick={() => setGaleriaActiva(!galeriaActiva)}
          className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-md active:scale-95 border ${
            galeriaActiva 
            ? 'bg-orange-600 text-white border-orange-700' 
            : 'bg-white text-slate-900 border-slate-200 hover:bg-slate-50'
          }`}
        >
          {galeriaActiva ? '🎬 Ver Lista Normal' : '🖼️ Ver todas las fotos'}
        </button>
      </div>

      {/* CUERPO DEL MENÚ */}
      <div className="max-w-6xl mx-auto">
        {cargando ? (
          <div className="text-center py-20">
            <p className="text-slate-400 font-black uppercase tracking-widest text-sm animate-pulse italic">
              Preparando el fogón...
            </p>
          </div>
        ) : (
          categorias.map((cat) => {
            const platillosCategoria = platillos.filter(p => p.categoria === cat);
            if (platillosCategoria.length === 0) return null;

            return (
              <section key={cat} className="mb-14 text-center">
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest mb-10 inline-block border-b-4 border-orange-500 pb-2 italic leading-none">
                  {cat}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 px-2 md:px-0 items-start">
                  {platillosCategoria.map((p) => (
                    <PlatilloCard key={p.id} p={p} forzarAbierto={galeriaActiva} /> 
                  ))}
                </div>
              </section>
            );
          })
        )}
      </div>
      
      <footer className="text-center text-slate-300 py-12 mt-10 border-t border-slate-200">
        <p className="text-[10px] font-black uppercase tracking-widest">
          © 2026 Barbacoa Villa Restaurant • Torreón, Coah.
        </p>
      </footer>
    </div>
  );
}