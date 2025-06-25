import { Component } from '@angular/core';
import { Categoria } from '../../models/categoria';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CategoriaService } from '../../services/categoria.service';

@Component({
  selector: 'app-lista-categorias',
  standalone: false,
  templateUrl: './lista-categorias.component.html',
  styleUrl: './lista-categorias.component.css'
})
export class ListaCategoriasComponent {

  listCategorias: Categoria[] = [];
  categoriaForm: FormGroup;
  selectedFilter: string = 'nombre';
  searchTerm: string = '';
  idCategoria: string | null;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private _categoriaService: CategoriaService,
    private aRoute: ActivatedRoute
  ) {
    this.categoriaForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['']
    });
    this.idCategoria = this.aRoute.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.obtenerCategorias();
  }

  resetFormulario() {
    this.categoriaForm.reset();
    this.categoriaForm.get('nombre')?.enable();
    this.categoriaForm.get('descripcion')?.enable();
  }

  obtenerCategorias() {
    this._categoriaService.getAllCategorias().subscribe(data => {
      this.listCategorias = data;
    }, error => {
      console.log(error);
    });
  }

  registrarCategoria() {
    const categoria: Categoria = {
      nombre: this.categoriaForm.get('nombre')?.value,
      descripcion: this.categoriaForm.get('descripcion')?.value
    };

    this._categoriaService.guardarCategoria(categoria).subscribe(data => {
      this.toastr.success('La categoría fue registrada exitosamente', 'Categoría registrada');
      this.obtenerCategorias();
      this.categoriaForm.reset();
    }, error => {
      console.log(error);
      this.categoriaForm.reset();
    });
  }

  get filteredCategorias(): Categoria[] {
    if (!this.searchTerm.trim()) {
      return this.listCategorias;
    }

    const term = this.searchTerm.trim().toLowerCase();

    switch (this.selectedFilter) {
      case 'nombre':
        return this.listCategorias.filter(c =>
          c.nombre.toLowerCase().startsWith(term)
        );
      case 'descripcion':
        return this.listCategorias.filter(c =>
          c.descripcion?.toLowerCase().startsWith(term)
        );
      default:
        return this.listCategorias;
    }
  }

  eliminarCategoria(id: string) {
    this._categoriaService.deleteCategoria(id).subscribe(data => {
      this.toastr.error('La categoría fue eliminada exitosamente', 'Categoría eliminada');
      this.obtenerCategorias();
    }, error => {
      console.log(error);
    });
  }

  editarCategoria(categoria: Categoria) {
    this.idCategoria = categoria._id || null;
    this.categoriaForm.setValue({
      nombre: categoria.nombre,
      descripcion: categoria.descripcion
    });
    this.categoriaForm.get('nombre')?.disable();
  }

  actualizarCategoria() {
    if (this.categoriaForm.invalid || !this.idCategoria) return;

    const categoria: Categoria = this.categoriaForm.value;

    this._categoriaService.editarCategoria(this.idCategoria, categoria).subscribe(data => {
      this.toastr.info('La categoría fue actualizada exitosamente', 'Categoría actualizada');
      this.categoriaForm.reset();
      this.idCategoria = null;
      this.obtenerCategorias();
    }, error => {
      console.log(error);
      this.categoriaForm.reset();
    });
  }
  currentPage: number = 1;
        itemsPerPage: number = 10;
      
        get paginated(): Categoria[] {
            const startIndex = (this.currentPage - 1) * this.itemsPerPage;
            return this.filteredCategorias.slice(startIndex, startIndex + this.itemsPerPage);
          }
          
          get totalPages(): number {
            return Math.ceil(this.filteredCategorias.length / this.itemsPerPage);
          }
          
          changePage(page: number) {
            if (page >= 1 && page <= this.totalPages) {
              this.currentPage = page;
            }
          }
}
