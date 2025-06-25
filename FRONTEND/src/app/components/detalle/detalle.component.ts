import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VentaService } from '../../services/venta.service';
import { CotizacionService } from '../../services/cotizacion.service';
import { ToastrService } from 'ngx-toastr';
import { isPlatformBrowser } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClienteService } from '../../services/cliente.service'; // Servicio para obtener clientes

@Component({
  selector: 'app-detalle',
  standalone: false,
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css'],
})
export class DetalleComponent implements OnInit {
  ventaForm: FormGroup;
  listClientes: any[] = []; // Lista de clientes
  idVenta: string | null;
  currentDateTime: string = '';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private aRouter: ActivatedRoute,
    private ventaService: VentaService,
    private cotizacionService: CotizacionService,
    private toastr: ToastrService,
    private router: Router,
    private fb: FormBuilder,
    private _clienteService: ClienteService // Inyección del servicio de clientes
  ) {
    this.ventaForm = this.fb.group({
      tipoComprobante: ['', Validators.required],
      serie: ['', Validators.required],
      nroComprobante: ['', Validators.required],
      fechaEmision: [{ value: '', disabled: true }],
      fechaVenc: [{ value: '', disabled: true }],
      igv: ['', Validators.required],
      total: ['', Validators.required],
      estado: ['', Validators.required],
      moneda: ['', Validators.required],
      tipoCambio: ['', Validators.required],
      cliente: ['', Validators.required],
      metodoPago: ['', Validators.required],
      detalles: this.fb.array([]), // Para los productos y lugares
    });

    this.idVenta = this.aRouter.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.updateDateTime();
      setInterval(() => this.updateDateTime(), 1000);
    }

    this.obtenerClientes();

    this.verDetalle();
  }

  obtenerClientes() {
    this._clienteService.getAllClientes().subscribe(
      (data) => {
        console.log(data);
        this.listClientes = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  // Getter para acceder al FormArray 'detalles'
  get detalles(): FormArray {
    return this.ventaForm.get('detalles') as FormArray;
  }

  verDetalle(): void {
    if (this.idVenta !== null) {
      this.ventaService.obtenerVenta(this.idVenta).subscribe((data) => {
        console.log('Venta:', data);

        console.log('Detalles desde venta:', data.detalles);

        this.ventaForm.patchValue({
          tipoComprobante: data.tipoComprobante,
          serie: data.serie,
          nroComprobante: data.nroComprobante,
          fechaEmision: this.formatDate(data.fechaEmision),
          fechaVenc: this.formatDate(data.fechaVenc),
          igv:data.igv,
          total: data.total,
          estado: data.estado,
          moneda: data.moneda,
          tipoCambio: data.tipoCambio,
          metodoPago: data.metodoPago,
          cliente: data.cliente.id,
        });

        const detallesArray = this.ventaForm.get('detalles') as FormArray;
        detallesArray.clear();

        this.cotizacionService.obtenerDetallesCotizacionPorVenta(this.idVenta!).subscribe((resp) => {
          console.log('Detalles Cotización por Venta:', resp);

          const detallesParaMostrar = resp.detalles && resp.detalles.length > 0 ? resp.detalles : data.detalles;

          detallesParaMostrar.forEach((detalle: any) => {
            detallesArray.push(
              this.fb.group({
                codigo: detalle.producto?.codInt || detalle.codInt,
                descripcion: detalle.producto?.nombre || detalle.nombre,
                cantidad: detalle.cantidad,
                precio: detalle.precio,
                subtotal: detalle.subtotal,
              })
            );
          });

          if (data.lugar) {
            detallesArray.push(
              this.fb.group({
                codigo: data.lugar.codigo,
                descripcion: `Servicio de entrega - ${data.lugar.distrito}`,
                cantidad: 1,
                precio: data.lugar.costo,
                subtotal: data.lugar.costo,
              })
            );
          }

          this.ventaForm.disable();
        });
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
