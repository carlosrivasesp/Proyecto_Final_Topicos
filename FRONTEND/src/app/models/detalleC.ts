import { Producto } from "./producto";  // Asegúrate de tener un modelo de Producto

export class DetalleCompra {
  _id?: string;
  compraId: string;
  producto: Producto;
  codInt: string;
  nombre: string;
  cantidad: number;
  precio: number;
  subtotal: number;

  constructor(
    compraId: string,
    producto: Producto,
    codInt: string,
    nombre: string,
    cantidad: number,
    precio: number,
    subtotal: number
  ) {
    this.compraId = compraId;
    this.producto = producto;
    this.codInt = codInt;
    this.nombre = nombre;
    this.cantidad = cantidad;
    this.precio = precio;
    this.subtotal = subtotal;
  }
}
