import { Component, OnInit } from '@angular/core';
import { Venta } from '../../models/venta';
import { VentaService } from '../../services/venta.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-lista-comprobantes',
  standalone: false,
  templateUrl: './lista-comprobantes.component.html',
  styleUrls: ['./lista-comprobantes.component.css'],
})
export class ListaComprobantesComponent implements OnInit {
  listVentas: Venta[] = [];
  idVenta: string | null;
  ventaForm: FormGroup;
  selectedVenta: any = null;
  selectedFilter: string = 'cliente';
  searchTerm: string = '';

  currentPage: number = 1;
  itemsPerPage: number = 10;

  constructor(
    private _ventaService: VentaService,
    private toastr: ToastrService,
    private router: Router,
    private aRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.ventaForm = this.fb.group({
      tipoComprobante: [''],
      serie: [''],
      nroComprobante: [''],
      fechaEmision: [{ value: '', disabled: true }],
      fechaVenc: [{ value: '', disabled: true }],
      total: [''],
      estado: ['', Validators.required],
      moneda: [''],
      tipoCambio: [''],
      cliente: [''],
      metodoPago: ['', Validators.required],
      detalles: this.fb.array([]),
    });
    
    this.idVenta = this.aRoute.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.obtenerVentas();
  }

  obtenerVentas(): void {
    this._ventaService.getAllVentas().subscribe({
      next: (data) => (this.listVentas = data.reverse()),
      error: (err) => {
        console.error(err);
        this.toastr.error('Error al obtener las ventas', 'Error');
      },
    });
  }

  editarVenta(Venta: Venta) {
    this.idVenta = Venta._id || null;
    this.selectedVenta = `${Venta.serie}-${Venta.nroComprobante}`;
    this.ventaForm.patchValue({
      estado: Venta.estado,
      metodoPago: Venta.metodoPago
    });
  }

  actualizarVenta() {
    if (this.ventaForm.invalid || !this.idVenta) {
      console.warn('Formulario inválido o idVenta nulo');
      return;
    }

    const Venta: Venta = this.ventaForm.value;

    this._ventaService.editarVenta(this.idVenta, Venta).subscribe(data => {
        this.toastr.info(
          'El comprobante fue actualizado exitosamente',
          'Producto actualizado'
        );
        this.ventaForm.reset();
        this.idVenta = null;
        this.obtenerVentas();
      },
      (error) => {
        console.log(error);
        this.ventaForm.reset();
      }
    );
  }

  ventaAAnular: any; 

  setVentaAAnular(venta: any): void {
    this.ventaAAnular = venta;
  }

  anularVenta(venta: Venta): void {  
    const ventaActualizada = {
      ...venta,
      estado: 'Anulado'
    };
  
    this._ventaService.editarVenta(venta._id!, ventaActualizada).subscribe({
      next: () => {
        this.toastr.error('Comprobante anulado correctamente', 'Anulado');
        this.obtenerVentas();
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('No se pudo anular el comprobante', 'Error');
      }
    });
  }

  VentaADevolver: any; 

  setVentaADevolver(venta: any): void {
    this.VentaADevolver = venta;
  }

  devolverVenta(venta: Venta): void {  
    const ventaActualizada = {
      ...venta,
      estado: 'Devolución'
    };
  
    this._ventaService.editarVenta(venta._id!, ventaActualizada).subscribe({
      next: () => {
        this.toastr.info('Comprobante modificado correctamente', 'Devolución');
        this.obtenerVentas();
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('No se pudo modificar el comprobante', 'Error');
      }
    });
  }
  

  get filteredVentas(): Venta[] {
    if (!this.searchTerm.trim()) return this.listVentas;

    const term = this.searchTerm.toLowerCase();
    switch (this.selectedFilter) {
      case 'cliente':
        return this.listVentas.filter((v) =>
          v.cliente?.nombre?.toLowerCase().includes(term)
        );
      case 'fecha':
        return this.listVentas.filter((s) =>
          s.fechaEmision
            ? this.formatDate(s.fechaEmision).includes(term)
            : false
        );
      case 'estado':
        return this.listVentas.filter((v) =>
          v.estado.toLowerCase().includes(term)
        );
      default:
        return this.listVentas;
    }
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  get paginatedVentas(): Venta[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredVentas.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredVentas.length / this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
}
