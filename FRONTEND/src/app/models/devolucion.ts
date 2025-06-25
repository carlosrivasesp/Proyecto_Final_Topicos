import { Venta } from "./venta";
import { DetalleVenta } from "./detalleV";

export class Devolucion {
    _id? : String;
    ventaId : Venta;
    cantidadTotal : number;
    fechaDevolucion : Date;
    detalles: DetalleVenta[] = [];

    constructor(
      ventaId : Venta,
      cantidadTotal : number,
      fechaDevolucion : Date,
      detalles: DetalleVenta[]) {

      this.ventaId = ventaId;
      this.cantidadTotal = cantidadTotal;
      this.fechaDevolucion = fechaDevolucion;
      this.detalles = detalles;
    
    }
}
  