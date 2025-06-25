import { Component } from '@angular/core';
import { IngresoService } from '../../services/ingreso.service';
import { Ingreso } from '../../models/ingreso';
import { Producto } from '../../models/producto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ProductoService } from '../../services/producto.service';

@Component({
  selector: 'app-ingreso',
  standalone: false,
  templateUrl: './ingresar-productos.component.html',
  styleUrls: ['./ingresar-productos.component.css']
})
export class IngresarProductosComponent {

  listIngresos: Ingreso[] = [];
  listProductos: Producto[] = [];

  selectedFilter: string = 'tipoOperacion';
  searchTerm: string = '';

  constructor(
    private toastr: ToastrService,
    private _ingresoService: IngresoService,
    private productoService: ProductoService
  ) {
  }

  ngOnInit(): void {
    this.obtenerIngresos();
    this.obtenerProductos();
  }

  obtenerIngresos() {
    this._ingresoService.getAllIngresos().subscribe(data => {
      this.listIngresos = data.reverse();
      console.log('Ingresos:', data);
    }, error => {
      console.log(error);
    });
  }

  obtenerProductos() {
    this.productoService.getAllProductos().subscribe(data => {
      this.listProductos = data;
      console.log('Productos:', data);
    }, error => {
      console.log(error);
    });
  }

  get filteredIngresos(): Ingreso[] {
    if (!this.searchTerm.trim()) {
      return this.listIngresos;
    }
  
    const term = this.searchTerm.trim().toLowerCase();
  
    switch (this.selectedFilter) {
      case 'tipoOperacion':
        return this.listIngresos.filter(i =>
          i.tipoOperacion.toLowerCase().startsWith(term)
        );
        
      case 'compra':
        return this.listIngresos.filter(i =>
          i.compraId?.nroComprobante?.toLowerCase().startsWith(term)
        );
      
      case 'venta':
        return this.listIngresos.filter(i =>
          i.ventaId?.nroComprobante.toLowerCase().startsWith(term)
        );

      case 'fecha':
        return this.listIngresos.filter(s =>
          s.fechaIngreso ? this.formatDate(s.fechaIngreso).includes(term) : false
        );
  
      default:
        return this.listIngresos;
    }
  }  

  formatDate(date: Date): string {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  currentPage: number = 1;
        itemsPerPage: number = 10;
      
        get paginated(): Ingreso[] {
            const startIndex = (this.currentPage - 1) * this.itemsPerPage;
            return this.filteredIngresos.slice(startIndex, startIndex + this.itemsPerPage);
          }
          
          get totalPages(): number {
            return Math.ceil(this.filteredIngresos.length / this.itemsPerPage);
          }
          
          changePage(page: number) {
            if (page >= 1 && page <= this.totalPages) {
              this.currentPage = page;
            }
          }
}
