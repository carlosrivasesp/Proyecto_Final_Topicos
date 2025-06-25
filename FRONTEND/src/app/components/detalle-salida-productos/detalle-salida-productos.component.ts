import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SalidaService } from '../../services/salida.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-detalle-salida-productos',
  standalone: false,
  templateUrl: './detalle-salida-productos.component.html',
  styleUrl: './detalle-salida-productos.component.css'
})
export class DetalleSalidaProductosComponent {
  salidaForm: FormGroup;
  idSalida: string | null;
  currentDateTime: string = '';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private aRouter: ActivatedRoute,
    private salidaService: SalidaService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.salidaForm = this.fb.group({
      tipoOperacion: ['', Validators.required],
      ventaId: this.fb.group({
        tipoComprobante: [''],
        serie: [''],
        nroComprobante: [''],
        detalles: this.fb.array([])
      }),
      cantidadTotal: ['', Validators.required],
      fechaSalida: ['', Validators.required],
    });
    
    this.idSalida = this.aRouter.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.updateDateTime();
      setInterval(() => this.updateDateTime(), 1000);
    }
    this.verDetalle();
  }

  // Getter para acceder al FormArray 'detalles'
  get detallesVenta(): FormArray {
    return this.salidaForm.get('ventaId.detalles') as FormArray;
  }
  

  verDetalle(): void {
    if (this.idSalida !== null) {
      this.salidaService.obtenerSalida(this.idSalida).subscribe((data) => {
        console.log(data);
  
        this.salidaForm.patchValue({
          tipoOperacion: data.tipoOperacion,
          cantidadTotal: data.cantidadTotal,
          fechaSalida: this.formatDate(data.fechaSalida),
          ventaId: {
            tipoComprobante: data.ventaId.tipoComprobante,
            serie: data.ventaId.serie,
            nroComprobante: data.ventaId.nroComprobante
          }
        });
  
        const detallesArray = this.salidaForm.get('ventaId.detalles') as FormArray;
        detallesArray.clear();
  
        // Agregar productos
        console.log('Detalles:', data.ventaId.detalles);
        data.ventaId.detalles.forEach((detalle: any, index: number) => {
          detallesArray.push(
            this.fb.group({
              codigo: detalle.codInt,
              producto: detalle.nombre,
              cantidad: detalle.cantidad,
            })
          );
        });
      });
    }
  
    this.salidaForm.disable();
  }
  
  

  formatDate(date: Date): string {
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${d.getFullYear()}`;
  }

  private updateDateTime(): void {
    const now = new Date();
    this.currentDateTime = now.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
  }
}
