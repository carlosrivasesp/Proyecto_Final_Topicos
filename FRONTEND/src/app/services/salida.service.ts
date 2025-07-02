import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Salida } from '../models/salida';

@Injectable({
  providedIn: 'root'
})
export class SalidaService {

  private url = 'http://localhost:4000/api/';

  constructor(private http: HttpClient) {}

  getAllSalidas(): Observable<any> {
          let direccionUrl = this.url + 'getSalidas';
          return this.http.get<Salida>(direccionUrl);
  }

  obtenerSalida(id: string): Observable<any> {
          let direccionUrl = this.url + 'getSalida';
          return this.http.get<Salida>(direccionUrl + '/' + id);
 }
}
