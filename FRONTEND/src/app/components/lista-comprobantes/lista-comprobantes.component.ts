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
  enviarForm: FormGroup;
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

    this.enviarForm = this.fb.group({
      nombreCliente: ['', Validators.required],
      celular: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
    });
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
this.selectedVenta = `${Venta.serie}-${Venta.nroComprobante}`; // Usar comillas invertidas ` `
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
      default:
        return this.listVentas;
    }
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
    const year = d.getFullYear();
return `${day}/${month}/${year}`; // Usar comillas invertidas ` `
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

  ventaParaEnviarId: string | null = null;

  abrirModalEnviar(venta: Venta): void {
    this.ventaParaEnviarId = venta._id || null;
    this.enviarForm.patchValue({
      nombreCliente: venta.cliente?.nombre || '',
      celular: venta.cliente?.telefono || '',
    });
  }

  enviar(): void {
    if (this.enviarForm.invalid || !this.ventaParaEnviarId) {
      this.toastr.warning('Completa correctamente el formulario');
      return;
    }

    const { nombreCliente, celular } = this.enviarForm.value;

    this._ventaService
      .enviarComprobante(this.ventaParaEnviarId, nombreCliente, celular)
      .subscribe({
        next: (res: any) => {
          this.toastr.success(res.mensaje || 'Comprobante enviado por WhatsApp');
          this.enviarForm.reset();
          this.ventaParaEnviarId = null;
        },
        error: (err) => {
          console.error(err);
          this.toastr.error(err.error?.mensaje || 'Error al enviar comprobante');
        },
      });
  }
}