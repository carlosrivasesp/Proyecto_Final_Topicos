import { Categoria } from "./categoria";
import { Marca } from "./marca";

export class Producto {
    _id?: string;
    codInt: string;
    nombre: string;
    precio: number;
    stockActual: number;
    stockMin: number;
    categoria: Categoria;
    marca: Marca;
    estado: string;

    constructor(codInt: string, nombre: string, precio: number, stockActual: number, stockMin: number, categoria: Categoria, marca: Marca, estado: string){
        this.codInt = codInt;
        this.nombre = nombre;
        this.precio = precio;
        this.stockActual = stockActual;
        this.stockMin = stockMin;
        this.categoria = categoria;
        this.marca = marca;
        this.estado = estado;
    }
}