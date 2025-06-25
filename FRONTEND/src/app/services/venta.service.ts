import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Venta } from '../models/venta';

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  private url = 'https://deploy-server-ferretechsc.onrender.com/api/';

  constructor(private http: HttpClient) {}

  getAllVentas(): Observable<any> {
          let direccionUrl = this.url + 'obtenerVentas';
          return this.http.get<Venta>(direccionUrl);
  }

  registrarVenta(venta: Venta): Observable<any> {
           let direccionUrl = this.url + 'registrarVenta';
           return this.http.post<Venta>(direccionUrl, venta);
   }
 

  obtenerVenta(id: string): Observable<any> {
          let direccionUrl = this.url + 'obtenerVenta';
          return this.http.get<Venta>(direccionUrl + '/' + id);
 }

 editarVenta(id: string, venta: Venta): Observable<any>{
          let direccionUrl = this.url + 'actualizarVenta';
          return this.http.put<Venta>(direccionUrl + '/' + id, venta)
 }
 
}
