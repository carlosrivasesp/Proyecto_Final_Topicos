import { DetalleVenta } from './detalleV';
import { Venta } from './venta';  // Asegúrate de tener el modelo de Venta importado

export class Salida {
  _id? : String;
      tipoOperacion : String;
      ventaId : Venta;
      cantidadTotal : number;
      fechaSalida : Date;
      detalles: DetalleVenta[] = []
  
      constructor(tipoOperacion : String,
        ventaId : Venta,
        cantidadTotal : number,
        fechaSalida : Date,
        detalles: DetalleVenta[]) {
  
        this.tipoOperacion = tipoOperacion;
        this.ventaId = ventaId;
        this.cantidadTotal = cantidadTotal;
        this.fechaSalida = fechaSalida;
        this.detalles = detalles;
      }
}
