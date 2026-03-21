// app/(dashboard)/layout.tsx
import { cookies } from 'next/headers';
import Link from 'next/link';
import BotonLogout from '../components/LogoutButton'; // 👈 Asegúrate de que la ruta sea correcta

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const rol = cookieStore.get('user_role')?.value;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="w-64 bg-slate-900 text-white p-6 flex flex-col justify-between sticky top-0 h-screen shadow-2xl">
        <nav className="flex flex-col gap-8">
          <div className="py-4">
            <h2 className="text-3xl font-black italic tracking-tighter text-orange-500">GCCB</h2>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">
              {rol === 'admin' ? 'Administración' : 'Panel de Control'}
            </p>
          </div>
          
          <div className="flex flex-col gap-2">
            {rol === 'admin' && (
              <>
                <Link href="/admin/mesas" className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest hover:text-orange-500 transition-all p-4 rounded-2xl hover:bg-white/5">
                  🪑 Mesas
                </Link>
                <Link href="/admin/menu" className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest hover:text-orange-500 transition-all p-4 rounded-2xl hover:bg-white/5">
                  🍴 Menú
                </Link>
                <Link href="/admin/personal" className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest hover:text-orange-500 transition-all p-4 rounded-2xl hover:bg-white/5">
                  👥 Personal
                </Link>
                <Link href="/admin/corte" className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest hover:text-orange-500 transition-all p-4 rounded-2xl hover:bg-white/5">
  📊 Corte de Caja
</Link>
              </>
            )}
          </div>
        </nav>

        {/* 🛡️ Botón con confirmación */}
        <div className="mt-auto">
          <BotonLogout />
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}