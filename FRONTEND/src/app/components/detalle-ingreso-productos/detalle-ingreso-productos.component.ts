import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IngresoService } from '../../services/ingreso.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-detalle-ingreso-productos',
  standalone: false,
  templateUrl: './detalle-ingreso-productos.component.html',
  styleUrl: './detalle-ingreso-productos.component.css'
})
export class DetalleIngresoProductosComponent {
  ingresoForm: FormGroup;
  idIngreso: string | null;
  currentDateTime: string = '';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private aRouter: ActivatedRoute,
    private ingresoService: IngresoService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.ingresoForm = this.fb.group({
      tipoOperacion: ['', Validators.required],
      ventaId: this.fb.group({
        tipoComprobante: [''],
        serie: [''],
        nroComprobante: [''],
        detalles: this.fb.array([])
      }),
      compraId: this.fb.group({
        tipoComprobante: [''],
        serie: [''],
        nroComprobante: [''],
        detalleC: this.fb.array([])
      }),
      cantidadTotal: ['', Validators.required],
      fechaIngreso: ['', Validators.required],
    });
    
    this.idIngreso = this.aRouter.snapshot.paramMap.get('id');
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
    return this.ingresoForm.get('ventaId.detalles') as FormArray;
  }
  
  get detallesCompra(): FormArray {
    return this.ingresoForm.get('compraId.detalleC') as FormArray;
  }
  

  verDetalle(): void {
    if (this.idIngreso !== null) {
      this.ingresoService.obtenerIngreso(this.idIngreso).subscribe((data) => {
        console.log(data);
  
        this.ingresoForm.patchValue({
          tipoOperacion: data.tipoOperacion,
          cantidadTotal: data.cantidadTotal,
          fechaIngreso: this.formatDate(data.fechaIngreso),
        });
  
        if (data.tipoOperacion === 'Venta Anulada') {
          this.ingresoForm.get('ventaId')?.patchValue({
            tipoComprobante: data.ventaId.tipoComprobante,
            serie: data.ventaId.serie,
            nroComprobante: data.ventaId.nroComprobante,
          });
  
          const detallesArray = this.ingresoForm.get('ventaId.detalles') as FormArray;
          detallesArray.clear();
  
          data.ventaId.detalles.forEach((detalle: any) => {
            detallesArray.push(this.fb.group({
              codigo: detalle.codInt,
              producto: detalle.nombre,
              cantidad: detalle.cantidad,
            }));
          });
        } else if (data.tipoOperacion === 'Compra Registrada') {
          this.ingresoForm.get('compraId')?.patchValue({
            tipoComprobante: data.compraId.tipoComprobante,
            serie: data.compraId.serie,
            nroComprobante: data.compraId.nroComprobante,
          });
  
          const detallesArray = this.ingresoForm.get('compraId.detalleC') as FormArray;
          detallesArray.clear();
  
          data.compraId.detalleC.forEach((detalle: any) => {
            detallesArray.push(this.fb.group({
              codigo: detalle.codInt,
              producto: detalle.nombre,
              cantidad: detalle.cantidad,
            }));
          });
        }
  
        this.ingresoForm.disable();
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
