import PublicNavbar from '../components/PublicNavbar';

export default function CompromisoPage() {
  const valores = [
    { titulo: "Calidad", desc: "Seleccionamos solo los mejores ingredientes para garantizar un sabor inigualable.", icono: "💎" },
    { titulo: "Tradición", desc: "Respetamos los procesos artesanales y las recetas que nos dieron origen.", icono: "📜" },
    { titulo: "Pasión", desc: "Amamos lo que hacemos; desde el primer encendido del fogón hasta el último taco.", icono: "🔥" },
    { titulo: "Hospitalidad", desc: "Nuestra casa es tu casa. El trato cálido es nuestra firma personal.", icono: "🤝" },
  ];

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen font-sans">
      <PublicNavbar />

      <div className="max-w-6xl mx-auto py-10 md:py-20">
        {/* ENCABEZADO */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
            Nuestro <span className="text-orange-600">Compromiso</span>
          </h2>
          <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] mt-4">La base de nuestra excelencia</p>
        </div>

        {/* GRID DE MISIÓN Y VISIÓN */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 hover:scale-[1.02] transition-transform">
            <div className="text-orange-600 text-3xl mb-4 font-black italic uppercase tracking-tighter">Misión</div>
            <p className="text-slate-600 font-medium leading-relaxed">
              Preservar y compartir la auténtica tradición de la barbacoa cocida a fuego lento, 
              brindando a nuestros clientes una experiencia gastronómica de alta calidad que 
              celebre el sabor casero y la unión familiar en cada bocado, bajo los más estrictos 
              estándares de higiene y servicio.
            </p>
          </div>

          <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 hover:scale-[1.02] transition-transform">
            <div className="text-orange-600 text-3xl mb-4 font-black italic uppercase tracking-tighter">Visión</div>
            <p className="text-slate-600 font-medium leading-relaxed">
              Consolidarnos como el restaurante de barbacoa de referencia en la región por nuestra 
              excelencia culinaria, integridad en nuestros procesos y el compromiso inquebrantable 
              con la satisfacción de nuestros comensales, logrando expandir nuestro legado 
              generacional a nuevas fronteras.
            </p>
          </div>
        </div>

        {/* OBJETIVO PRINCIPAL */}
        <div className="bg-slate-900 text-white p-10 md:p-16 rounded-[4rem] shadow-2xl mb-20 relative overflow-hidden">
          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-orange-500 mb-6">Nuestro Objetivo</h3>
            <p className="text-2xl md:text-3xl font-black italic leading-tight tracking-tighter">
              "Garantizar que cada cliente que cruce nuestra puerta reciba un producto 100% artesanal, 
              fresco y con el sazón único que define a la familia Villa, superando sus expectativas 
              de sabor y servicio en cada visita."
            </p>
          </div>
          {/* Decoración de fondo */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        </div>

        {/* VALORES */}
        <div className="text-center mb-10">
          <h3 className="text-2xl font-black uppercase italic tracking-tighter text-slate-900">Nuestros Valores</h3>
          <div className="w-16 h-1 bg-orange-500 mx-auto mt-2 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {valores.map((v, i) => (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-slate-100 text-center group hover:bg-orange-600 transition-all duration-300">
              <div className="text-4xl mb-4">{v.icono}</div>
              <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-2 group-hover:text-white">{v.titulo}</h4>
              <p className="text-[11px] font-bold text-slate-400 leading-relaxed group-hover:text-orange-100 uppercase">{v.desc}</p>
            </div>
          ))}
        </div>

      </div>

      <footer className="text-center text-slate-300 py-12 mt-10 border-t border-slate-200">
        <p className="text-[10px] font-black uppercase tracking-widest italic">Barbacoa Villa • Compromiso con la Excelencia</p>
      </footer>
    </div>
  );
}