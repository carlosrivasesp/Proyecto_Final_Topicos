import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Cliente } from "../models/cliente";

@Injectable({
    providedIn: 'root'
})

export class ClienteService {

    url= 'http://localhost:4000/api/';

    constructor(private http: HttpClient) { }

    getAllClientes(): Observable<any>{
        let direccionUrl = this.url + 'getClientes';

        return this.http.get<Cliente>(direccionUrl);
    }

    deleteCliente(id: string): Observable<any>{
        let direccionUrl = this.url + 'deleteCliente';

        return this.http.delete<Cliente>(direccionUrl +'/'+ id);
    }

    guardarCliente(cliente: Cliente): Observable<any> {
        let direccionUrl = this.url + 'registrarCliente';

        return this.http.post<Cliente>(direccionUrl, cliente);
    }

    obtenerCliente(id: string): Observable<any> {
        let direccionUrl = this.url + 'getCliente';

        return this.http.get<Cliente>(direccionUrl + '/' + id)
    }

    editarCliente(id: string, cliente: Cliente): Observable<any> {
        let direccionUrl = this.url + 'updateCliente';

        return this.http.put<Cliente>(direccionUrl + '/' + id, cliente);
    }
}