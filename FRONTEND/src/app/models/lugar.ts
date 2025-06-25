export class Lugar{
    _id?:string;
    codigo:string;
    distrito:string;
    costo:number;
    inicio:number;
    fin:number;
    __v:number;

    constructor(codigo:string,distrito:string,costo:number,inicio:number,fin:number,__v:number){
        this.codigo=codigo;
        this.distrito=distrito;
        this.costo=costo;
        this.inicio=inicio;
        this.fin=fin;
        this.__v=__v;
    }

}