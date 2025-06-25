import { Proveedor } from "./proveedor";
import { DetalleCompra } from "./detalleC";

export class Compra {
  _id?: string;
  serie: string;
  nroComprobante?: string;
  fechaEmision: Date;
  fechaVenc: Date;
  tipoComprobante: string;
  igv: number;
  total: number;
  estado: string;
  moneda: string;
  tipoCambio: number;
  proveedor: Proveedor; // ID del proveedor
  metodoPago: string;
  detalleC: DetalleCompra[];

  constructor(
    serie: string,
    nroComprobante: string,
    fechaEmision: Date,
    fechaVenc: Date,
    tipoComprobante: string,
    igv: number,
    total: number,
    estado: string,
    moneda: string,
    tipoCambio: number,
    proveedor: Proveedor,
    metodoPago: string,
    detalleC: DetalleCompra[] = []
  ) {
    this.serie = serie;
    this.nroComprobante = nroComprobante;
    this.fechaEmision = fechaEmision;
    this.fechaVenc = fechaVenc;
    this.tipoComprobante = tipoComprobante;
    this.igv = igv;
    this.total = total;
    this.estado = estado;
    this.moneda = moneda;
    this.tipoCambio = tipoCambio;
    this.proveedor = proveedor;
    this.metodoPago = metodoPago;
    this.detalleC = detalleC;
  }
}
