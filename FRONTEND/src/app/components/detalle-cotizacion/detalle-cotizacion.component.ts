import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CotizacionService } from '../../services/cotizacion.service';  // Cambié a CotizacionService
import { ToastrService } from 'ngx-toastr';
import { isPlatformBrowser } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClienteService } from '../../services/cliente.service';  // Cambié a ClienteService

@Component({
  selector: 'app-detalle-cotizacion',
  standalone: false,
  templateUrl: './detalle-cotizacion.component.html',
  styleUrls: ['./detalle-cotizacion.component.css'],
})
export class DetalleCotizacionComponent implements OnInit {
  cotizacionForm: FormGroup;
  listClientes: any[] = [];
  idCotizacion: string | null;
  currentDateTime: string = '';
  modoEdicion: boolean = false;


  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private aRouter: ActivatedRoute,
    private cotizacionService: CotizacionService,  // Cambié a CotizacionService
    private toastr: ToastrService,
    private router: Router,
    private fb: FormBuilder,
    private _clienteService: ClienteService  // Cambié a ClienteService
  ) {

    this.cotizacionForm = this.fb.group({
      cliente: ['', Validators.required],
      fechaEmision: [{ value: '', disabled: true }],
      tipoCambio: [{ value: '', disabled: true }],
      moneda: [{ value: '', disabled: true }],
      total: [{ value: '', disabled: true }],
      igv: [{ value: '', disabled: true }],
      contacto: [{ value: '', disabled: true }],
      telefono: [{ value: '', disabled: true }],
      detalles: this.fb.array([]),
    });

    this.idCotizacion = this.aRouter.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.updateDateTime();
      setInterval(() => this.updateDateTime(), 1000);
    }

    // Detectar si es edición según la URL
    if (this.router.url.includes('/detalle-cotizacion') && this.router.url.includes('/editar')) {
      this.modoEdicion = true;
      this.cotizacionForm.enable();
    }


    this.obtenerClientes();
    this.verDetalle();
  }

  obtenerClientes() {
    this._clienteService.getAllClientes().subscribe(
      (data) => {
        this.listClientes = data;
      },
      (error) => {
        console.error('Error al obtener clientes', error);
        this.toastr.error('No se pudieron cargar los clientes', 'Error');
      }
    );
  }

  get detalles(): FormArray {
    return this.cotizacionForm.get('detalles') as FormArray;
  }
  getDetalleFormGroup(index: number): FormGroup {
    return this.detalles.at(index) as FormGroup;
  }


  verDetalle(): void {
    if (this.idCotizacion !== null) {
      this.cotizacionService.obtenerCotizacion(this.idCotizacion).subscribe({
        next: (data) => {
          console.log('Cotización cargada:', data);  // Asegúrate que esto esté presente

          // Actualizar el formulario con la cotización y los detalles
          this.cotizacionForm.patchValue({
            cliente: data.cliente?._id || '',
            fechaEmision: this.formatDate(data.fechaEmision),
            tipoCambio: data.tipoCambio,
            moneda: data.moneda,
            total: data.total,
            igv: data.igv,
            contacto: data.contacto,
            telefono: data.telefono,
          });

          // Limpiar los detalles previos
          this.detalles.clear();

          // Agregar los detalles de la cotización al FormArray
          if (data.detalleC && Array.isArray(data.detalleC)) {
            data.detalleC.forEach((detalle: any) => {
              this.detalles.push(
                this.fb.group({
                  descripcion: [detalle.nombre],  // Asegúrate de que la propiedad sea la correcta
                  cantidad: [detalle.cantidad],
                  valorUnitario: [detalle.precio],
                  precioUnitario: [detalle.precio],  // Suponiendo que "precio" es el valor unitario
                  subtotal: [detalle.subtotal],
                  total: [detalle.total],
                })
              );
            });
            if (this.modoEdicion) {
              this.escucharCambiosDetalles();
            }
          } else {
            console.log("No se encontraron detalles de cotización");
          }
        },
        error: (err) => {
          console.error('Error al obtener los detalles de la cotización', err);
          this.toastr.error('No se pudo cargar el detalle de la cotización', 'Error');
        },
      });
    }

    this.cotizacionForm.disable();
  }
  escucharCambiosDetalles(): void {
    this.detalles.controls.forEach((grupo: any) => {
      grupo.get('cantidad')?.valueChanges.subscribe(() => this.recalcularTotales());
      grupo.get('precioUnitario')?.valueChanges.subscribe(() => this.recalcularTotales());
    });
  }

  recalcularTotales(): void {
    let subtotal = 0;
    this.detalles.controls.forEach((grupo: any) => {
      const cantidad = grupo.get('cantidad')?.value || 0;
      const precio = grupo.get('precioUnitario')?.value || 0;
      const subtotalItem = cantidad * precio;

      grupo.get('subtotal')?.setValue(subtotalItem, { emitEvent: false });
      grupo.get('total')?.setValue(subtotalItem, { emitEvent: false });

      subtotal += subtotalItem;
    });

    const igv = +(subtotal * 0.18).toFixed(2);
    const total = +(subtotal + igv).toFixed(2);

    this.cotizacionForm.patchValue({
      igv: igv,
      total: total
    }, { emitEvent: false });
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
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }
}
