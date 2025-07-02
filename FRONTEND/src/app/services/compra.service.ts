import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Compra } from '../models/compra';

@Injectable({
  providedIn: 'root'
})
export class CompraService {

  private url = 'http://localhost:4000/api/';

  constructor(private http: HttpClient) {}

  registrarCompra(compra: Compra): Observable<any> {
          let direccionUrl = this.url + 'registrarCompra';
          return this.http.post<Compra>(direccionUrl, compra);
  }

  getAllCompras(): Observable<any> {
          let direccionUrl = this.url + 'obtenerCompras';
          return this.http.get<Compra>(direccionUrl);
  }

  obtenerCompra(id: string): Observable<any> {
          let direccionUrl = this.url + 'obtenerCompra';
          return this.http.get<Compra>(direccionUrl + '/' + id);
 }

 editarCompra(id: string, compra: Compra): Observable<any>{
          let direccionUrl = this.url + 'actualizarCompra';
          return this.http.put<Compra>(direccionUrl + '/' + id, compra)
 }
}
