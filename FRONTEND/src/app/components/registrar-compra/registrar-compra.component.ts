import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Proveedor } from '../../models/proveedor';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProveedorService } from '../../services/proveedor.service';
import { CompraService } from '../../services/compra.service';
import { Compra } from '../../models/compra';

interface ElementoRegistrado {
  producto: Producto;
  codigo: string;
  nombre: string;
  cant: number;
  precio: number;
  subtotal: number;
}

type listaSeries = "BOLETA DE COMPRA ELECTRONICA" | "FACTURA DE COMPRA ELECTRONICA"

@Component({
  selector: 'app-registrar-compra',
  standalone: false,
  templateUrl: './registrar-compra.component.html',
  styleUrl: './registrar-compra.component.css'
})
export class RegistrarCompraComponent {

  listaProducto: Producto[] = [];
  elementosRegistrados: ElementoRegistrado[] = [];
  elementoSeleccionado: Producto | null = null;

  currentDateTime: string = '';
  searchTerm: string = '';

  precioSeleccionado: number = 0;
  cantidad: number = 1;
  subtotal: number = 0;
  igv: number = 0.0;
  total: number = 0.0;

  listProveedores: Proveedor[] = [];
  proveedorForm: FormGroup;
  compraForm: FormGroup;

  proveedorSearchTerm: string = '';
  proveedorSeleccionado: Proveedor | null = null;
  selectedProveedor: any = null;

  serie: string = "B01";

  constructor(
    private _productoService: ProductoService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private _proveedorService: ProveedorService,
    private aRoute: ActivatedRoute,
    private _compraService: CompraService,
    private cdr: ChangeDetectorRef
  ) {
    this.proveedorForm = this.fb.group({
      nombre: ['', Validators.required],
      tipoDoc: ['', Validators.required],
      nroDoc: ['', Validators.required],
      telefono: [{ value: '', disabled: true }, Validators.required],
      correo: [{ value: '', disabled: true }, Validators.required]
    });

    this.compraForm = this.fb.group({
      tipoComprobante: ['BOLETA DE COMPRA ELECTRONICA', Validators.required],
      serie: ['B01', Validators.required ],
      nroComprobante: [''],
      fechaEmision: [ this.getTodayString(), Validators.required ],
      fechaVenc: [ this.getTodayString(), Validators.required ],
      total: ['', Validators.required],
      estado: ['Pendiente', Validators.required],
      moneda: ['S/', Validators.required],
      tipoCambio: ['3.66', Validators.required],
      proveedor: ['', Validators.required],
      igv: ['', Validators.required],
      metodoPago: ['', Validators.required],
      detalleC: this.fb.array([]),
    })
  }

  ngOnInit(): void {
    this.obtenerDatos();
    this.obtenerProveedores();

    this.compraForm.get('proveedor')?.valueChanges.subscribe(value => {
      if (typeof value === 'string') {
        this.proveedorSearchTerm = value;
      } else {
        this.proveedorSearchTerm = '';
      }
    });
  }

  onSelectSerie(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;

    if (selectElement) {
      const selectedValue = selectElement.value as listaSeries;

      if (selectedValue === "BOLETA DE COMPRA ELECTRONICA") {
        this.serie = "B01";
      } else {
        this.serie = "F01";
      }

      const dropdownInput = document.getElementById('dropdownInput');
      if (dropdownInput && (window as any).bootstrap) {
        const dropdownInstance = new (window as any).bootstrap.Dropdown(dropdownInput);
        dropdownInstance.hide();
      }
    }
  }

