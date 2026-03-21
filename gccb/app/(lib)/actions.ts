"use server";
import { enviarCorreoVerificacion, enviarCorreoReset } from './mailer';
import { prisma } from './db';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';import { cookies } from 'next/headers';
import { writeFile } from 'fs/promises';
import path from 'path';
import { existsSync, mkdirSync } from 'fs';
import { redirect } from 'next/navigation';


// --- UTILIDAD DE VALIDACIÓN DE SEGURIDAD ---
const validarPassword = (pass: string) => {
  const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(pass);
};

/**
 * 1. REGISTRO (ADMIN)
 */
export async function registrarMesero(formData: FormData) {
  try {
    const nombre = formData.get('nombre') as string;
    const correo = formData.get('correo') as string;
    const rfc = formData.get('rfc') as string;
    const telefono = formData.get('telefono') as string;

    const usuarioExistente = await prisma.usuario.findUnique({ where: { correo } });
    if (usuarioExistente) return { error: "Este correo ya está registrado." };

    const tokenVerificacion = crypto.randomUUID();

    await prisma.usuario.create({
      data: {
        nombre,
        correo,
        rfc: rfc || null,
        telefono: telefono || null,
        rol: 'mesero',
        tokenVerificacion
      }
    });

    const linkVerificacion = `http://localhost:3000/verificar/${tokenVerificacion}`;
    await enviarCorreoVerificacion(correo, nombre, linkVerificacion);

    revalidatePath('/admin/personal'); 
    return { success: true, mensaje: "Mesero registrado y correo enviado." };
  } catch (error) {
    return { error: "Error interno al intentar registrar." };
  }
}

/**
 * 2. VALIDACIÓN DE TOKENS (¡AQUÍ ESTÁ LA QUE FALTABA!)
 * Sirve para verificar links de correo de activación o de password.
 */
export async function validarToken(token: string, tipo: 'verificacion' | 'password' = 'verificacion') {
  try {
    const query = tipo === 'verificacion' 
      ? { tokenVerificacion: token } 
      : { tokenPassword: token };

    const usuario = await prisma.usuario.findUnique({
      where: query as any
    });
    return !!usuario;
  } catch (error) {
    return false;
  }
}

/**
 * 3. COMPLETAR REGISTRO
 */
export async function completarRegistro(token: string, contrasena: string) {
  try {
    if (!validarPassword(contrasena)) {
      return { error: "La contraseña no cumple los requisitos (8+ chars, Mayúscula, Número)." };
    }

    const usuario = await prisma.usuario.findUnique({ where: { tokenVerificacion: token } });
    if (!usuario) return { error: "El enlace es inválido o ya fue utilizado." };

    const contrasenaHasheada = await bcrypt.hash(contrasena, 10);

    await prisma.usuario.update({
      where: { id: usuario.id },
      data: {
        contrasena: contrasenaHasheada,
        verificado: true,
        tokenVerificacion: null
      }
    });

    return { success: true };
  } catch (error) {
    return { error: "Error al activar tu cuenta." };
  }
}
export async function cambiarEstadoMesa(id: number, nuevoEstado: string) {
  await prisma.mesa.update({
    where: { id },
    data: { estado: nuevoEstado }
  });
}

/**
 * 4. LOGIN CON CONTROL DE SESIÓN ÚNICA
 */// app/(lib)/actions.ts
export async function iniciarSesion(formData: FormData) {
  const correo = formData.get('correo') as string;
  const contrasena = formData.get('contrasena') as string;

  const usuario = await prisma.usuario.findUnique({ where: { correo } });
  if (!usuario || !usuario.contrasena) return { error: "Usuario no encontrado" };

  const passOk = await bcrypt.compare(contrasena, usuario.contrasena);
  if (!passOk) return { error: "Contraseña incorrecta" };

  const nuevoToken = crypto.randomUUID();

  await prisma.usuario.update({
    where: { id: usuario.id },
    data: { sessionToken: nuevoToken }
  });

  const cookieStore = await cookies();
  cookieStore.set('session_token', nuevoToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 8, 
    path: '/',
  });
  cookieStore.set('user_role', usuario.rol, { path: '/' });

  // Redirección obligatoria para que el layout de admin detecte el nuevo token
  if (usuario.rol === 'admin') {
    redirect('/admin/mesas');
  }
  
  return { success: true };
}

