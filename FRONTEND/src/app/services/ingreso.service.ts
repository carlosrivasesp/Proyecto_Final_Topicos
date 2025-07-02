import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ingreso } from '../models/ingreso';

@Injectable({
  providedIn: 'root'
})
export class IngresoService {

  private url = 'http://localhost:4000/api/';

  constructor(private http: HttpClient) {}

  getAllIngresos(): Observable<any> {
          let direccionUrl = this.url + 'getIngresos';
          return this.http.get<Ingreso>(direccionUrl);
  }

  obtenerIngreso(id: string): Observable<any> {
          let direccionUrl = this.url + 'getIngreso';
          return this.http.get<Ingreso>(direccionUrl + '/' + id);
 }
}
