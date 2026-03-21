// app/(lib)/data.ts
export type EstadoMesa = 'disponible' | 'ocupada';

export interface Mesa {
  id: number;
  nombre: string;
  capacidad: number;
  estado: EstadoMesa;
  ticketImpreso: boolean; // <-- Nuevo control para el ticket
}

export const mesasGCCB: Mesa[] = [
  { id: 1, nombre: "Mesa 01", capacidad: 4, estado: 'disponible', ticketImpreso: false },
  { id: 2, nombre: "Mesa 02", capacidad: 4, estado: 'disponible', ticketImpreso: false },
  { id: 3, nombre: "Mesa 03", capacidad: 2, estado: 'disponible', ticketImpreso: false },
  { id: 4, nombre: "Mesa 04", capacidad: 2, estado: 'disponible', ticketImpreso: false },
  { id: 5, nombre: "Mesa 05", capacidad: 6, estado: 'disponible', ticketImpreso: false },
  { id: 6, nombre: "Mesa 06", capacidad: 4, estado: 'disponible', ticketImpreso: false },
  { id: 7, nombre: "Mesa 07", capacidad: 4, estado: 'disponible', ticketImpreso: false },
  { id: 8, nombre: "Mesa 08", capacidad: 2, estado: 'disponible', ticketImpreso: false },
  { id: 9, nombre: "Mesa 09", capacidad: 8, estado: 'disponible', ticketImpreso: false },
  { id: 10, nombre: "Mesa 10", capacidad: 4, estado: 'disponible', ticketImpreso: false },
  { id: 11, nombre: "Mesa 11", capacidad: 4, estado: 'disponible', ticketImpreso: false },
];