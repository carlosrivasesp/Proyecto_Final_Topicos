import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-reportes',
  standalone: false,
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent {

  private urlProductos = 'https://deploy-server-ferretechsc.onrender.com/api/exportarProductos';
  private urlLugares = 'https://deploy-server-ferretechsc.onrender.com/api/exportarLugares';
  private urlComprobantes = 'https://deploy-server-ferretechsc.onrender.com/api/ventas';
  private urlEntregas = 'https://deploy-server-ferretechsc.onrender.com/api/exportarEntregas';
  private urlClientes = 'https://deploy-server-ferretechsc.onrender.com/api/exportarClientes';
  private urlCotizaciones = 'https://deploy-server-ferretechsc.onrender.com/api/exportarCotizacion';


  private urlCompras = 'https://deploy-server-ferretechsc.onrender.com/api/exportarCompras';
  private urlComprasSugeridas = 'https://deploy-server-ferretechsc.onrender.com/api/comprasSugeridas';

  constructor(private http: HttpClient) {}

  // Función genérica para exportar cualquier tipo de reporte
  exportarReporte(urlBase: string, tipo: string) {
    let endpoint = '';

switch (tipo) {
  case 'total':
    endpoint = '/total';
    break;
  case 'disponibles':
    endpoint = '/disponibles';
    break;
  case 'agotados':
    endpoint = '/agotados';
    break;
  case 'poco-stock':
    endpoint = '/poco-stock';
    break;
  case 'descontinuados':
    endpoint = '/descontinuados';
    break;
  case 'lugaresEntrega':
    endpoint = '/lugaresEntrega';
        break;
      
      //ENTREGAS
      case 'listadoEntregas':
        endpoint='/listadoEntregas';
        break; 
      case 'entregasRealizadas':
        endpoint='/entregasRealizadas';
        break;
      case 'entregasPendientes':
        endpoint='/entregasPendientes';
        break;  
      case 'entregasProgramadas':
        endpoint='/entregasProgramadas';
    break;
  // CLIENTES
  case 'naturales':
    endpoint = '/exportar/naturales';
    break;
  case 'empresas':
    endpoint = '/exportar/empresas';
    break;
  case 'inactivos':
    endpoint = '/exportar/inactivos';
    break;
  case 'nuevos':
    endpoint = '/exportar/nuevos';
    break;
  case 'frecuentes':
    endpoint = '/exportar/frecuentes';
    break;
  case 'emitidas':
    endpoint = '/exportar/emitidas';
    break;
  case 'pendientes':
    endpoint = '/exportar/pendientes';
    break;
  case 'aceptadas':
    endpoint = '/exportar/aceptadas';
    break;
  case 'rechazadas':
    endpoint = '/exportar/rechazadas';
    break;
  case 'convertidas':
    endpoint = '/exportar/convertidas';
    break;
        case 'total-compras':
        endpoint = '/total';
        break;
      case 'facturas':
        endpoint = '/facturas';
        break;
      case 'boletas':
        endpoint = '/boletas';
        break;
        case 'proveedor':
        endpoint = '/proveedor';
        break; 
  default:
    console.error('Tipo no reconocido');
    return;

}

    this.http.get(`${urlBase}${endpoint}`, { responseType: 'blob' }).subscribe(
      (blob: Blob) => {
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(blob);
        a.href = objectUrl;
        a.download = `reporte_${tipo}.xlsx`;
        a.click();
        URL.revokeObjectURL(objectUrl);
      },
      (error) => {
        console.error('Error al descargar:', error);
      }
    );
  }

  // Métodos específicos para cada tipo de reporte (si se prefiere mantenerlos separados)
  exportarProductos(tipo: string) {
    this.exportarReporte(this.urlProductos, tipo);
  }
  exportarCompras(tipo: string) {
    this.exportarReporte(this.urlCompras, tipo);
  }
  exportarComprasSugeridas() {
    this.exportarReporte(this.urlComprasSugeridas, '/export');
  }
  exportarLugaresEntrega() {
    this.exportarReporte(this.urlLugares, 'lugaresEntrega');
  }

  exportarEntregas(tipo: string){
    this.exportarReporte(this.urlEntregas,tipo);
  }
  exportarClientes(tipo: string) {
  this.exportarReporte(this.urlClientes, tipo);
}

exportarCotizaciones(tipo: string) {
  this.exportarReporte(this.urlCotizaciones, tipo);
}



exportarComprobante(tipo: string) {
  let endpoint = '';

  switch (tipo) {
    case 'facturas':
      endpoint = '/exportar-facturas';
      break;
    case 'boletas':
      endpoint = '/exportar-boletas';
      break;
    case 'efectivo': // nuevo
      endpoint = '/exportar-efectivo';
      break;
    case 'otros': // nuevo
      endpoint = '/exportar-otros';
      break;
    case 'listado-general':
      endpoint = '/exportar-listado-general';
      break;
    default:
      console.error('Tipo no reconocido');
      return;
  }

  this.http.get(`${this.urlComprobantes}${endpoint}`, { responseType: 'blob' }).subscribe(
    (blob: Blob) => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = `comprobante_${tipo}.xlsx`;
      a.click();
      URL.revokeObjectURL(objectUrl);
    },
    (error) => {
      console.error('Error al descargar:', error);
    }
  );
}
}
