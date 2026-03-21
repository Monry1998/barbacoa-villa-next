import PublicNavbar from '../components/PublicNavbar';

export default function RedesPage() {
  const redes = [
    { 
      name: "WhatsApp", 
      user: "871 123 4567", 
      desc: "Pedidos a domicilio y eventos", 
      color: "bg-green-600", 
      icon: "💬",
      link: "https://wa.me/528711234567" 
    },
    { 
      name: "Facebook", 
      user: "Barbacoa Villa Oficial", 
      desc: "Promociones y dinámicas semanales", 
      color: "bg-blue-600", 
      icon: "👤",
      link: "#" 
    },
    { 
      name: "Instagram", 
      user: "@barbacoavilla", 
      desc: "Nuestras mejores fotos de cada día", 
      color: "bg-gradient-to-tr from-yellow-500 via-red-500 to-purple-600", 
      icon: "📸",
      link: "#" 
    },
    { 
      name: "TikTok", 
      user: "@barbacoavilla_trc", 
      desc: "El detrás de cámaras del fogón", 
      color: "bg-black", 
      icon: "🎬",
      link: "#" 
    },
  ];

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen font-sans">
      <PublicNavbar />

      <div className="max-w-4xl mx-auto py-10 md:py-20">
        {/* ENCABEZADO */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
            Conecta con <br />
            <span className="text-orange-600">Nosotros</span>
          </h2>
          <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] mt-4">Estamos a un clic de distancia</p>
        </div>

        {/* GRID DE REDES SOCIALES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {redes.map((red, i) => (
            <a 
              key={i} 
              href={red.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`${red.color} p-8 rounded-[3rem] shadow-xl hover:scale-[1.03] transition-all flex items-center justify-between group`}
            >
              <div className="text-white">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">{red.name}</p>
                <h3 className="text-xl font-black italic tracking-tighter mb-2">{red.user}</h3>
                <p className="text-[9px] font-bold uppercase tracking-widest opacity-80">{red.desc}</p>
              </div>
              <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                {red.icon}
              </div>
            </a>
          ))}
        </div>

        {/* SECCIÓN DE UBICACIÓN (GOOGLE MAPS) */}
        <div className="bg-white p-10 md:p-12 rounded-[4rem] shadow-2xl border border-slate-100 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500 mb-4">¿Cómo llegar?</h3>
              <h4 className="text-3xl font-black italic text-slate-900 tracking-tighter mb-4 uppercase">Visítanos en Torreón</h4>
              <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed">
                Calzada Colón #1234, Centro Histórico. <br />
                Torreón, Coahuila, México.
              </p>
              <a 
                href="https://maps.google.com" 
                target="_blank"
                className="inline-block bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg"
              >
                📍 Abrir en Google Maps
              </a>
            </div>
            
            {/* MINI MAPA ESTILIZADO (Boceto visual) */}
            <div className="w-full md:w-64 h-64 bg-slate-200 rounded-[3rem] relative overflow-hidden border-4 border-white shadow-inner">
               <div className="absolute inset-0 bg-slate-300 animate-pulse">
                  {/* Aquí podrías meter un Iframe de Google Maps real */}
                  <div className="w-full h-full flex items-center justify-center text-slate-400 font-black italic uppercase text-[10px]">Cargando Mapa...</div>
               </div>
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl">📍</div>
            </div>
          </div>
        </div>

        {/* HORARIOS */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-orange-100 px-6 py-2 rounded-full mb-4 text-orange-600 font-black text-[10px] uppercase tracking-widest">
            🕒 Horarios de Atención
          </div>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">
            Martes a Domingo: 8:00 AM - 3:00 PM
          </p>
          <p className="text-slate-400 text-[10px] font-medium uppercase mt-2 italic">
            * Lunes cerrado por descanso familiar *
          </p>
        </div>

      </div>

      <footer className="text-center text-slate-300 py-12 mt-10 border-t border-slate-200">
        <p className="text-[10px] font-black uppercase tracking-widest italic">Barbacoa Villa • Torreón, Coahuila • 2026</p>
      </footer>
    </div>
  );
}