import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Marca } from "../models/marca";

@Injectable({
    providedIn: 'root'
})
export class MarcaService {

    url = 'http://localhost:4000/api/';

    constructor(private http: HttpClient) { }

    getAllMarcas(): Observable<any> {
        let direccionUrl = this.url + 'getMarcas';
        return this.http.get<Marca[]>(direccionUrl);
    }

    deleteMarca(id: string): Observable<any> {
        let direccionUrl = this.url + 'deleteMarca';
        return this.http.delete<Marca>(`${direccionUrl}/${id}`);
    }

    guardarMarca(marca: Marca): Observable<any> {
        let direccionUrl = this.url + 'registerMarca';
        return this.http.post<Marca>(direccionUrl, marca);
    }

    obtenerMarca(id: string): Observable<any> {
        let direccionUrl = this.url + 'getMarca';
        return this.http.get<Marca>(`${direccionUrl}/${id}`);
    }

    editarMarca(id: string, marca: Marca): Observable<any> {
        let direccionUrl = this.url + 'updateMarca';
        return this.http.put<Marca>(`${direccionUrl}/${id}`, marca);
    }
}