/**
 * 5. CERRAR SESIÓN
 */export async function cerrarSesion() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;

  if (token) {
    // 1. Borramos el token de la DB
    await prisma.usuario.updateMany({
      where: { sessionToken: token },
      data: { sessionToken: null }
    });
  }

  // 2. Borramos las cookies
  cookieStore.delete('session_token');
  cookieStore.delete('user_role');

  // 3. LIMPIAMOS LA CACHÉ DEL NAVEGADOR (Paso clave)
  revalidatePath('/'); 
  
  // 4. Redirigimos
  redirect('/login');
}
/**
 * 6. RECUPERACIÓN DE CONTRASEÑA
 */
export async function solicitarRecuperacion(formData: FormData) {
  const correo = formData.get('correo') as string;

  try {
    const usuario = await prisma.usuario.findUnique({ where: { correo } });
    if (!usuario) return { error: "Si el correo existe, recibirás un enlace." };

    const tokenPassword = crypto.randomUUID();

    await prisma.usuario.update({
      where: { correo },
      data: { tokenPassword }
    });

    const link = `http://localhost:3000/restablecer/${tokenPassword}`;
    await enviarCorreoReset(correo, usuario.nombre, link);

    return { success: true, mensaje: "Revisa tu bandeja de entrada." };
  } catch (error) {
    return { error: "Error al procesar la solicitud." };
  }
}

export async function restablecerPassword(token: string, nuevaPassword: string) {
  try {
    if (!validarPassword(nuevaPassword)) return { error: "Contraseña muy débil." };

    const usuario = await prisma.usuario.findUnique({ where: { tokenPassword: token } });
    if (!usuario) return { error: "El enlace ya no es válido." };

    const hash = await bcrypt.hash(nuevaPassword, 10);

    await prisma.usuario.update({
      where: { id: usuario.id },
      data: {
        contrasena: hash,
        tokenPassword: null
      }
    });

    return { success: true };
  } catch (error) {
    return { error: "Error técnico al cambiar la contraseña." };
  }
}

/**
 * 7. GESTIÓN DE PERSONAL Y MENÚ
 */
export async function obtenerMeseros() {
  const meseros = await prisma.usuario.findMany({
    where: { rol: 'mesero' },
    orderBy: { fechaCreacion: 'desc' }
  });
  return meseros.map(m => ({ ...m, fechaCreacion: m.fechaCreacion.toISOString() }));
}

export async function eliminarMesero(id: number) {
  await prisma.usuario.delete({ where: { id } });
  revalidatePath('/admin/personal');
}

export async function obtenerMenu() {
  const platillos = await prisma.platillo.findMany({ orderBy: { categoria: 'asc' } });
  return platillos.map(p => ({ ...p, precio: Number(p.precio), fechaCreacion: p.fechaCreacion.toISOString() }));
}

