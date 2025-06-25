import { Lugar } from "./lugar";
import { Producto } from "./producto";  // Asegúrate de tener un modelo de Producto
import { Venta } from "./venta";

export class DetalleVenta {
  _id?: string;
  ventaId: Venta;  // Referencia a la venta
  producto: Producto;  // Producto asociado
  lugarId: Lugar;  // Lugar de entrega asociado
  codInt: string;
  nombre: string;
  cantidad: number;
  precio: number;
  codigoL: string;
  distrito: string;
  costoL: number;
  subtotal: number;

  constructor(
    ventaId: Venta,
    producto: Producto,
    lugarId: Lugar,
    codInt: string,
    nombre: string,
    cantidad: number,
    precio: number,
    codigoL: string,
    distrito: string,
    costoL: number,
    subtotal: number
  ) {
    this.ventaId = ventaId;
    this.producto = producto;
    this.lugarId = lugarId;
    this.codInt = codInt;
    this.nombre = nombre;
    this.cantidad = cantidad;
    this.precio = precio;
    this.codigoL = codigoL;
    this.distrito = distrito;
    this.costoL = costoL;
    this.subtotal = subtotal;
  }
}
