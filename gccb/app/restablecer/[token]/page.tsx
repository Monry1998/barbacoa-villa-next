"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { restablecerPassword, validarToken } from "../../(lib)/actions";

export default function RestablecerPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [tokenValido, setTokenValido] = useState<boolean | null>(null);

  // 1. Validar si el token existe al cargar la página
  useEffect(() => {
    async function verificar() {
      const valido = await validarToken(token, 'password');
      setTokenValido(valido);
    }
    verificar();
  }, [token]);

  // 2. Lógica de Requisitos (Igual que en el Login)
  const requisitos = {
    largo: password.length >= 8,
    mayuscula: /[A-Z]/.test(password),
    numero: /\d/.test(password),
    coincide: password === confirmar && password !== "",
  };

  const todoOk = requisitos.largo && requisitos.mayuscula && requisitos.numero && requisitos.coincide;

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!todoOk) return; // Bloqueo extra por seguridad

    setCargando(true);
    setError("");

    const res = await restablecerPassword(token, password);

    if (res.error) {
      setError(res.error);
      setCargando(false);
    } else {
      alert("¡Contraseña actualizada con éxito!");
      router.push("/login");
    }
  };

  if (tokenValido === null) return <div className="p-20 text-center font-black uppercase text-slate-400 animate-pulse">Verificando enlace...</div>;
  if (tokenValido === false) return <div className="p-20 text-center font-black uppercase text-red-500">El enlace ha expirado o es inválido.</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-900">
      <div className="bg-white p-10 rounded-[3rem] w-full max-w-md shadow-2xl border border-slate-100">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black tracking-tighter uppercase italic">Nueva Clave</h1>
          <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mt-2">Seguridad de Cuenta</p>
        </div>

        <form onSubmit={manejarEnvio} className="flex flex-col gap-5">
          {/* CAMPO: NUEVA CONTRASEÑA */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Nueva Contraseña</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              className={`p-4 bg-slate-50 border rounded-2xl outline-none transition-all font-bold ${password.length > 0 ? (requisitos.largo && requisitos.mayuscula && requisitos.numero ? 'border-green-500' : 'border-orange-300') : 'border-slate-200'}`}
            />
          </div>

          {/* CAMPO: CONFIRMAR */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Confirmar Contraseña</label>
            <input 
              type="password" 
              required 
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
              placeholder="••••••••" 
              className={`p-4 bg-slate-50 border rounded-2xl outline-none transition-all font-bold ${confirmar.length > 0 ? (requisitos.coincide ? 'border-green-500' : 'border-red-300') : 'border-slate-200'}`}
            />
          </div>

          {/* CHECKLIST VISUAL DE REQUISITOS */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Requisitos obligatorios:</p>
            <div className="grid grid-cols-2 gap-2">
              <div className={`text-[9px] font-black uppercase flex items-center gap-1 ${requisitos.largo ? 'text-green-600' : 'text-slate-300'}`}>
                {requisitos.largo ? '✅' : '○'} 8+ Caracteres
              </div>
              <div className={`text-[9px] font-black uppercase flex items-center gap-1 ${requisitos.mayuscula ? 'text-green-600' : 'text-slate-300'}`}>
                {requisitos.mayuscula ? '✅' : '○'} 1 Mayúscula
              </div>
              <div className={`text-[9px] font-black uppercase flex items-center gap-1 ${requisitos.numero ? 'text-green-600' : 'text-slate-300'}`}>
                {requisitos.numero ? '✅' : '○'} 1 Número
              </div>
              <div className={`text-[9px] font-black uppercase flex items-center gap-1 ${requisitos.coincide ? 'text-green-600' : 'text-slate-300'}`}>
                {requisitos.coincide ? '✅' : '○'} Coinciden
              </div>
            </div>
          </div>

          {error && <p className="text-red-500 text-[10px] font-black uppercase text-center">{error}</p>}

          <button 
            type="submit" 
            disabled={!todoOk || cargando}
            className="mt-4 bg-slate-900 text-white p-5 rounded-2xl font-black uppercase tracking-widest shadow-xl transition-all active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
          >
            {cargando ? "GUARDANDO..." : "CAMBIAR CONTRASEÑA"}
          </button>
        </form>
      </div>
    </div>
  );
}