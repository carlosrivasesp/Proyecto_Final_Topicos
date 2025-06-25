import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Categoria } from "../models/categoria";

@Injectable({
    providedIn: 'root'
})
export class CategoriaService {

    url = 'https://deploy-server-ferretechsc.onrender.com/api/';

    constructor(private http: HttpClient) { }

    getAllCategorias(): Observable<any> {
        let direccionUrl = this.url + 'getCategorias';
        return this.http.get<Categoria[]>(direccionUrl);
    }

    deleteCategoria(id: string): Observable<any> {
        let direccionUrl = this.url + 'deleteCategoria';
        return this.http.delete<Categoria>(`${direccionUrl}/${id}`);
    }

    guardarCategoria(categoria: Categoria): Observable<any> {
        let direccionUrl = this.url + 'registerCategoria';
        return this.http.post<Categoria>(direccionUrl, categoria);
    }

    obtenerCategoria(id: string): Observable<any> {
        let direccionUrl = this.url + 'getCategoria';
        return this.http.get<Categoria>(`${direccionUrl}/${id}`);
    }

    editarCategoria(id: string, categoria: Categoria): Observable<any> {
        let direccionUrl = this.url + 'updateCategoria';
        return this.http.put<Categoria>(`${direccionUrl}/${id}`, categoria);
    }
}
