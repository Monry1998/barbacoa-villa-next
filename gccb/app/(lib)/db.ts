// app/(lib)/db.ts
import { PrismaClient } from '@prisma/client';

// Prevenimos múltiples instancias de Prisma Client en desarrollo
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // log: ['query'], // Descomenta esta línea si quieres ver en la terminal las consultas SQL que hace Prisma
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;