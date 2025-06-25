import { Component, OnInit, PLATFORM_ID, Inject, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto';
import { Lugar } from '../../models/lugar';
import { LugarService } from '../../services/lugar.service';
import { forkJoin } from 'rxjs';
import { FormBuilder, FormGroup, NgModel, Validators } from '@angular/forms';
import { Cliente } from '../../models/cliente';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ClienteService } from '../../services/cliente.service';
import { Venta } from '../../models/venta';
import { VentaService } from '../../services/venta.service';
import { Categoria } from '../../models/categoria';
import { Marca } from '../../models/marca';
import { DetalleVenta } from '../../models/detalleV';


interface ElementoRegistrado {
  codigo: string;
  nombre: string;
  cant: number;
  precio: number;
  subtotal: number;
}

interface ListaUnificada {
  _id: string;
  codigo: string;
  tipo: 'producto' | 'lugar';
  nombre: string;
  valor: number;
}

type listaSeries = "BOLETA DE VENTA ELECTRONICA" | "FACTURA DE VENTA ELECTRONICA"


@Component({
  selector: 'app-venta',
  standalone: false,
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css']
})

export class VentaComponent implements OnInit {

  listaProducto_Lugar: ListaUnificada[] = [];
  listaProductos: Producto[] = [];
  listaLugares: Lugar[] = [];

  elementosRegistrados: ElementoRegistrado[] = [];
  elementoSeleccionado: ListaUnificada | null = null;

  currentDateTime: string = '';
  searchTerm: string = '';

  LugarSeleccionado: boolean = false;
  precioSeleccionado: number = 0;
  cantidad: number = 1;
  subtotal: number = 0;
  total: number = 0.0;
  igv: number = 0.0;
  serie: string = "B01";

  listClientes: Cliente[] = [];
  clienteForm: FormGroup;
  ventaForm: FormGroup;

  clienteSearchTerm: string = '';
  clienteSeleccionado: Cliente | null = null;


  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private _productoService: ProductoService,
    private _lugarService: LugarService, private fb: FormBuilder, private router: Router, private toastr: ToastrService, private _clienteService: ClienteService, private aRoute: ActivatedRoute,
    private _ventaService: VentaService,
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

