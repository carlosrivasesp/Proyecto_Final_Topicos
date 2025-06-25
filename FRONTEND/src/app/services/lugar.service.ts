import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Lugar } from "../models/lugar";

@Injectable({
    providedIn: 'root'
})
export class LugarService {

    url = 'https://deploy-server-ferretechsc.onrender.com/api/';

    constructor(private http: HttpClient) { }

    getAllLugares(): Observable<any> {
        let direccionUrl = this.url + 'getLugares';
        return this.http.get<Lugar[]>(direccionUrl);
    }

    // exportarLugares(id: string): Observable<any> {
    //     let direccionUrl = this.url + 'exportarLugares';
    //     return this.http.get<Lugar>(`${direccionUrl}/${id}`);
    // }

    guardarLugar(lugar: Lugar): Observable<any> {
        let direccionUrl = this.url + 'registerLugar';
        return this.http.post<Lugar>(direccionUrl, lugar);
    }

    obtenerLugar(id: string): Observable<any> {
        let direccionUrl = this.url + 'getLugar';
        return this.http.get<Lugar>(direccionUrl + '/' + id);
    }

    editarLugar(id: string, lugar: Lugar): Observable<any> {
        let direccionUrl = this.url + 'updateLugar';
        return this.http.put<Lugar>(direccionUrl + '/' + id, lugar);
    }
}
