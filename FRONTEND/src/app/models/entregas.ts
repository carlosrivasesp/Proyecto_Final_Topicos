import { Venta } from "./venta";

export class Entregas{
    _id?:string;
    ventaId:Venta; //referencia al id de venta
    direccion:string;
    estado:string;
    fechaInicio:Date;
    fechaFin:Date;

    constructor(ventaId:Venta,direccion:string,estado:string,fechaInicio:Date,fechaFin:Date){
        this.ventaId=ventaId;
        this.direccion=direccion;
        this.estado=estado;
        this.fechaInicio=fechaInicio;
        this.fechaFin=fechaFin;
    }
}