import { Component } from '@angular/core';
import { Cotizacion } from '../../models/cotizacion';
import { CotizacionService } from '../../services/cotizacion.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

declare const bootstrap: any;

@Component({
  selector: 'app-listado-cotizaciones',
  standalone: false,
  templateUrl: './lista-cotizaciones.component.html',
  styleUrls: ['./lista-cotizaciones.component.css']
})
export class ListadoCotizacionesComponent {
  listCotizaciones: Cotizacion[] = [];
  idCotizacion: string | null;
  cotizacionForm: FormGroup;
  selectedCotizacion: any = null;
  selectedFilter: string = 'cliente';
  searchTerm: string = '';

  currentPage: number = 1;
  itemsPerPage: number = 10;

  cotizacionEnProceso: Cotizacion | null = null;

  formData = {
    tipoComprobante: '',
    serie: '',
    metodoPago: ''
  };

  constructor(
    private _cotizacionService: CotizacionService,
    private toastr: ToastrService,
    private router: Router,
    private aRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.cotizacionForm = this.fb.group({
      estado: ['', Validators.required],
      metodoEntrega: ['', Validators.required]
    });

    this.idCotizacion = this.aRoute.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.obtenerCotizaciones();
  }

  obtenerCotizaciones(): void {
    this._cotizacionService.getAllCotizaciones().subscribe({
      next: (data) => {
        this.listCotizaciones = data.reverse();  // Guardamos las cotizaciones en la lista
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Error al obtener las cotizaciones', 'Error');
      }
    });
  }

  editarCotizacion(cotizacion: any): void {
    this.router.navigate([`/detalle-cotizacion/${cotizacion._id}/editar`]);
  }

  actualizarCotizacion() {
    if (this.cotizacionForm.invalid || !this.idCotizacion) {
      console.warn('Formulario inválido o idCotizacion nulo');
      return;
    }

    const cotizacion: Cotizacion = this.cotizacionForm.value;

    this._cotizacionService.editarCotizacion(this.idCotizacion, cotizacion).subscribe(
      () => {
        this.toastr.info('La cotización fue actualizada exitosamente', 'Cotización actualizada');
        this.cotizacionForm.reset();
        this.idCotizacion = null;
        this.obtenerCotizaciones();
      },
      (error) => {
        console.log(error);
        this.cotizacionForm.reset();
      }
    );
  }

  cotizacionAAnular: any;

  setCotizacionAAnular(cotizacion: any): void {
    this.cotizacionAAnular = cotizacion;
  }

  anularCotizacion(cotizacion: Cotizacion): void {
    const cotizacionActualizada = {
      ...cotizacion,
      estado: 'Anulado'
    };

    this._cotizacionService.editarCotizacion(cotizacion._id!, cotizacionActualizada).subscribe({
      next: () => {
        this.toastr.error('Cotización anulada correctamente', 'Anulado');
        this.obtenerCotizaciones();
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('No se pudo anular la cotización', 'Error');
      }
    });
  }

  cambiarEstado(cotizacion: Cotizacion, nuevoEstado: string): void {
    if (nuevoEstado === 'Confirmada') {
      this.cotizacionEnProceso = cotizacion;

      const modalElement = document.getElementById('modalConfirmacion');
      if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
      }
    } else {
      const cotizacionActualizada = {
        ...cotizacion,
        estado: nuevoEstado
      };

      this._cotizacionService.editarCotizacion(cotizacion._id!, cotizacionActualizada).subscribe({
        next: () => {
          this.toastr.success('Estado actualizado', 'Éxito');
          this.obtenerCotizaciones();
        },
        error: () => {
          this.toastr.error('No se pudo actualizar el estado', 'Error');
        }
      });
    }
  }

  guardarConfirmacion(): void {
    if (!this.cotizacionEnProceso) return;

    const cotizacionActualizada = {
      ...this.cotizacionEnProceso,
      estado: 'Confirmada',
      tipoComprobante: this.formData.tipoComprobante,
      serie: this.formData.serie,
      metodoPago: this.formData.metodoPago
    };

    this._cotizacionService.editarCotizacion(cotizacionActualizada._id!, cotizacionActualizada).subscribe({
      next: () => {
        this.toastr.success('Cotización confirmada correctamente', 'Éxito');

        const modalElement = document.getElementById('modalConfirmacion');
        if (modalElement) {
          const modal = bootstrap.Modal.getInstance(modalElement);
          modal?.hide();
        }

        this.formData = { tipoComprobante: '', serie: '', metodoPago: '' };
        this.obtenerCotizaciones();
      },
      error: () => {
        this.toastr.error('No se pudo confirmar la cotización', 'Error');
      }
    });
  }

onTipoComprobanteChange(): void {
  if (this.formData.tipoComprobante === 'BOLETA DE VENTA ELECTRONICA') {
    this.formData.serie = 'B01';
  } else if (this.formData.tipoComprobante === 'FACTURA DE VENTA ELECTRONICA') {
    this.formData.serie = 'F01';
  } else {
    this.formData.serie = '';
  }
}

  calcularFechaVencimiento(fechaEmision: Date, dias: number): Date {
    const fecha = new Date(fechaEmision);
    fecha.setDate(fecha.getDate() + dias);
    return fecha;
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  get filteredCotizaciones(): Cotizacion[] {
    if (!this.searchTerm.trim()) return this.listCotizaciones;

    const term = this.searchTerm.toLowerCase();
    switch (this.selectedFilter) {
      case 'cliente':
        return this.listCotizaciones.filter((c) =>
          c.cliente?.nombre?.toLowerCase().includes(term)
        );
      case 'fecha':
        return this.listCotizaciones.filter((s) =>
          s.fechaEmision
            ? this.formatDate(s.fechaEmision).includes(term)
            : false
        );
      case 'estado':
        return this.listCotizaciones.filter((c) =>
          c.estado.toLowerCase().includes(term)
        );
      default:
        return this.listCotizaciones;
    }
  }

  get paginatedCotizaciones(): Cotizacion[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredCotizaciones.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredCotizaciones.length / this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
}
