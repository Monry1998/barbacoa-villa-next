import PublicNavbar from '../components/PublicNavbar';

export default function HistoriaPage() {
  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen font-sans">
      <PublicNavbar />

      <div className="max-w-3xl mx-auto py-10 md:py-20 px-4">
        {/* EFECTO CARTA */}
        <div className="bg-white rounded-[3rem] shadow-2xl p-8 md:p-16 relative border border-slate-100 overflow-hidden">
          
          {/* DECORACIÓN: SELLO DE AGUA / LOGO EN LA ESQUINA */}
          <div className="absolute top-10 right-10 opacity-5 -rotate-12 pointer-events-none">
            <img src="/uploads/logo2.png" alt="Sello" className="w-32 h-32" />
          </div>

          {/* ENCABEZADO DE LA CARTA */}
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-slate-900 mb-2">
              Desde el Corazón <br />
              <span className="text-orange-600">del Fogón</span>
            </h2>
            <div className="w-20 h-2 bg-orange-500 rounded-full"></div>
          </div>

          {/* CUERPO DE LA CARTA */}
          <div className="space-y-6 text-slate-700 leading-relaxed text-sm md:text-base font-medium">
            <p>
              Todo comenzó con el aroma de la leña de mezquite en las madrugadas de Torreón. 
              No buscábamos abrir un restaurante; buscábamos preservar un ritual que mi abuelo 
              repetía cada domingo: el arte de la paciencia y el fuego lento.
            </p>
            
            <p>
              La receta de nuestra barbacoa no está escrita en papel, sino grabada en la memoria 
              de nuestras manos. Aprendimos que el secreto no es solo la carne de primera, 
              sino el respeto por el tiempo. Doce horas de cocción, el calor justo y ese toque 
              de especias que solo la familia Villa conoce.
            </p>

            <blockquote className="border-l-4 border-orange-500 pl-6 my-10 italic text-xl font-black text-slate-900 tracking-tight">
              "En Barbacoa Villa no servimos comida, servimos domingos en familia, sin importar qué día de la semana sea."
            </blockquote>

            <p>
              Lo que empezó como un pequeño puesto en la esquina, hoy es este espacio que te recibe 
              con los brazos abiertos. Cada taco, cada quesabirria y cada sorbo de consomé lleva 
              consigo el esfuerzo de tres generaciones dedicadas a perfeccionar el sabor que hoy 
              tienes frente a ti.
            </p>

            <p>
              Gracias por ser parte de nuestra historia. Toma asiento, olvida el reloj y disfruta 
              de lo mejor de nuestra casa.
            </p>
          </div>

          {/* FIRMA FINAL */}
          <div className="mt-16 pt-10 border-t border-slate-100 flex flex-col items-center md:items-start">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4">Con amor y tradición,</p>
            <h3 className="text-3xl font-black italic text-slate-900 tracking-tighter">
              Familia <span className="text-orange-600">Villa</span>
            </h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase mt-2 italic">Fundado en el corazón de Coahuila</p>
          </div>

        </div>

        {/* PIE DE PÁGINA EXTRA */}
        <div className="text-center mt-12">
          <p className="text-slate-300 text-[10px] font-black uppercase tracking-widest italic">
            Barbacoa Villa • Tradición que se saborea
          </p>
        </div>
      </div>
    </div>
  );
}