"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function PublicNavbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Menú", href: "/public" },
    { name: "Nuestra Historia", href: "/historia" },
    { name: "Compromiso", href: "/compromiso" },
    { name: "Redes Sociales", href: "/redes" },
  ];

  return (
    <header className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10 border-b border-slate-200 pb-6 max-w-6xl mx-auto w-full">
      <div className="flex items-center gap-4">
        <img src="/uploads/logo2.png" alt="Logo" className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-2xl shadow-sm" />
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter leading-none uppercase">
            BARBACOA <span className="text-orange-600">VILLA</span>
          </h1>
          <p className="text-slate-500 text-[10px] md:text-sm font-medium uppercase tracking-widest mt-1 italic">Sabor que hace historia</p>
        </div>
      </div>
      
      <nav className="flex flex-wrap justify-center items-center gap-2 md:gap-4">
        {navLinks.map((link) => {
          const activo = pathname === link.href;
          return (
            <Link 
              key={link.href}
              href={link.href} 
              className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg transition-all ${
                activo ? 'text-orange-600 bg-orange-50 border-b-2 border-orange-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
              }`}
            >
              {link.name}
            </Link>
          );
        })}
        <div className="w-[1px] h-6 bg-slate-200 hidden md:block mx-2"></div>
        <Link href="/login" className="bg-slate-900 text-white px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-600 transition-colors shadow-md active:scale-95">
          Entrar
        </Link>
      </nav>
    </header>
  );
}