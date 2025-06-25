import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DevolucionService } from '../../services/devolucion.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-detalle-devolucion-productos',
  standalone: false,
  templateUrl: './detalle-devolucion-productos.component.html',
  styleUrl: './detalle-devolucion-productos.component.css'
})
export class DetalleDevolucionProductosComponent {
  devolucionForm: FormGroup;
  idDevolucion: string | null;
  currentDateTime: string = '';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private aRouter: ActivatedRoute,
    private _devolucionService: DevolucionService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.devolucionForm = this.fb.group({
      ventaId: this.fb.group({
        tipoComprobante: [''],
        serie: [''],
        nroComprobante: [''],
        detalles: this.fb.array([])
      }),
      cantidadTotal: ['', Validators.required],
      fechaDevolucion: ['', Validators.required],
    });
    
    this.idDevolucion = this.aRouter.snapshot.paramMap.get('id');
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
    return this.devolucionForm.get('ventaId.detalles') as FormArray;
  }

  verDetalle(): void {
    if (this.idDevolucion !== null) {
      this._devolucionService.obtenerDevolucion(this.idDevolucion).subscribe((data) => {
        console.log(data);
  
        this.devolucionForm.patchValue({
          tipoOperacion: data.tipoOperacion,
          cantidadTotal: data.cantidadTotal,
          fechaDevolucion: this.formatDate(data.fechaDevolucion),
        });
  
          this.devolucionForm.get('ventaId')?.patchValue({
            tipoComprobante: data.ventaId.tipoComprobante,
            serie: data.ventaId.serie,
            nroComprobante: data.ventaId.nroComprobante,
          });
  
          const detallesArray = this.devolucionForm.get('ventaId.detalles') as FormArray;
          detallesArray.clear();
  
          data.ventaId.detalles.forEach((detalle: any) => {
            detallesArray.push(this.fb.group({
              codigo: detalle.codInt,
              producto: detalle.nombre,
              cantidad: detalle.cantidad,
            }));
          });
        this.devolucionForm.disable();
      });
    }
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
