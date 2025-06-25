import { Component, OnInit, PLATFORM_ID, Inject, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto';
import { forkJoin } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Cliente } from '../../models/cliente';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ClienteService } from '../../services/cliente.service';
import { CotizacionService } from '../../services/cotizacion.service';  // Importa el servicio

export interface ElementoRegistrado {
  codigo: string;
  nombre: string;
  cant: number;
  precio: number;
  subtotal: number;
}

interface ListaUnificada {
  codigo: string;
  tipo: 'producto';
  nombre: string;
  valor: number;
}

@Component({
  selector: 'app-cotizaciones',
  standalone: false,
  templateUrl: './cotizaciones.component.html',
  styleUrls: ['./cotizaciones.component.css']
})
export class CotizacionesComponent implements OnInit {

  listaProducto_Lugar: ListaUnificada[] = [];
  elementosRegistrados: ElementoRegistrado[] = [];
  elementoSeleccionado: ListaUnificada | null = null;

  currentDateTime: string = '';
  searchTerm: string = '';

  precioSeleccionado: number = 0;
  cantidad: number = 1;
  subtotal: number = 0;
  total: number = 0.0;
  igv: number = 0.0;
  totalConIGV: number = 0.0;
  moneda: string = 'S/';
  tipoCambio: number = 3.66;

  listClientes: Cliente[] = [];
  clienteForm: FormGroup;

