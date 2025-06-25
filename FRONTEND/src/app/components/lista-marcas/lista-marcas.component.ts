import { Component } from '@angular/core';
import { Marca } from '../../models/marca';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MarcaService } from '../../services/marca.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-lista-marcas',
  standalone: false,
  templateUrl: './lista-marcas.component.html',
  styleUrl: './lista-marcas.component.css'
})
export class ListaMarcasComponent {

  listMarcas: Marca[] = [];
  marcaForm: FormGroup;

  selectedFilter: string = 'nombre';
  searchTerm: string = '';

  idMarca: string | null;

  currentPage: number = 1;
  itemsPerPage: number = 10;

  constructor(private fb: FormBuilder, private router: Router, private toastr: ToastrService, private _marcaService: MarcaService, private aRoute: ActivatedRoute){
    this.marcaForm = this.fb.group({
      nombre: ['', Validators.required],
      proveedor: ['', Validators.required]
    })
    this.idMarca = this.aRoute.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.obtenerMarcas();
  }

  resetFormulario() {
    this.marcaForm.reset(); // Esto limpia todos los campos
    this.marcaForm.get('nombre')?.enable();
    this.marcaForm.get('proveedor')?.enable();
  }

  obtenerMarcas(){
    this._marcaService.getAllMarcas().subscribe(data=>{
      console.log(data);
      this.listMarcas = data;
    }, error => {
      console.log(error);
    })
  }

  registrarMarca(){
    console.log(this.marcaForm);

    const Marca: Marca = {
      nombre : this.marcaForm.get('nombre')?.value,
      proveedor : this.marcaForm.get('proveedor')?.value
    }    
      this._marcaService.guardarMarca(Marca).subscribe(data => {
        this.toastr.success('La marca fue registrada exitosamente', 'Marca registrada');
       // this.router.navigate(['/marcas']);
        this.obtenerMarcas();
      }, error => {
        console.log(error);
        this.marcaForm.reset();
      });
  }

  get filteredMarcas(): Marca[] {
    if (!this.searchTerm.trim()) {
      return this.listMarcas;
    }
    
    const term = this.searchTerm.trim().toLowerCase();
  
    switch (this.selectedFilter) {
      case 'nombre':
        return this.listMarcas.filter(p =>
          p.nombre.toLowerCase().startsWith(term) // Filtra por la primera letra del nombre
        );
      case 'proveedor':
        return this.listMarcas.filter(p =>
          p.proveedor.nombre.toLowerCase().startsWith(term) // Filtra por la primera letra del proveedor
        );
      default:
        return this.listMarcas;
    }
  }
  
  eliminarMarca(id: any) {
    this._marcaService.deleteMarca(id).subscribe(data => {
      this.toastr.error('La marca fue eliminado exitosamente', 'Marca eliminada');
      this.obtenerMarcas();
    }, error => {
      console.log(error);
    })
  }

  editarMarca(Marca: Marca) {
    this.idMarca = Marca._id || null; 
    this.marcaForm.setValue({
      nombre: Marca.nombre,
      proveedor: Marca.proveedor.nombre
    });
    this.marcaForm.get('nombre')?.disable();
    this.marcaForm.get('proveedor')?.disable();
  }

  actualizarMarca() {
    if (this.marcaForm.invalid || !this.idMarca) return;

    const Marca: Marca = this.marcaForm.value;

    this._marcaService.editarMarca(this.idMarca, Marca).subscribe(
      data => {
        this.toastr.info('La marca fue actualizada exitosamente', 'Marca actualizada');
        this.marcaForm.reset();
        this.idMarca = null;
        this.obtenerMarcas();
      },
      error => {
        console.log(error);
        this.marcaForm.reset();
      }
    );
  }

  get paginated(): Marca[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredMarcas.slice(startIndex, startIndex + this.itemsPerPage);
  }
  
  get totalPages(): number {
    return Math.ceil(this.filteredMarcas.length / this.itemsPerPage);
  }
  
  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
}