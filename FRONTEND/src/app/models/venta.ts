import { Cliente } from "./cliente";
import { DetalleVenta } from "./detalleV";
import { Lugar } from "./lugar"; 

export class Venta {
  _id?: string;
  serie: string;
  nroComprobante: string;
  fechaEmision: Date;
  fechaVenc: Date;
  tipoComprobante: string;
  total: number;
  estado: string;
  moneda: string;
  tipoCambio: number;

  cliente: Cliente; // ID del cliente
  metodoPago: string;
  detalles: DetalleVenta[];
  lugarId?: Lugar; // Referencia al lugar de entrega

  constructor(
    serie: string,
    nroComprobante: string,
    fechaEmision: Date,
    fechaVenc: Date,
    tipoComprobante: string,
    total: number,
    estado: string,
    moneda: string,
    tipoCambio: number,
    cliente: Cliente,
    metodoPago: string,
    detalles: DetalleVenta[] = [],
    lugarId?: Lugar
  ) {
    this.serie = serie;
    this.nroComprobante = nroComprobante;
    this.fechaEmision = fechaEmision;
    this.fechaVenc = fechaVenc;
    this.tipoComprobante = tipoComprobante;
    this.total = total;
    this.estado = estado;
    this.moneda = moneda;
    this.tipoCambio = tipoCambio;
    this.cliente = cliente;
    this.metodoPago = metodoPago;
    this.detalles = detalles;
    this.lugarId = lugarId;
  }
}
