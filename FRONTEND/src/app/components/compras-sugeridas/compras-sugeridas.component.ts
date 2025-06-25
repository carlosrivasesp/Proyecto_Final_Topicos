import { Component } from '@angular/core';
import { Producto } from '../../models/producto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductoService } from '../../services/producto.service';
import { CategoriaService } from '../../services/categoria.service';
import { MarcaService } from '../../services/marca.service';
import { Categoria } from '../../models/categoria';
import { Marca } from '../../models/marca';
import { CompraService } from '../../services/compra.service';
import { CompraSugeridaService } from '../../services/compraS.service';
import { CompraSugerida } from '../../models/compraS';

@Component({
  selector: 'app-compras-sugeridas',
  standalone: false,
  templateUrl: './compras-sugeridas.component.html',
  styleUrl: './compras-sugeridas.component.css'
})
export class ComprasSugeridasComponent {
  listCompraSugerida: CompraSugerida[] = [];
  compraForm: FormGroup;
  selectedFilter: string = 'nombre'; // Por defecto se filtra por nombre
  searchTerm: string = '';

  isLoading = false;

  constructor(private fb: FormBuilder, private router: Router, private toastr: ToastrService, private _compraSugService: CompraSugeridaService, private _compraService: CompraService, private aRoute: ActivatedRoute){
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

  private generando = false;


  ngOnInit(): void {
    this.obtenerComprasSugeridas();
  }

  obtenerComprasSugeridas(){
    this._compraSugService.getSugerencias().subscribe(data=>{
      console.log(data);
      this.listCompraSugerida = data;
    }, error => {
      console.log(error);
    })
  }

  procesarSugerencias(): void {
    if (this.generando) return;
    this.generando = true;
            this.obtenerComprasSugeridas();

        this._compraSugService.generarSugerencias().subscribe({
          next: () => {
            this.obtenerComprasSugeridas();
            this.toastr.success('Sugerencias actualizadas');
            this.generando = false;
          },
          error: err => {
            console.error('Error al generar sugerencias', err);
            this.generando = false;
          }
        });
  }


  async registrarCompraAutomatica() {
    if (!this.listCompraSugerida || this.listCompraSugerida.length === 0) {
      this.toastr.warning('No hay productos con poco stock para generar compras.');
      return;
    }

    const sugerenciasPendientes = this.listCompraSugerida.filter(s => !s.tieneOrdenCompra);
    if (sugerenciasPendientes.length === 0) {
      this.toastr.warning('No hay productos pendientes para generar compras.');
      return;
    }


    this.toastr.info('Registrando compras, por favor espera...', '', { disableTimeOut: true, tapToDismiss: false });
    this.isLoading = true;

    const productosPorProveedor: Map<string, { proveedor: any, detalle: any[] }> = new Map();

    sugerenciasPendientes.forEach(sugerida => {
      const producto = sugerida.producto;
      const proveedor = producto?.marca?.proveedor;

      if (!proveedor || !proveedor._id) {
        console.warn(`El producto ${producto?.nombre} no tiene proveedor asignado correctamente.`);
        return;
      }

      const proveedorId = proveedor._id;

      if (!productosPorProveedor.has(proveedorId)) {
        productosPorProveedor.set(proveedorId, { proveedor, detalle: [] });
      }

      productosPorProveedor.get(proveedorId)!.detalle.push({
        producto: producto._id,
        codInt: producto.codInt,
        nombre: producto.nombre,
        cantidad: 30, // puedes ajustar la cantidad como desees
        precio: producto.precio,
        subtotal: 30 * producto.precio
      });
    });

    const proveedoresArray = Array.from(productosPorProveedor.values());
    let exitos = 0;
    let fallidos = 0;

    for (const { proveedor, detalle } of proveedoresArray) {
      const total = detalle.reduce((sum, item) => sum + item.subtotal, 0);
      const igv = parseFloat((total * 0.18).toFixed(2));
      const totalConIgv = parseFloat((total + igv).toFixed(2));

      const compra = {
        tipoComprobante: 'FACTURA DE COMPRA ELECTRONICA',
        serie: 'F01',
        fechaEmision: new Date(),
        fechaVenc: new Date(),
        igv,
        total: totalConIgv,
        estado: 'Pendiente',
        moneda: 'S/',
        tipoCambio: 3.66,
        proveedor: proveedor._id,
        metodoPago: 'Transferencia',
        detalleC: detalle
      };

      try {
        console.log(`Registrando compra para proveedor ${proveedor.nombre}`, compra);
        await this._compraService.registrarCompra(compra).toPromise();
        for (const item of detalle) {
          const sugerida = this.listCompraSugerida.find(s => s.producto._id === item.producto);
          if (sugerida && sugerida._id) {
            console.log('Marcando sugerencia:', sugerida._id);
            await this._compraSugService.marcarOrdenGenerada(sugerida._id).toPromise();
          } else {
            console.warn('Sugerencia no encontrada para producto:', item.producto);
          }
        }
        exitos++;
      } catch (error) {
        console.error(`Error al registrar compra para proveedor ${proveedor.nombre}:`, error);
        fallidos++;
      }
    }

    this.isLoading = false;
    this.toastr.clear();

    if (exitos > 0) {
      this.toastr.success(`${exitos} compras registradas con éxito.`);
    }
    if (fallidos > 0) {
      this.toastr.error(`${fallidos} compras no pudieron registrarse. Ver consola para detalles.`);
    }

    this.router.navigate(['/listado-compras']);
  }

  get filteredCompraS(): CompraSugerida[] {
    if (!this.searchTerm.trim()) {
      return this.listCompraSugerida;
    }

    const term = this.searchTerm.trim().toLowerCase();

    switch (this.selectedFilter) {
      case 'nombre':
        return this.listCompraSugerida.filter(p =>
          p.producto.nombre.toLowerCase().startsWith(term)
        );
      case 'marca':
        return this.listCompraSugerida.filter(p =>
          p.producto.marca.nombre.toLowerCase().startsWith(term)
        );
      default:
        return this.listCompraSugerida;
    }
  }

  currentPage: number = 1;
    itemsPerPage: number = 10;
  
    get paginated(): CompraSugerida[] {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        return this.filteredCompraS.slice(startIndex, startIndex + this.itemsPerPage);
      }
      
      get totalPages(): number {
        return Math.ceil(this.filteredCompraS.length / this.itemsPerPage);
      }
      
      changePage(page: number) {
        if (page >= 1 && page <= this.totalPages) {
          this.currentPage = page;
        }
      }

      private getTodayString(): string {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');  // Añade un cero al inicio si el día es menor a 10
        const month = String(today.getMonth() + 1).padStart(2, '0');  // `getMonth()` es cero-indexado, por eso sumamos 1
        const year = today.getFullYear();
        
        return `${day}/${month}/${year}`;  // DD-MM-YYYY
    }
}
