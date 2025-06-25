export class Cliente {
    _id?: string;
    tipoDoc: string;
    nroDoc: string;
    nombre: string;
    telefono: string;
    correo: string;
    estado: string;

    constructor(tipoDoc: string, nroDoc: string, nombre: string, telefono: string, correo: string, estado: string){
        this.tipoDoc = tipoDoc;
        this.nroDoc = nroDoc;
        this.nombre = nombre;
        this.telefono = telefono;
        this.correo = correo;
        this.estado = estado;
    }
}