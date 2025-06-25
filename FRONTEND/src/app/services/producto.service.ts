import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Producto } from "../models/producto";

@Injectable({
    providedIn: 'root'
})
export class ProductoService {

    url = 'https://deploy-server-ferretechsc.onrender.com/api/';

    constructor(private http: HttpClient) { }

    getAllProductos(): Observable<any> {
        let direccionUrl = this.url + 'getProducts';
        return this.http.get<Producto>(direccionUrl);
    }

    deleteProducto(id: string): Observable<any> {
        let direccionUrl = this.url + 'deleteProduct';
        return this.http.delete<Producto>(direccionUrl + '/' + id);
    }

    guardarProducto(producto: Producto): Observable<any> {
        let direccionUrl = this.url + 'createProduct';
        return this.http.post<Producto>(direccionUrl, producto);
    }

    obtenerProducto(id: string): Observable<any> {
        let direccionUrl = this.url + 'getProduct';
        return this.http.get<Producto>(direccionUrl + '/' + id);
    }

    editarProducto(id: string, producto: Producto): Observable<any> {
        let direccionUrl = this.url + 'updateProduct';
        return this.http.put<Producto>(direccionUrl + '/' + id, producto);
    }

    getProductosPorProveedor(idProveedor: string): Observable<any> {
    const direccionUrl = this.url + 'obtenerProdProv/proveedor';
    return this.http.get<Producto[]>(direccionUrl + '/' + idProveedor);
    }

    getProductosPorProveedorSinStock(idProveedor: string): Observable<any> {
    const direccionUrl = this.url + 'obtenerProdProv/proveedor/sinStock';
    return this.http.get<Producto[]>(direccionUrl + '/' + idProveedor);
    }

    getProductosPocoStock(): Observable<any> {
    const direccionUrl = this.url + 'obtenerProdProv/poco-stock';
    return this.http.get<Producto[]>(direccionUrl);
    }


}
