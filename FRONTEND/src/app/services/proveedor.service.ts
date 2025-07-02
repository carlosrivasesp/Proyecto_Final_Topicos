import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Proveedor } from "../models/proveedor";

@Injectable({
    providedIn: 'root'
})
export class ProveedorService {

    url= 'http://localhost:4000/api/';

    constructor(private http: HttpClient) { }

    getAllProveedores(): Observable<any>{
        let direccionUrl = this.url + 'getProveedores';

        return this.http.get<Proveedor>(direccionUrl);
    }

    deleteProveedor(id: string): Observable<any>{
        let direccionUrl = this.url + 'deleteProveedor';

        return this.http.delete<Proveedor>(direccionUrl +'/'+ id);
    }

    guardarProveedor(proveedor: Proveedor): Observable<any> {
        let direccionUrl = this.url + 'registerProveedor';

        return this.http.post<Proveedor>(direccionUrl, proveedor);
    }

    obtenerProveedor(id: string): Observable<any> {
        let direccionUrl = this.url + 'getProveedor';

        return this.http.get<Proveedor>(direccionUrl + '/' + id)
    }

    editarProveedor(id: string, proveedor: Proveedor): Observable<any> {
        let direccionUrl = this.url + 'updateProveedor';

        return this.http.put<Proveedor>(direccionUrl + '/' + id, proveedor);
    }
}