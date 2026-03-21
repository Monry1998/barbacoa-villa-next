"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { completarRegistro, validarToken } from "../../(lib)/actions";

export default function VerificarCuentaPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [tokenValido, setTokenValido] = useState<boolean | null>(null);

  // 1. Validamos que el link de invitación sea real
  useEffect(() => {
    async function verificarLink() {
      const valido = await validarToken(token, 'verificacion');
      setTokenValido(valido);
    }
    verificarLink();
  }, [token]);

  // 2. Requisitos de Seguridad (Exactamente los mismos que en Login y Reset)
  const requisitos = {
    largo: password.length >= 8,
    mayuscula: /[A-Z]/.test(password),
    numero: /\d/.test(password),
    coincide: password === confirmar && password !== "",
  };

  const todoOk = requisitos.largo && requisitos.mayuscula && requisitos.numero && requisitos.coincide;

  const manejarActivacion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!todoOk) return;

    setCargando(true);
    setError("");

    const res = await completarRegistro(token, password);

    if (res.error) {
      setError(res.error);
      setCargando(false);
    } else {
      alert("¡Cuenta activada con éxito! Ya puedes iniciar sesión.");
      router.push("/login");
    }
  };

  if (tokenValido === null) return <div className="p-20 text-center font-black uppercase text-slate-400 animate-pulse">Validando invitación...</div>;
  if (tokenValido === false) return <div className="p-20 text-center font-black uppercase text-red-500">Este enlace de activación ya no es válido o ya fue utilizado.</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-900">
      <div className="bg-white p-10 rounded-[3rem] w-full max-w-md shadow-2xl border border-slate-100">
        
        <div className="text-center mb-10">
          <div className="inline-block bg-green-50 px-4 py-1 rounded-full mb-2">
             <p className="text-green-600 font-black uppercase text-[10px] tracking-[0.3em]">Bienvenido al Equipo</p>
          </div>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic">Activa tu Cuenta</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Crea tu contraseña de acceso</p>
        </div>

        <form onSubmit={manejarActivacion} className="flex flex-col gap-5">
          
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Crea tu Contraseña</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              className={`p-4 bg-slate-50 border rounded-2xl outline-none transition-all font-bold ${password.length > 0 ? (requisitos.largo && requisitos.mayuscula && requisitos.numero ? 'border-green-500' : 'border-orange-300') : 'border-slate-200'}`}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Confirma tu Contraseña</label>
            <input 
              type="password" 
              required 
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
              placeholder="••••••••" 
              className={`p-4 bg-slate-50 border rounded-2xl outline-none transition-all font-bold ${confirmar.length > 0 ? (requisitos.coincide ? 'border-green-500' : 'border-red-300') : 'border-slate-200'}`}
            />
          </div>

          {/* CHECKLIST DE REQUISITOS */}
          <div className="bg-slate-50 p-5 rounded-[2rem] border border-slate-100">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Requisitos de seguridad:</p>
            <div className="grid grid-cols-2 gap-y-3">
              <div className={`text-[9px] font-black uppercase flex items-center gap-2 ${requisitos.largo ? 'text-green-600' : 'text-slate-300'}`}>
                <span className="text-sm">{requisitos.largo ? '✅' : '○'}</span> 8+ Caracteres
              </div>
              <div className={`text-[9px] font-black uppercase flex items-center gap-2 ${requisitos.mayuscula ? 'text-green-600' : 'text-slate-300'}`}>
                <span className="text-sm">{requisitos.mayuscula ? '✅' : '○'}</span> Mayúscula
              </div>
              <div className={`text-[9px] font-black uppercase flex items-center gap-2 ${requisitos.numero ? 'text-green-600' : 'text-slate-300'}`}>
                <span className="text-sm">{requisitos.numero ? '✅' : '○'}</span> Un Número
              </div>
              <div className={`text-[9px] font-black uppercase flex items-center gap-2 ${requisitos.coincide ? 'text-green-600' : 'text-slate-300'}`}>
                <span className="text-sm">{requisitos.coincide ? '✅' : '○'}</span> Coinciden
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 p-4 rounded-2xl">
              <p className="text-red-600 text-[10px] font-black text-center uppercase tracking-tighter">{error}</p>
            </div>
          )}

          <button 
            type="submit" 
            disabled={!todoOk || cargando}
            className="mt-4 bg-slate-900 text-white p-5 rounded-2xl font-black uppercase tracking-widest shadow-xl transition-all active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
          >
            {cargando ? "ACTIVANDO..." : "ACTIVAR MI CUENTA"}
          </button>
        </form>
      </div>
    </div>
  );
}