  clienteSearchTerm: string = '';
  clienteSeleccionado: Cliente | null = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private _productoService: ProductoService,
    private fb: FormBuilder, private router: Router, private toastr: ToastrService, private _clienteService: ClienteService,
    private cotizacionService: CotizacionService,
    private cdr: ChangeDetectorRef
  ) {
    this.clienteForm = this.fb.group({
      nombre: ['', Validators.required],
      tipoDoc: ['', Validators.required],
      nroDoc: ['', Validators.required],
      telefono: ['', Validators.required],
      correo: ['', Validators.required],
      estado: ['Activo']
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.updateDateTime();
      setInterval(() => this.updateDateTime(), 1000);
    }
    this.obtenerDatos();
    this.obtenerClientes();
  }

  obtenerDatos(): void {
    forkJoin({
      productos: this._productoService.getAllProductos()
    }).subscribe(({ productos }) => {
      const productosTransformados = productos.map((p: Producto) => ({
        ...p,
        tipo: 'producto',
        codigo: p.codInt,
        nombre: p.nombre,
        valor: p.precio
      }));
      this.listaProducto_Lugar = productosTransformados;
    }, error => {
      console.error('Error al obtener productos:', error);
    });
  }

  obtenerClientes() {
    this._clienteService.getAllClientes().subscribe(data => {
      this.listClientes = data;
    }, error => {
      console.log(error);
    })
  }

  registrarCliente() {
    const CLIENTE: Cliente = {
      nombre: this.clienteForm.get('nombre')?.value,
      tipoDoc: this.clienteForm.get('tipoDoc')?.value,
      nroDoc: this.clienteForm.get('nroDoc')?.value,
      telefono: this.clienteForm.get('telefono')?.value,
      correo: this.clienteForm.get('correo')?.value,
      estado: this.clienteForm.get('estado')?.value
    };
    this._clienteService.guardarCliente(CLIENTE).subscribe(data => {
      this.toastr.success('El Cliente fue registrado exitosamente', 'Cliente registrado');
      this.router.navigate(['/new-cotizaciones']);
      this.obtenerClientes();
    }, error => {
      console.log(error);
      this.clienteForm.reset();
    });
  }

  get filteredDatos(): ListaUnificada[] {
    if (!this.searchTerm.trim()) {
      return [];
    }

    const term = this.searchTerm.trim().toLowerCase();
    return this.listaProducto_Lugar.filter(p =>
      p.nombre.toLowerCase().startsWith(term) ||
      p.codigo.toString().startsWith(term)
    );
  }

  get filteredClientes(): Cliente[] {
    if (!this.clienteSearchTerm.trim()) {
      return [];
    }
    const term = this.clienteSearchTerm.trim().toLowerCase();
    return this.listClientes.filter(p =>
      p.nombre.toLowerCase().startsWith(term) ||
      p.nroDoc.toLowerCase().startsWith(term)
    );
  }

  onSelectCliente(cliente: Cliente): void {
    this.clienteSearchTerm = `${cliente.nroDoc} - ${cliente.nombre}`;
    this.clienteSeleccionado = cliente;

    const dropdownInput = document.getElementById('dropdownCliente');
    if (dropdownInput && (window as any).bootstrap) {
      const dropdownInstance = new (window as any).bootstrap.Dropdown(dropdownInput);
      dropdownInstance.hide();
    }
  }

  onClienteInputChange(valor: string): void {
    if (!valor.trim()) {
      this.clienteSeleccionado = null;
    }
  }

  clearClienteSearch(): void {
    this.clienteSearchTerm = '';
    this.clienteSeleccionado = null;
  }

  onSelectElement(element: ListaUnificada): void {
    this.searchTerm = `${element.codigo}-${element.nombre}`;
    this.elementoSeleccionado = element;
    this.precioSeleccionado = element.valor;
    this.onValueSubTotal();

    const dropdownInput = document.getElementById('dropdownInput');
    if (dropdownInput && (window as any).bootstrap) {
      const dropdownInstance = new (window as any).bootstrap.Dropdown(dropdownInput);
      dropdownInstance.hide();
    }
  }

  onElementChange(valor: string): void {
    if (!valor.trim()) {
      this.precioSeleccionado = 0;
      this.subtotal = 0;
      this.cantidad = 1;
    }
  }

  clearSearch() {
    this.searchTerm = '';
    this.precioSeleccionado = 0;
    this.elementoSeleccionado = null;
    this.subtotal = 0;
    this.cantidad = 1;
  }

  resetFormulario(): void {
    this.clienteForm.reset();
  }

  onValueSubTotal(): void {
    this.subtotal = parseFloat((this.precioSeleccionado * this.cantidad).toFixed(2));
  }

  onRegisterElement(): void {
  if (!this.elementoSeleccionado) return;

  const element = this.elementoSeleccionado;

  // Verifica si el producto ya está registrado
  const existente = this.elementosRegistrados.find(e => e.codigo === element.codigo);

  if (existente) {
    // Si ya existe, suma la cantidad y actualiza el subtotal
    existente.cant += this.cantidad;
    existente.subtotal = parseFloat((existente.cant * existente.precio).toFixed(2));
  } else {
    // Si no existe, agrega nuevo elemento
    const nuevoElemento: ElementoRegistrado = {
      codigo: element.codigo,
      nombre: element.nombre,
      cant: this.cantidad,
      precio: element.valor,
      subtotal: parseFloat((this.cantidad * element.valor).toFixed(2))
    };

    this.elementosRegistrados.push(nuevoElemento);
  }

  this.calcularTotales();  // Actualiza totales generales
  this.clearSearch();      // Limpia inputs

  // Cierra dropdown si está abierto
  const dropdownInput = document.getElementById('dropdownInput');
  if (dropdownInput && (window as any).bootstrap) {
    const dropdownInstance = new (window as any).bootstrap.Dropdown(dropdownInput);
    dropdownInstance.hide();
  }
}

  calcularTotales(): void {
  this.total = this.elementosRegistrados.reduce((acc, item) => acc + item.subtotal, 0);
  this.total = parseFloat(this.total.toFixed(2)); 
  this.igv = parseFloat((this.total * 0.18).toFixed(2));
  this.totalConIGV = parseFloat((this.total + this.igv).toFixed(2));
  }

// Método para enviar la cotización al backend
onGenerarCotizacion(): void {
  if (this.elementosRegistrados.length === 0) {
      this.toastr.error('No hay productos registrados', 'Error');
      return;
  }

  if (!this.clienteSeleccionado) {
      this.toastr.error('Debe seleccionar un cliente', 'Error');
      return;
  }

  if (!this.clienteSeleccionado._id) {
      this.toastr.error('Cliente seleccionado no válido', 'Error');
      return;
  }

// Cuerpo de la cotización que se enviará al backend
const cotizacion = {
  cliente: this.clienteSeleccionado,
  contacto: this.clienteSeleccionado.nombre,
  telefono: this.clienteSeleccionado.telefono, 
  fechaEmision: new Date(),
  fechaVenc: new Date(),
  moneda: this.moneda,
  tipoCambio: this.tipoCambio,
  tiempoValidez: 15,
  igv: this.igv,
  total: this.total,
  estado: 'Pendiente',
  detalleC: this.elementosRegistrados.map(p => ({
      nombre: p.nombre,
      cantidad: p.cant,
      precio: p.precio,
      subtotal: p.subtotal
  }))
};

// Verifica el objeto antes de enviarlo
console.log('Cotización a enviar:', cotizacion);

// Enviar la solicitud al backend
this.cotizacionService.registrarCotizacion(cotizacion).subscribe(
    response => {
        this.toastr.success('Cotización registrada correctamente', 'Éxito');
        this.elementosRegistrados = [];
        this.total = 0;

      this.router.navigate(['/lista-cotizaciones']);

    },
    error => {
        this.toastr.error('Error al registrar cotización', 'Error');
        console.error(error);
        
    }
);
}

  private updateDateTime(): void {
    const now = new Date();
    this.currentDateTime = now.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    });
  }

  aumentarCantidad(item: ElementoRegistrado): void {
    item.cant++;
    item.subtotal = item.cant * item.precio;
    this.calcularTotales();
  }

  disminuirCantidad(item: ElementoRegistrado): void {
    if (item.cant > 1) {
      item.cant--;
      item.subtotal = item.cant * item.precio;
      this.calcularTotales();
    } else {
      this.toastr.info('La cantidad mínima es 1');
    }
  }
  actualizarSubtotal(p: any): void {
    if(p.cant<=0){
        this.toastr.info('La cantidad mínima es 1');
        p.cant=1;
    }
    p.subtotal = p.cant * p.precio;
    this.calcularTotales();
  }


  eliminarElemento(codigo: string): void {
      this.elementosRegistrados = this.elementosRegistrados.filter(e => e.codigo !== codigo);
      this.total = this.elementosRegistrados.reduce((sum, el) => sum + el.subtotal, 0);
      this.calcularTotales();
      this.cdr.detectChanges();
  }

  itemsPerPage = 5; // filas por página
  currentPage = 1;

  get paginatedDetalles(): ElementoRegistrado[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.elementosRegistrados.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.elementosRegistrados.length / this.itemsPerPage);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
}
