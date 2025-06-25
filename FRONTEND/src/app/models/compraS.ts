import { Producto } from "./producto";

export class CompraSugerida {
    _id?: string;
    producto: Producto;
    fechaSugerencia: Date;
    tieneOrdenCompra: boolean;

  constructor(producto: Producto, fechaSugerencia: Date, tieneOrdenCompra: boolean) {
    this.producto = producto;
    this.fechaSugerencia = fechaSugerencia;
    this.tieneOrdenCompra = tieneOrdenCompra;
  }
}