  registrarCompra() {
    if (!this.selectedProveedor) {
      console.log(this.selectedProveedor);
      console.log('Formulario:', this.compraForm.value);
      return;
    }
    
    const form = this.compraForm.value;
    console.log('Proveedor del formulario:', form.proveedor);

    const productos = this.elementosRegistrados.map(item => ({
      compraId: '',
      producto: item.producto, 
      codInt: item.codigo,
      nombre: item.nombre,
      cantidad: item.cant,
      precio: item.precio,
      subtotal: item.subtotal
    }));
  
    const nuevaCompra = {
      serie: form.serie,
      nroComprobante: form.nroComprobante,
      fechaEmision: new Date(),
      fechaVenc: new Date(),
      tipoComprobante: form.tipoComprobante,
      igv: this.igv,
      total: this.total,
      estado: form.estado,
      moneda: form.moneda,
      tipoCambio: form.tipoCambio,
      proveedor: form.proveedor,
      metodoPago: form.metodoPago,
      detalleC: productos 
    };
    console.log(nuevaCompra);  // Esto te permitirá ver el objeto completo que estás enviando

    // Llamamos al servicio para registrar la compra
    this._compraService.registrarCompra(nuevaCompra).subscribe(() => {
      this.toastr.success('Compra registrada correctamente');
      this.router.navigate(['/listado-compras']);
    }, error => {
      console.error('Error al registrar compra:', error);
      this.toastr.error('Error al registrar la compra');
    });
  }

  obtenerDatos(): void {
    this._productoService.getAllProductos().subscribe((productos: Producto[]) => {
        this.listaProducto = productos;
      }, error => {
      console.error('Error al obtener productos:', error);
    });
  }
  

  obtenerProveedores() {
    this._proveedorService.getAllProveedores().subscribe(data => {
      this.listProveedores = data;
    }, error => {
      console.log(error);
    });
  }

  registrarProveedor() {
    const PROVEEDOR: Proveedor = {
      nombre: this.proveedorForm.get('nombre')?.value,
      tipoDoc: this.proveedorForm.get('tipoDoc')?.value,
      nroDoc: this.proveedorForm.get('nroDoc')?.value,
      telefono: this.proveedorForm.get('telefono')?.value,
      correo: this.proveedorForm.get('correo')?.value,
      estado: this.proveedorForm.get('estado')?.value,
    };

    this._proveedorService.guardarProveedor(PROVEEDOR).subscribe(data => {
      this.toastr.success('El Proveedor fue registrado exitosamente', 'Proveedor registrado');
      this.router.navigate(['/compras']);
      this.obtenerProveedores();
    }, error => {
      console.log(error);
      this.proveedorForm.reset();
    });
  }

  get filteredDatos(): Producto[] {
    if (!this.searchTerm.trim()) return [];
    const term = this.searchTerm.trim().toLowerCase();
    return this.listaProducto.filter(p =>
      p.nombre.toLowerCase().startsWith(term) ||
      p.codInt.toLowerCase().startsWith(term)
    );
  }

  get filteredProveedores() {
    const term = (this.proveedorSearchTerm || '').toLowerCase().trim();
    return this.listProveedores.filter(p =>
      p.nroDoc.toLowerCase().startsWith(term) ||
      p.nombre.toLowerCase().startsWith(term)
    );
  }
  

  onSelectProveedor(proveedor: Proveedor) {
  this.selectedProveedor = proveedor;

  if (!proveedor._id) {
    this.toastr.error('El proveedor seleccionado no tiene ID válido.');
    return;
  }

  console.log('ID proveedor enviado:', proveedor._id);

  this.compraForm.controls['proveedor'].setValue(proveedor._id);
  // Establecemos solo el ObjectId en el formulario
  this.proveedorSearchTerm = proveedor.nroDoc + ' - ' + proveedor.nombre
  console.log('Proveedor seleccionado en el formulario:', this.compraForm.controls['proveedor'].value);

  // Limpiar productos actuales y selección
  this.listaProducto = [];
  this.searchTerm = '';
  this.elementoSeleccionado = null;
  this.precioSeleccionado = 0;
  this.subtotal = 0;
  this.cantidad = 1;

  // Llamar al servicio para obtener productos por proveedor
  this._productoService.getProductosPorProveedorSinStock(proveedor._id).subscribe(
    (productos: Producto[]) => {
      this.listaProducto = productos;
      if (productos.length === 0) {
      this.toastr.info('No hay productos para este proveedor');
      } else {
        this.elementosRegistrados = productos.map(p => ({
          producto: p,
          codigo: p.codInt,
          nombre: p.nombre,
          cant: 30,
          precio: p.precio,
          subtotal: parseFloat((p.precio * 30).toFixed(2))
        }));
        this.actualizarTotalYIgv();
      }
    },
    error => {
      console.error('Error al obtener productos por proveedor:', error);
      this.toastr.error('Error al obtener productos por proveedor');
    }
  );

  // 🔹 Llamada para llenar el autocompletado con todos los productos del proveedor
  this._productoService.getProductosPorProveedor(proveedor._id).subscribe(
    (productos: Producto[]) => {
      this.listaProducto = productos;
    },
    error => {
      console.error('Error al obtener todos los productos:', error);
      this.toastr.error('Error al cargar productos del proveedor');
    }
  );
  }  

