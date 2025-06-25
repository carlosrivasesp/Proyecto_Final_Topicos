import { Proveedor } from "./proveedor";

export class Marca {
    _id?: string;
    nombre: string;
    proveedor: Proveedor;

    constructor(nombre: string, proveedor: Proveedor){
        this.nombre = nombre;
        this.proveedor = proveedor;
    }
}