export async function agregarPlatillo(formData: FormData) {
  const nombre = formData.get('nombre') as string;
  const precio = parseFloat(formData.get('precio') as string);
  const categoria = formData.get('categoria') as string;
  const descripcion = formData.get('descripcion') as string;
  let imagenUrl = formData.get('imagenUrl') as string;
  const imagenArchivo = formData.get('imagenArchivo') as File | null;

  if (imagenArchivo && imagenArchivo.size > 0) {
    const bytes = await imagenArchivo.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    if (!existsSync(uploadDir)) mkdirSync(uploadDir, { recursive: true });
    const nombreArchivo = `${Date.now()}-${imagenArchivo.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    await writeFile(path.join(uploadDir, nombreArchivo), buffer);
    imagenUrl = `/uploads/${nombreArchivo}`;
  }

  const nuevo = await prisma.platillo.create({ data: { nombre, precio, categoria, descripcion, imagenUrl } });
  revalidatePath('/admin/menu');
  revalidatePath('/public');
  return { success: true };
}

export async function eliminarPlatillo(id: number) {
  await prisma.platillo.delete({ where: { id } });
  revalidatePath('/admin/menu');
  revalidatePath('/public');
  return { success: true };
}

export async function toggleDisponibilidad(id: number, estadoActual: boolean) {
  await prisma.platillo.update({ where: { id }, data: { disponible: !estadoActual } });
  revalidatePath('/admin/menu');
  revalidatePath('/public');
  return { success: true };
}

export async function editarPlatillo(id: number, formData: FormData) {
  const nombre = formData.get('nombre') as string;
  const precio = parseFloat(formData.get('precio') as string);
  const categoria = formData.get('categoria') as string;
  const descripcion = formData.get('descripcion') as string;
  const imagenUrl = formData.get('imagenUrl') as string;

  await prisma.platillo.update({
    where: { id },
    data: { nombre, precio, categoria, descripcion, imagenUrl }
  });

  revalidatePath('/admin/menu');
  revalidatePath('/public');
  return { success: true };
}


export async function obtenerMesas() {
  return await prisma.mesa.findMany({
    orderBy: { numero: 'asc' }
  });
}

// 2. OBTENER EL CONSUMO ACTUAL DE UNA MESA (Solo pedidos pendientes)
export async function obtenerConsumoMesa(mesaId: number) {
  return await prisma.pedido.findMany({
    where: {
      mesaId: mesaId,
      estado: 'pendiente' // Solo lo que no se ha pagado aún
    }
  });
}

// 3. CERRAR MESA (Cobro y liberación)
export async function cerrarMesa(
  mesaId: number, 
  metodoPago: 'efectivo' | 'terminal' | 'transferencia' // 👈 Agregamos los nuevos aquí
) {
  try {
    await prisma.$transaction([
      // A. Marcamos pedidos como PAGADOS con el método específico
      prisma.pedido.updateMany({
        where: { mesaId: mesaId, estado: 'pendiente' },
        data: { 
          estado: 'pagado', 
          metodoPago: metodoPago // Guardará "terminal" o "transferencia" en la DB
        }
      }),
      // B. Liberamos la mesa y la ponemos en verde (disponible)
      prisma.mesa.update({
        where: { id: mesaId },
        data: { estado: 'disponible' }
      })
    ]);

    revalidatePath('/admin/mesas');
    return { success: true };
  } catch (error) {
    console.error("Error al cerrar mesa:", error);
    return { error: "No se pudo procesar el pago" };
  }
}
// 4. CANCELAR MESA (Limpieza por error o cancelación)
export async function cancelarMesa(mesaId: number) {
  try {
    await prisma.$transaction([
      // Eliminamos (o cancelamos) los pedidos pendientes
      prisma.pedido.deleteMany({
        where: { mesaId: mesaId, estado: 'pendiente' }
      }),
      // Liberamos la mesa
      prisma.mesa.update({
        where: { id: mesaId },
        data: { estado: 'disponible' }
      })
    ]);

    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error("Error al cancelar mesa:", error);
    return { error: "No se pudo cancelar la mesa" };
  }
}

export async function obtenerResumenHoy() {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const ventas = await prisma.pedido.findMany({
    where: { estado: 'pagado', createdAt: { gte: hoy } }
  });

  const gastos = await prisma.gasto.findMany({
    where: { createdAt: { gte: hoy } }
  });

  const efectivo = ventas.filter(v => v.metodoPago === 'efectivo').reduce((acc, v) => acc + (v.precio * v.cantidad), 0);
  const digital = ventas.filter(v => ['terminal', 'transferencia', 'digital'].includes(v.metodoPago || '')).reduce((acc, v) => acc + (v.precio * v.cantidad), 0);
  const totalGastos = gastos.reduce((acc, g) => acc + g.monto, 0);

  return { efectivo, digital, totalGastos, gastos };
}

export async function agregarGasto(descripcion: string, monto: number) {
  await prisma.gasto.create({ data: { descripcion, monto } });
  revalidatePath('/admin/corte');
}

export async function realizarCorteDiario(datos: any) {
  await prisma.corte.create({ data: datos });
  // Opcional: Podrías marcar los pedidos de hoy como "archivados"
  revalidatePath('/admin/corte');
}


export async function eliminarGasto(id: number) {
  try {
    await prisma.gasto.delete({
      where: { id }
    });
    // Forzamos a Next.js a que refresque los datos del corte
    revalidatePath('/admin/corte');
    return { success: true };
  } catch (error) {
    console.error("Error al eliminar gasto:", error);
    return { error: "No se pudo eliminar el gasto" };
  }
}


