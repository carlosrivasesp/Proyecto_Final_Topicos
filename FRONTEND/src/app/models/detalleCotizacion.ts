import { Producto } from "./producto";  

export class DetalleCotizacion {
  _id?: string;
  cotizacionId: string;  
  producto: Producto;  
  nombre: string;        
  cantidad: number;       
  precio: number;        
  subtotal: number;      

  constructor(
    cotizacionId: string,
    producto: Producto,
    nombre: string,
    cantidad: number,
    precio: number,
    subtotal: number
  ) {
    this.cotizacionId = cotizacionId;  
    this.producto = producto;          
    this.nombre = nombre;       
    this.cantidad = cantidad;         
    this.precio = precio;              
    this.subtotal = subtotal;        
  }
}
