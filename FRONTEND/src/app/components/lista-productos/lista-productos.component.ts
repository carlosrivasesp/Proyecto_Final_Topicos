import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Producto } from '../../models/producto';
import { ToastrService } from 'ngx-toastr';
import { ProductoService } from '../../services/producto.service';
import { Observable } from 'rxjs';
import { Categoria } from '../../models/categoria';
import { Marca } from '../../models/marca';
import { CategoriaService } from '../../services/categoria.service';
import { MarcaService } from '../../services/marca.service';

@Component({
  selector: 'app-lista-productos',
  standalone: false,
  templateUrl: './lista-productos.component.html',
  styleUrl: './lista-productos.component.css'
})
export class ListaProductosComponent {

  listProductos: Producto[] = [];
  listCategorias: Categoria[] = [];
  listMarcas: Marca[] = [];
  productoForm: FormGroup;

  selectedFilter: string = 'nombre'; // Por defecto se filtra por nombre
  searchTerm: string = '';

  idProducto: string | null;

  constructor(private fb: FormBuilder, private router: Router, private toastr: ToastrService, private _productoService: ProductoService, private _categoriaService: CategoriaService, private _marcaService: MarcaService, private aRoute: ActivatedRoute){
    this.productoForm = this.fb.group({
      codInt: ['', Validators.required],
      nombre: ['', Validators.required],
      precio: ['', Validators.required],
      stockActual: [{value: 0, disabled: true}],
      stockMin: [{ value: 9, disabled: true }],
      categoria: ['', Validators.required],
      marca: ['', Validators.required],
      estado: ['']
    })
    this.idProducto = this.aRoute.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.obtenerProductos();
    this.cargarCategorias();
    this.cargarMarcas();
  }

  resetFormulario() {
    this.productoForm.reset({
      codInt: '',
      nombre: '',
      precio: '',
      stockActual: { value: 0, disabled: true},
      stockMin: { value: 9, disabled: true },
      categoria: '',
      marca: '',
      estado: ''
    }); // Esto limpia todos los campos this.productoForm.reset();
  }

  obtenerProductos(){
    this._productoService.getAllProductos().subscribe(data=>{
      console.log(data);
      this.listProductos = data;
    }, error => {
      console.log(error);
    })
  }

  cargarCategorias() {
    this._categoriaService.getAllCategorias().subscribe(data => {
      console.log(data);
      this.listCategorias = data;
    });
  }

  cargarMarcas() {
    this._marcaService.getAllMarcas().subscribe(data => {
      this.listMarcas = data;
    });
  }

  registrarProducto(){
    console.log(this.productoForm);

    const Producto: Producto = {
      codInt : this.productoForm.get('codInt')?.value,
      nombre : this.productoForm.get('nombre')?.value,
      precio : this.productoForm.get('precio')?.value,
      stockActual : 0,
      stockMin : 9,
      categoria : this.productoForm.get('categoria')?.value,
      marca : this.productoForm.get('marca')?.value,
      estado : 'Activo'
    }    
      this._productoService.guardarProducto(Producto).subscribe(data => {
        this.toastr.success('El Producto fue registrado exitosamente', 'Producto registrado');
        this.obtenerProductos();
      }, error => {
        console.log(error);
        this.productoForm.reset();
      });
  }

  get filteredProductos(): Producto[] {
    if (!this.searchTerm.trim()) {
      return this.listProductos;
    }

    const term = this.searchTerm.trim().toLowerCase();

    switch (this.selectedFilter) {
      case 'nombre':
        return this.listProductos.filter(p =>
          p.nombre.toLowerCase().startsWith(term) // Filtra por la primera letra del nombre
        );
      case 'Cod. Int':
        return this.listProductos.filter(p =>
          p.codInt.toLowerCase().startsWith(term) // Filtra por la primer digito del codInt
        );
      default:
        return this.listProductos;
    }
  }
  
  eliminarProducto(id: any) {
    this._productoService.deleteProducto(id).subscribe(data => {
      this.toastr.error('El Producto fue eliminado exitosamente', 'Producto eliminado');
      this.obtenerProductos();
    }, error => {
      console.log(error);
    })
  }

  editarProducto(Producto: Producto) {
    this.idProducto = Producto._id || null; 
    this.productoForm.setValue({
      codInt: Producto.codInt,
      nombre: Producto.nombre,
      precio: Producto.precio,
      stockActual: Producto.stockActual,
      stockMin: Producto.stockMin,
      categoria: Producto.categoria._id,
      marca: Producto.marca._id,
      estado: Producto.estado
    });
  }

  actualizarProducto() {
    if (this.productoForm.invalid || !this.idProducto) return;

    const Producto: Producto = this.productoForm.value;

    this._productoService.editarProducto(this.idProducto, Producto).subscribe(
      data => {
        this.toastr.info('El Producto fue actualizado exitosamente', 'Producto actualizado');
        this.productoForm.reset();
        this.idProducto = null;
        this.obtenerProductos();
      },
      error => {
        console.log(error);
        this.productoForm.reset();
      }
    );
  }

  currentPage: number = 1;
    itemsPerPage: number = 10;
  
    get paginated(): Producto[] {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        return this.filteredProductos.slice(startIndex, startIndex + this.itemsPerPage);
      }
      
      get totalPages(): number {
        return Math.ceil(this.filteredProductos.length / this.itemsPerPage);
      }
      
      changePage(page: number) {
        if (page >= 1 && page <= this.totalPages) {
          this.currentPage = page;
        }
      }

}
