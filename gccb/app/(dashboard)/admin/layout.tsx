// app/(dashboard)/admin/layout.tsx
import { cookies } from 'next/headers';
import { prisma } from '@/app/(lib)/db';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get('session_token')?.value;

  // Si no hay token en el navegador, al login.
  if (!tokenCookie) redirect('/login');

  // Buscamos al usuario que tenga ESE token específico
  const usuarioActivo = await prisma.usuario.findUnique({
    where: { sessionToken: tokenCookie }
  });

  // Si el usuario no existe con ese token (porque alguien más entró o cerró sesión),
  // la base de datos devolverá null. ¡EXPULSIÓN!
  if (!usuarioActivo || usuarioActivo.rol !== 'admin') {
    redirect('/login');
  }
  
  return (
    <div className="flex min-h-screen">
      {/* Tu Sidebar único aquí */}
      <main className="flex-1">{children}</main>
    </div>
  );
}