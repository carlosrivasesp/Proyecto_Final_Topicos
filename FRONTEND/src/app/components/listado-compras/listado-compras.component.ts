import { Component } from '@angular/core';
import { Compra } from '../../models/compra';
import { CompraService } from '../../services/compra.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-listado-compras',
  standalone: false,
  templateUrl: './listado-compras.component.html',
  styleUrl: './listado-compras.component.css'
})
export class ListadoComprasComponent {
  listCompras: Compra[] = [];
  idCompra: string | null;
  compraForm: FormGroup;
  selectedCompra: any = null;
  selectedFilter: string = 'proveedor';
  searchTerm: string = '';

  currentPage: number = 1;
  itemsPerPage: number = 10;

  constructor(
    private _compraService: CompraService,
    private toastr: ToastrService,
    private router: Router,
    private aRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.compraForm = this.fb.group({
      tipoComprobante: [''],
      serie: [''],
      nroComprobante: [''],
      fechaEmision: [{ value: '', disabled: true }],
      fechaVenc: [{ value: '', disabled: true }],
      igv: [''],
      total: [''],
      estado: ['', Validators.required],
      moneda: [''],
      tipoCambio: [''],
      proveedor: [''],
      metodoPago: ['', Validators.required],
      detalleC: this.fb.array([]),
    });
    

    this.idCompra = this.aRoute.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.obtenerCompras();
  }

  obtenerCompras(): void {
    this._compraService.getAllCompras().subscribe({
      next: (data) => (this.listCompras = data.reverse()),
      error: (err) => {
        console.error(err);
        this.toastr.error('Error al obtener las compras', 'Error');
      },
    });
  }

  editarCompra(compra: Compra) {
    this.idCompra = compra._id || null;
    this.selectedCompra = `${compra.serie}-${compra.nroComprobante}`;
    this.compraForm.patchValue({
      estado: compra.estado,
      metodoPago: compra.metodoPago,
    });
  }

  actualizarCompra() {
    if (this.compraForm.invalid || !this.idCompra) {
      console.warn('Formulario inválido o idCompra nulo');
      return;
    }

    const compra: Compra = this.compraForm.value;

    this._compraService.editarCompra(this.idCompra, compra).subscribe(
      () => {
        this.toastr.info(
          'El comprobante fue actualizado exitosamente',
          'Compra actualizada'
        );
        this.compraForm.reset();
        this.idCompra = null;
        this.obtenerCompras();
      },
      (error) => {
        console.log(error);
        this.compraForm.reset();
      }
    );
  }

  compraAAnular: any;

  setCompraAAnular(compra: any): void {
    this.compraAAnular = compra;
  }

  anularCompra(compra: Compra): void {
    const compraActualizada = {
      ...compra,
      estado: 'Anulado',
    };

    this._compraService.editarCompra(compra._id!, compraActualizada).subscribe({
      next: () => {
        this.toastr.error('Comprobante anulado correctamente', 'Anulado');
        this.obtenerCompras();
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('No se pudo anular el comprobante', 'Error');
      },
    });
  }

  get filteredCompras(): Compra[] {
    if (!this.searchTerm.trim()) return this.listCompras;

    const term = this.searchTerm.toLowerCase();
    switch (this.selectedFilter) {
      case 'proveedor':
        return this.listCompras.filter((c) =>
          c.proveedor?.nombre?.toLowerCase().includes(term)
        );
      case 'fecha':
        return this.listCompras.filter((s) =>
          s.fechaEmision
            ? this.formatDate(s.fechaEmision).includes(term)
            : false
        );
      case 'estado':
        return this.listCompras.filter((c) =>
          c.estado.toLowerCase().includes(term)
        );
      default:
        return this.listCompras;
    }
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  get paginatedCompras(): Compra[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredCompras.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredCompras.length / this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
}
