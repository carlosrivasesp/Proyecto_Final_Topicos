import { Component } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { Salida } from '../../models/salida';
import { Producto } from '../../models/producto';
import { SalidaService } from '../../services/salida.service';

@Component({
  selector: 'app-salida-productos',
  standalone: false,
  templateUrl: './salida-productos.component.html',
  styleUrl: './salida-productos.component.css'
})
export class SalidaProductosComponent {
  listSalidas: Salida[] = [];
  listProductos: Producto[] = [];

  selectedFilter: string = 'producto';
  searchTerm: string = '';

  constructor(
    private _salidaService: SalidaService,
    private _productoService: ProductoService
  ) {}

  ngOnInit(): void {
    this.obtenerSalidas();
    this.obtenerProductos();
  }

  obtenerSalidas() {
    this._salidaService.getAllSalidas().subscribe(data => {
      this.listSalidas = data.reverse();
      console.log('Salida:', data);
    }, error => {
      console.log(error);
    });
  }

  obtenerProductos() {
    this._productoService.getAllProductos().subscribe(data => {
      this.listProductos = data;
    }, error => {
      console.log(error);
    });
  }

  get filteredSalidas(): Salida[] {
    if (!this.searchTerm.trim()) {
      return this.listSalidas;
    }

    const term = this.searchTerm.trim().toLowerCase();

    switch (this.selectedFilter) {
      case 'tipoOperacion':
        return this.listSalidas.filter(i =>
          i.tipoOperacion.toLowerCase().startsWith(term)
        );
        
      case 'venta':
        return this.listSalidas.filter(i =>
          i.ventaId.nroComprobante.toLowerCase().startsWith(term)
        );

      case 'fecha':
        return this.listSalidas.filter(s =>
          s.fechaSalida ? this.formatDate(s.fechaSalida).includes(term) : false
        );

      default:
        return this.listSalidas;
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
      
        get paginated(): Salida[] {
            const startIndex = (this.currentPage - 1) * this.itemsPerPage;
            return this.filteredSalidas.slice(startIndex, startIndex + this.itemsPerPage);
          }
          
          get totalPages(): number {
            return Math.ceil(this.filteredSalidas.length / this.itemsPerPage);
          }
          
          changePage(page: number) {
            if (page >= 1 && page <= this.totalPages) {
              this.currentPage = page;
            }
          }

}
