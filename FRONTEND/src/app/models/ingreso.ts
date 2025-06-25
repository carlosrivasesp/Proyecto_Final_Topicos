import { Compra } from "./compra";
import { DetalleCompra } from "./detalleC";
import { Venta } from "./venta";
import { DetalleVenta } from "./detalleV";

export class Ingreso {
    _id? : String;
    tipoOperacion : String;
    compraId?: Compra;
    ventaId?: Venta;
    cantidadTotal : number;
    fechaIngreso : Date;
    detalles: DetalleVenta[] = [];
    detalleC: DetalleCompra[] = []

    constructor(tipoOperacion : String,
      compraId : Compra,
      ventaId : Venta,
      cantidadTotal : number,
      fechaIngreso : Date,
      detalles: DetalleVenta[],
      detalleC: DetalleCompra[]) {

      this.tipoOperacion = tipoOperacion;
      this.compraId = compraId;
      this.ventaId = ventaId;
      this.cantidadTotal = cantidadTotal;
      this.fechaIngreso = fechaIngreso;
      this.detalles = detalles;
      this.detalleC = detalleC;
    
    }
  }
  