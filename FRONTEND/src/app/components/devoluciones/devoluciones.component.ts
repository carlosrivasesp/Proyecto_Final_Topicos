import { Component } from '@angular/core';
import { Devolucion } from '../../models/devolucion';
import { DevolucionService } from '../../services/devolucion.service';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto';

@Component({
  selector: 'app-devoluciones',
  standalone: false,
  templateUrl: './devoluciones.component.html',
  styleUrl: './devoluciones.component.css'
})
export class DevolucionesComponent {
  
    listDevolucion: Devolucion[] = [];
    listProductos: Producto[] = [];
  
    selectedFilter: string = 'Venta';
    searchTerm: string = '';
  
    constructor(
      private _devolucionService: DevolucionService,
      private productoService: ProductoService
    ) {
    }
  
    ngOnInit(): void {
      this.obtenerDevoluciones();
      this.obtenerProductos();
    }
  
    obtenerDevoluciones() {
      this._devolucionService.getAllDevolucion().subscribe(data => {
        this.listDevolucion = data.reverse();
        console.log('Devolucion:', data);
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
  
    get filteredDevolucion(): Devolucion[] {
      if (!this.searchTerm.trim()) {
        return this.listDevolucion;
      }
    
      const term = this.searchTerm.trim().toLowerCase();
    
      switch (this.selectedFilter) {        
        case 'venta':
          return this.listDevolucion.filter(i =>
            i.ventaId.nroComprobante.toLowerCase().startsWith(term)
          );
  
        case 'fecha':
          return this.listDevolucion.filter(s =>
            s.fechaDevolucion ? this.formatDate(s.fechaDevolucion).includes(term) : false
          );
    
        default:
          return this.listDevolucion;
      }
    }  
  
    formatDate(date: Date): string {
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    }
  
    currentPage: number = 1;
          itemsPerPage: number = 10;
        
          get paginated(): Devolucion[] {
              const startIndex = (this.currentPage - 1) * this.itemsPerPage;
              return this.filteredDevolucion.slice(startIndex, startIndex + this.itemsPerPage);
            }
            
            get totalPages(): number {
              return Math.ceil(this.filteredDevolucion.length / this.itemsPerPage);
            }
            
            changePage(page: number) {
              if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
              }
            }
}
