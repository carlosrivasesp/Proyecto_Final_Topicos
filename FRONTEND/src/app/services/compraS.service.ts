// src/app/services/compra-sugerida.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CompraSugerida } from '../models/compraS';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class CompraSugeridaService {
  private apiUrl = 'http://localhost:4000/api/comprasSugeridas';

  constructor(private http: HttpClient) {}

  // Obtener todas las sugerencias
  getSugerencias(): Observable<CompraSugerida[]> {
    return this.http.get<CompraSugerida[]>(`${this.apiUrl}/`);
  }

  // Generar sugerencias faltantes
  generarSugerencias(): Observable<any> {
    return this.http.post(`${this.apiUrl}/generar-faltantes`, {});
  }

  marcarOrdenGenerada(id: string) {
    return this.http.put(`${this.apiUrl}/marcar-orden/${id}`, {});
  }

}
