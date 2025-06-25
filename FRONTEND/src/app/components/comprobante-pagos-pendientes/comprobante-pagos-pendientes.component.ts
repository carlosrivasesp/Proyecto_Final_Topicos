import { isPlatformBrowser } from '@angular/common';
import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';

@Component({
  selector: 'app-comprobante-pagos-pendientes',
  standalone: false,
  templateUrl: './comprobante-pagos-pendientes.component.html',
  styleUrl: './comprobante-pagos-pendientes.component.css'
})
export class ComprobantePagosPendientesComponent {
  currentDateTime: string = '';
  metodoPago: string = 'Efectivo';
  destino: string = 'En caja';
  monto: number = 500;
  observacion: string = 'xxxx';
  actualizarDestino() {
    this.destino = this.metodoPago === 'Efectivo' ? 'En caja' : 'BBVA';
  }
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    // Solo ejecuta la lógica si estamos en el navegador
    if (isPlatformBrowser(this.platformId)) {
      this.updateDateTime(); // Actualiza la hora inicialmente
      setInterval(() => this.updateDateTime(), 1000); // Actualiza cada segundo
    }
  }

  private updateDateTime(): void {
    const now = new Date();
    this.currentDateTime = now.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    });
  }  
}