  onProveedorInputChange(valor: any) {
    if (typeof valor === 'string') {
      this.proveedorSearchTerm = valor;
    } else {
      this.proveedorSearchTerm = '';
    }
  }  

  clearProveedorSearch(): void {
    this.proveedorSearchTerm = '';
    this.proveedorSeleccionado = null;
  }

  resetFormulario() {
    this.proveedorForm.reset();
  }

  onSelectElement(producto: Producto): void {
    this.searchTerm = `${producto.codInt} - ${producto.nombre}`;
    this.elementoSeleccionado = producto;
    this.precioSeleccionado = producto.precio;
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

  onValueSubTotal(): void {
    this.subtotal = parseFloat((this.precioSeleccionado * this.cantidad).toFixed(2));
    this.actualizarTotalYIgv();
  }

  private actualizarTotalYIgv(): void {
    const subtotalTotal = this.elementosRegistrados.reduce((sum, el) => sum + el.subtotal, 0);
    
    this.igv = parseFloat((subtotalTotal * 0.18).toFixed(2));

    this.total = parseFloat((subtotalTotal + this.igv).toFixed(2));

    this.compraForm.patchValue({ total: this.total, igv: this.igv });
  }

  onRegisterElement(): void {
    if (!this.elementoSeleccionado) return;

    const { codInt, nombre, precio } = this.elementoSeleccionado;

  // Buscar si ya existe en la lista
  const existente = this.elementosRegistrados.find(e => e.codigo === codInt);

  if (existente) {
    // Sumar cantidad y actualizar subtotal
    existente.cant += this.cantidad;
    existente.subtotal = existente.cant * precio;
  } else {
    // Agregar nuevo si no existe
    const nuevoElemento: ElementoRegistrado = {
      producto: this.elementoSeleccionado,
      codigo: codInt,
      nombre,
      cant: this.cantidad,
      precio,
      subtotal: this.cantidad * precio
    };
    this.elementosRegistrados.push(nuevoElemento);
  }
    console.log('Elementos registrados:', this.elementosRegistrados);
    this.total = this.elementosRegistrados.reduce((sum, el) => sum + el.subtotal, 0);
    this.actualizarTotalYIgv();  // Aseguramos que el IGV y total se actualicen cada vez que se agrega un producto

    this.clearSearch();
    this.cdr.detectChanges();
  }

  aumentarCantidad(item: ElementoRegistrado): void {
    item.cant++;
    item.subtotal = item.cant * item.precio;
    this.actualizarTotalYIgv();
  }

  disminuirCantidad(item: ElementoRegistrado): void {
    if (item.cant > 1) {
      item.cant--;
      item.subtotal = item.cant * item.precio;
      this.actualizarTotalYIgv();
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
    this.actualizarTotalYIgv();
  }

  eliminarElemento(codigo: string): void {
      this.elementosRegistrados = this.elementosRegistrados.filter(e => e.codigo !== codigo);
      this.total = this.elementosRegistrados.reduce((sum, el) => sum + el.subtotal, 0);
      this.actualizarTotalYIgv();
      this.cdr.detectChanges();
  }

  private getTodayString(): string {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');  // Añade un cero al inicio si el día es menor a 10
    const month = String(today.getMonth() + 1).padStart(2, '0');  // `getMonth()` es cero-indexado, por eso sumamos 1
    const year = today.getFullYear();
    
    return `${day}/${month}/${year}`;  // DD-MM-YYYY
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
