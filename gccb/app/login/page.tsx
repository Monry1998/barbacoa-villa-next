"use client";
import { useState } from "react";
import { iniciarSesion, solicitarRecuperacion, cerrarSesion } from "../(lib)/actions";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [correoRecuperar, setCorreoRecuperar] = useState("");
  const [mensajeRecuperar, setMensajeRecuperar] = useState({ tipo: "", texto: "" });
  
  const router = useRouter();

  // VALIDACIÓN VISUAL
  const requisitos = {
    largo: password.length >= 8,
    mayuscula: /[A-Z]/.test(password),
    numero: /\d/.test(password),
  };

  const manejarLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    const formData = new FormData(e.currentTarget);
    const res = await iniciarSesion(formData);

    // CASTING DE TIPO PARA EVITAR EL ERROR DE VERCEL
    const respuesta = res as any;

    if (respuesta.error) {
      setError(respuesta.error);
      setCargando(false);
    } else {
      // FILTRO DE ACCESO WEB USANDO LA RESPUESTA YA VALIDADA
      if (respuesta.rol === 'admin') {
        router.push('/admin');
      } else if (respuesta.rol === 'mesero') {
        // SI ES MESERO, LE CERRAMOS LA SESIÓN WEB DE INMEDIATO
        setError("⚠️ Acceso exclusivo para App Móvil. No puedes iniciar sesión desde la web.");
        setCargando(false);
        
        // Opcional: Llamamos a una acción para limpiar cookies
        await cerrarSesion(); 
      }
    }
  };

  const manejarRecuperacion = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensajeRecuperar({ tipo: "info", texto: "Procesando..." });
    const formData = new FormData();
    formData.append("correo", correoRecuperar);
    const res = await solicitarRecuperacion(formData);
    
    const respuestaRec = res as any;

    if (respuestaRec.error) {
      setMensajeRecuperar({ tipo: "error", texto: respuestaRec.error });
    } else {
      setMensajeRecuperar({ tipo: "success", texto: "¡Enviado! Revisa tu correo." });
      setTimeout(() => {
        setMostrarModal(false);
        setMensajeRecuperar({ tipo: "", texto: "" });
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative font-sans">
      
      <div className="absolute top-8 left-8">
        <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-orange-600 font-black text-xs uppercase tracking-widest transition-all group">
          <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span> Regresar al Menú
        </Link>
      </div>

      <div className="bg-white p-10 rounded-[3rem] w-full max-w-md shadow-2xl border border-slate-100 z-10">
        <div className="text-center mb-10">
          <div className="inline-block bg-orange-50 px-4 py-1 rounded-full mb-2">
             <p className="text-orange-600 font-black uppercase text-[10px] tracking-[0.3em]">Acceso Seguro GCCB</p>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter">GCCB</h1>
        </div>

        <form onSubmit={manejarLogin} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Correo Electrónico</label>
            <input name="correo" type="email" required placeholder="usuario@gccb.com" className="p-4 bg-slate-100 border border-slate-200 rounded-2xl outline-none focus:border-orange-500 font-bold" />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center px-2 mb-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contraseña</label>
              <button type="button" onClick={() => setMostrarModal(true)} className="text-[10px] font-bold text-orange-600 hover:text-orange-700 uppercase transition">¿Olvidaste tu clave?</button>
            </div>
            <input 
              name="contrasena" 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={`p-4 bg-slate-100 border rounded-2xl outline-none transition font-bold ${password.length > 0 && (requisitos.largo && requisitos.mayuscula && requisitos.numero ? 'border-green-500' : 'border-orange-300')}`}
            />
            {password.length > 0 && (
              <div className="flex gap-3 ml-2 mt-2">
                <span className={`text-[8px] font-black uppercase ${requisitos.largo ? 'text-green-500' : 'text-slate-300'}`}>● 8+ Chars</span>
                <span className={`text-[8px] font-black uppercase ${requisitos.mayuscula ? 'text-green-500' : 'text-slate-300'}`}>● Mayúscula</span>
                <span className={`text-[8px] font-black uppercase ${requisitos.numero ? 'text-green-500' : 'text-slate-300'}`}>● Número</span>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 p-4 rounded-2xl animate-shake">
              <p className="text-red-600 text-[10px] font-black text-center uppercase tracking-tighter">{error}</p>
            </div>
          )}

          <button type="submit" disabled={cargando} className="mt-2 bg-slate-900 text-white p-5 rounded-2xl font-black hover:bg-orange-600 transition-all shadow-xl active:scale-95 disabled:bg-slate-200 disabled:text-slate-400">
            {cargando ? "AUTENTICANDO..." : "INGRESAR AL SISTEMA"}
          </button>
        </form>
      </div>

      {mostrarModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-[3rem] p-10 shadow-2xl border-t-[8px] border-orange-500 text-slate-900">
            <h3 className="text-2xl font-black tracking-tighter mb-8">Recuperar Clave</h3>
            <form onSubmit={manejarRecuperacion} className="flex flex-col gap-5">
              <input type="email" placeholder="Correo" required value={correoRecuperar} onChange={(e) => setCorreoRecuperar(e.target.value)} className="p-4 bg-slate-100 border rounded-2xl font-bold" />
              {mensajeRecuperar.texto && <p className="text-[10px] font-black text-center uppercase text-orange-600">{mensajeRecuperar.texto}</p>}
              <button type="submit" className="bg-orange-500 text-white p-5 rounded-2xl font-black">ENVIAR LINK</button>
              <button type="button" onClick={() => setMostrarModal(false)} className="text-[10px] font-black text-slate-400 uppercase">Cerrar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}