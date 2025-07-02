import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Entregas } from "../models/entregas";

@Injectable({
    providedIn: 'root'
})

export class EntregaService {

    url= 'http://localhost:4000/api/';

    constructor(private http: HttpClient) { }

    getAllEntregas(): Observable<any>{
        let direccionUrl = this.url + 'getEntregas';

        return this.http.get<Entregas>(direccionUrl);
    }

    obtenerEntrega(id: string): Observable<any> {
        let direccionUrl = this.url + 'getEntrega';

        return this.http.get<Entregas>(direccionUrl + '/' + id)
    }

    editarEstado(id: string, data: any): Observable<any> {
        let direccionUrl = this.url + 'updateEntrega';

        return this.http.put<Entregas>(direccionUrl + '/' + id, data);
    }

}