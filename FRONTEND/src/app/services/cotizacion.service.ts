import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cotizacion } from '../models/cotizacion';  // Asegúrate de que el modelo Cotizacion esté en el lugar correcto
import { DetalleCotizacion } from '../models/detalleCotizacion';

@Injectable({
  providedIn: 'root'
})
export class CotizacionService {

  private url = 'http://localhost:4000/api/';  // URL de la API de cotización

  constructor(private http: HttpClient) {}

  // Registrar una nueva cotización
  registrarCotizacion(cotizacion: Cotizacion): Observable<any> {
    let direccionUrl = this.url + 'registrarCotizacion';  // Ruta para registrar cotización
    return this.http.post<Cotizacion>(direccionUrl, cotizacion);
  }

  // Obtener todas las cotizaciones
  getAllCotizaciones(): Observable<any> {
    let direccionUrl = this.url + 'obtenerCotizaciones';  // Ruta para obtener todas las cotizaciones
    return this.http.get<Cotizacion[]>(direccionUrl);
  }

  // Obtener una cotización específica por ID
  obtenerCotizacion(id: string): Observable<any> {
    let direccionUrl = this.url + 'obtenerCotizacion/' + id;  // Ruta corregida para obtener una cotización por ID
    return this.http.get<Cotizacion>(direccionUrl);
  }

  // Obtener los detalles de una cotización específica
  obtenerDetallesCotizacion(id: string): Observable<DetalleCotizacion[]> {
    let direccionUrl = this.url + 'detallesCotizacion/' + id;  // Ruta corregida para obtener los detalles de cotización
    return this.http.get<DetalleCotizacion[]>(direccionUrl);  // Usamos `DetalleCotizacion[]` como tipo de retorno
  }

  // Actualizar una cotización existente
  editarCotizacion(id: string, cotizacion: Cotizacion): Observable<any> {
    let direccionUrl = this.url + 'actualizarCotizacion';  // Ruta para actualizar cotización
    return this.http.put<Cotizacion>(direccionUrl + '/' + id, cotizacion);
  }

obtenerDetallesCotizacionPorVenta(ventaId: string): Observable<any> {
  return this.http.get<any>(`${this.url}cotizacion/detalles-por-venta/${ventaId}`);
}}
