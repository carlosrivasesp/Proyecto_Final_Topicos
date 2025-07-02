import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Devolucion } from '../models/devolucion';

@Injectable({
  providedIn: 'root'
})
export class DevolucionService {

  private url = 'http://localhost:4000/api/';

  constructor(private http: HttpClient) {}

  getAllDevolucion(): Observable<any> {
          let direccionUrl = this.url + 'getDevoluciones';
          return this.http.get<Devolucion>(direccionUrl);
  }

  obtenerDevolucion(id: string): Observable<any> {
          let direccionUrl = this.url + 'getDevolucion';
          return this.http.get<Devolucion>(direccionUrl + '/' + id);
 }
}