    this.ventaForm = this.fb.group({
      serie: ['B01', Validators.required],
      nroComprobante: [''],
      fechaEmision: [this.getTodayString(), Validators.required],
      tipoComprobante: ['BOLETA DE VENTA ELECTRONICA', Validators.required],
      fechaVenc: [this.getTodayString(), Validators.required],
      total: ['', Validators.required],
      estado: ['Pendiente', Validators.required],
      moneda: ['S/', Validators.required],
      tipoCambio: ['3.66', Validators.required],
      cliente: ['', Validators.required],
      metodoPago: ['', Validators.required],
      detalles: this.fb.array([]),
    })
  }
  onSelectSerie(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;

    if (selectElement) {
      const selectedValue = selectElement.value as listaSeries;

      if (selectedValue === "BOLETA DE VENTA ELECTRONICA") {
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

  crearVenta(): void {
    if (!this.clienteSeleccionado || this.elementosRegistrados.length === 0) {
      this.toastr.error('Debe seleccionar un cliente y agregar al menos un producto.', 'Error');
      return;
    }
    const form = this.ventaForm.value;
    console.log('Cliente del formulario', form.cliente);

    const lugarEncontrado = this.elementosRegistrados
      .map(l => {
        const lugarUnificado = this.listaProducto_Lugar.find(e => e.codigo === l.codigo && e.tipo === 'lugar');
        if (!lugarUnificado) return null;

        const lugar = this.listaLugares.find(l => l.codigo === lugarUnificado.codigo);
        if (!lugar) return null;
        return lugar;
      })
      .find((l): l is Lugar => !!l);
    console.log("LUGAR: ", lugarEncontrado);


    const detalles: DetalleVenta[] = this.elementosRegistrados.map(item => {
      const prodUnificado = this.listaProducto_Lugar.find(p => p.codigo === item.codigo && p.tipo === 'producto');
      if (!prodUnificado) return null;

      const producto = this.listaProductos.find(p => p.codInt === prodUnificado.codigo);
      if (!producto) return null;

      return new DetalleVenta(
        {} as any,
        producto,
        lugarEncontrado!,
        producto.codInt,
        producto.nombre,
        item.cant,
        producto.precio,
        lugarEncontrado?.codigo || '',
        lugarEncontrado?.distrito || '',
        lugarEncontrado?.costo || 0,
        producto.precio * item.cant
      );
    }).filter((p): p is DetalleVenta => p !== null);


    const nuevaventa = new Venta(
      form.serie,
      form.nroComprobante,
      new Date(),
      new Date(),
      form.tipoComprobante,
      this.total,
      form.estado,
      form.moneda,
      form.tipoCambio,
      form.cliente,
      form.metodoPago,
      detalles,
      lugarEncontrado,
    );

    console.log(nuevaventa);
    (nuevaventa as any).lugarId = lugarEncontrado?._id;


    this._ventaService.registrarVenta(nuevaventa).subscribe({
      next: (respuesta) => {
        this.toastr.success('Venta registrada correctamente', 'Éxito');
        this.router.navigate(['/comprobantes']);
      },
      error: (err) => {
        console.error('Error al registrar la venta', err);
        this.toastr.error('Hubo un error al registrar la venta', 'Error');
      }
    });
  }


  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.updateDateTime();
      setInterval(() => this.updateDateTime(), 1000);
    }
    this.obtenerDatos();
    this.obtenerClientes();
    this.obtenerLugares();
    this.obtenerProductos();

    const modalElement = document.getElementById('modalAdd');
    if (modalElement) {
      modalElement.addEventListener('hidden.bs.modal', () => {
        this.clearSearch();
      });
    }
  }


  obtenerDatos(): void {
    forkJoin({ //espera varias peticiones al mismot tiempo
      productos: this._productoService.getAllProductos(), //get de todos los productos
      lugares: this._lugarService.getAllLugares() //get de todos los lugares
    }).subscribe(({ productos, lugares }) => {
      const productosTransformados = productos.map((p: Producto) => ({ //tranforma a productos
        ...p, //conserva los datos originales
        _id: p._id,
        tipo: 'producto',
        codigo: p.codInt,
        nombre: p.nombre,
        valor: p.precio,
        stockActual: p.stockActual
        //se asigna cada valor del producto a los atributos de la interface 
      }));
      const lugaresTransformados = lugares.map((l: Lugar) => ({
        ...l,
        _id: l._id,
        tipo: 'lugar',
        codigo: l.codigo,
        nombre: l.distrito,
        valor: l.costo
      }));
      this.listaProducto_Lugar = [...productosTransformados, ...lugaresTransformados]; //unifica las listas
      //... copia todas las propiedades del objeto
    }, error => {
      console.error('Error al obtener productos y lugares:', error);
    });
  }
  obtenerProductos() {
    this._productoService.getAllProductos().subscribe(data => {
      this.listaProductos = data;
    }, error => {
      console.log(error);
    })
  }
  obtenerLugares() {
    this._lugarService.getAllLugares().subscribe(data => {
      this.listaLugares = data;
    }, error => {
      console.log(error);
    })
  }

  obtenerClientes() {
    this._clienteService.getAllClientes().subscribe(data => {
      console.log(data);
      this.listClientes = data;
    }, error => {
      console.log(error);
    })
  }

  registrarCliente() {
    console.log(this.clienteForm);

    const CLIENTE: Cliente = {
      nombre: this.clienteForm.get('nombre')?.value,
      tipoDoc: this.clienteForm.get('tipoDoc')?.value,
      nroDoc: this.clienteForm.get('nroDoc')?.value,
      telefono: this.clienteForm.get('telefono')?.value,
      correo: this.clienteForm.get('correo')?.value,
      estado: this.clienteForm.get('estado')?.value,
    }
    console.log('Cliente que se enviará:', CLIENTE);
    this._clienteService.guardarCliente(CLIENTE).subscribe(data => {
      console.log('Cliente guardado:', data);
      this.toastr.success('El Cliente fue registrado exitosamente', 'Cliente registrado');
      this.router.navigate(['/ventas'])
      this.obtenerClientes();
      this.resetFormulario();
    }, error => {
      console.log(error);
      this.clienteForm.reset();
    });
  }

  //Filtar productos con una busqueda en vivo
  get filteredDatos(): ListaUnificada[] {
    if (!this.searchTerm.trim()) return [];

    const term = this.searchTerm.trim().toLowerCase();

    return this.listaProducto_Lugar.filter(p => {
      const coincideNombre = p.nombre.toLowerCase().startsWith(term);
      const coincideCodigo = p.codigo.toString().startsWith(term);

      if (p.tipo === 'producto') {
        const producto = this.listaProductos.find(prod => prod.codInt === p.codigo);
        return producto && producto.stockActual > 0 && (coincideNombre || coincideCodigo);
      }

      // Si es lugar, siempre incluirlo si coincide
      return coincideNombre || coincideCodigo;
    });
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
    this.ventaForm.controls['cliente'].setValue(cliente._id);
    console.log('Cliente seleccionado:', this.ventaForm.controls['cliente'].value)


    // Cierra el dropdown (opcional si usas Bootstrap)
    const dropdownInput = document.getElementById('dropdownClientes');
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
  resetFormulario() {
    this.clienteForm.reset(); // Esto limpia todos los campos
  }
  //Seleccionar producto
  onSelectElement(element: ListaUnificada): void {
    this.searchTerm = `${element.codigo}-${element.nombre}`;
    this.elementoSeleccionado = element; //guarda el elemento
    this.precioSeleccionado = element.valor;

    if (element.tipo === "lugar") {
      this.LugarSeleccionado = true; //bandera para desactivar el input de cantidad en el modal
      this.cantidad = 1; //la cantidad del lugar solo puede ser 1
    }

    // Calcular subtotal
    this.onValueSubTotal();

    // Cerrar el dropdown (si existe)
    const dropdownInput = document.getElementById('dropdownInput');
    if (dropdownInput && (window as any).bootstrap) {
      const dropdownInstance = new (window as any).bootstrap.Dropdown(dropdownInput);
      dropdownInstance.hide(); // Cerrar el dropdown
    }
  }


  //Reestablecer valores si no hay ningun valor en el buscador
  onElementChange(valor: string): void {
    if (!valor.trim()) {
      this.precioSeleccionado = 0;
      this.subtotal = 0;
      this.cantidad = 1;
      this.LugarSeleccionado = false;
    }
  }

  //Reestablece valores si se cierra el buscador
  clearSearch() {
    this.searchTerm = '';
    this.precioSeleccionado = 0;
    this.elementoSeleccionado = null;
    this.subtotal = 0;
    this.cantidad = 1
    this.LugarSeleccionado = false;

  }

  //calcula el subtotal de cada elemento
  onValueSubTotal(): void {
    this.subtotal = parseFloat((this.precioSeleccionado * this.cantidad).toFixed(2));
  }

  //registra el elemento
  onRegisterElement(): void {
    if (!this.elementoSeleccionado) return;

    const element = this.elementoSeleccionado;

    // Si es un producto
    if (element.tipo === 'producto') {
      const productoExistente = this.elementosRegistrados.find(p => p.codigo === element.codigo);

      if (productoExistente) {
        productoExistente.cant += this.cantidad;
        productoExistente.subtotal = productoExistente.cant * productoExistente.precio;
      } else {
        this.elementosRegistrados.push({
          codigo: element.codigo,
          nombre: element.nombre,
          cant: this.cantidad,
          precio: element.valor,
          subtotal: this.cantidad * element.valor
        });
      }

      // Si es un lugar
    } else {
      const yaExiste = this.elementosRegistrados.some(p => p.codigo === element.codigo);
      if (yaExiste) {
        this.toastr.warning('Este lugar ya fue agregado.', 'Advertencia');
        return;
      }

      this.elementosRegistrados.push({
        codigo: element.codigo,
        nombre: element.nombre,
        cant: 1,
        precio: element.valor,
        subtotal: element.valor
      });
    }

    // Recalcular IGV y total
    const nuevoSubtotal = this.elementosRegistrados.reduce((acc, el) => acc + el.subtotal, 0);
    this.igv = parseFloat((nuevoSubtotal * 0.18).toFixed(2));
    this.total = parseFloat((nuevoSubtotal + this.igv).toFixed(2));

    this.clearSearch();
  }

  private updateDateTime(): void {
    const now = new Date();
    this.currentDateTime = now.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    });
  }
  private getTodayString(): string {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');  // Añade un cero al inicio si el día es menor a 10
    const month = String(today.getMonth() + 1).padStart(2, '0');  // `getMonth()` es cero-indexado, por eso sumamos 1
    const year = today.getFullYear();

    return `${day}/${month}/${year}`;  // DD-MM-YYYY
  }

  private actualizarTotalYIgv(): void {
    const subtotalTotal = this.elementosRegistrados.reduce((sum, el) => sum + el.subtotal, 0);
    
    this.igv = parseFloat((subtotalTotal * 0.18).toFixed(2));

    this.total = parseFloat((subtotalTotal + this.igv).toFixed(2));

    this.ventaForm.patchValue({ total: this.total, igv: this.igv });
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
