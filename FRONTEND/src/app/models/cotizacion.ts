import { Cliente } from "./cliente";  // Suponiendo que tienes el modelo Cliente
// import { DetalleCotizacion } from "./detalleCotizacion";  // Comentado por ahora

export class Cotizacion {
  _id?: string;
  cliente: Cliente;  // Referencia al cliente de la cotización
  contacto: string;
  telefono: string;
  fechaEmision: Date;
  fechaVenc: Date;
  moneda: string;
  tipoCambio: number;
  tiempoValidez: number;  // Tiempo de validez en días para la cotización
  total: number;
  igv: number;
  estado: string;
  // detalleC: DetalleCotizacion[];  // Comentado por ahora, se agregará más tarde

  constructor(
    cliente: Cliente,
    contacto: string,
    telefono: string,
    fechaEmision: Date,
    fechaVenc: Date,
    moneda: string,
    tipoCambio: number,
    tiempoValidez: number,
    total: number,
    igv: number,
    estado: string,
    // detalleC: DetalleCotizacion[] = []  // Comentado por ahora
  ) {
    this.cliente = cliente;
    this.contacto = contacto;
    this.telefono = telefono;
    this.fechaEmision = fechaEmision;
    this.fechaVenc = fechaVenc;
    this.moneda = moneda;
    this.tipoCambio = tipoCambio;
    this.tiempoValidez = tiempoValidez;
    this.igv = igv;
    this.total = total;
    this.estado = estado;
    // this.detalleC = detalleC;  // Comentado por ahora
  }
}
