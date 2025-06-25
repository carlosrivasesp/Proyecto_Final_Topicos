import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Proveedor } from '../../models/proveedor';
import { ToastrService } from 'ngx-toastr';
import { ProveedorService } from '../../services/proveedor.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-lista-proveedores',
  standalone: false,
  templateUrl: './lista-proveedores.component.html',
  styleUrl: './lista-proveedores.component.css'
})
export class ListaProveedoresComponent {

  listProveedores: Proveedor[] = [];
  proveedorForm: FormGroup;

  selectedFilter: string = 'nombre'; // Por defecto se filtra por nombre
  searchTerm: string = '';

  idProveedor: string | null;


  constructor(private fb: FormBuilder, private router: Router, private toastr: ToastrService, private _proveedorService: ProveedorService, private aRoute: ActivatedRoute){
    this.proveedorForm = this.fb.group({
      nombre: ['', Validators.required],
      tipoDoc: ['', Validators.required],
      nroDoc: ['', Validators.required],
      telefono: ['', Validators.required],
      correo: ['', Validators.required],
      estado: ['', Validators.required]
    })
    this.idProveedor = this.aRoute.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.obtenerProveedores();
  }

  resetFormulario() {
    this.proveedorForm.reset(); // Esto limpia todos los campos
    this.proveedorForm.get('nombre')?.enable();
    this.proveedorForm.get('tipoDoc')?.enable();
    this.proveedorForm.get('nroDoc')?.enable();
  }

  obtenerProveedores(){
    this._proveedorService.getAllProveedores().subscribe(data=>{
      console.log(data);
      this.listProveedores = data;
    }, error => {
      console.log(error);
    })
  }

  registrarProv(){
    console.log(this.proveedorForm);

    const PROVEEDOR: Proveedor = {
      nombre : this.proveedorForm.get('nombre')?.value,
      tipoDoc : this.proveedorForm.get('tipoDoc')?.value,
      nroDoc : this.proveedorForm.get('nroDoc')?.value,
      telefono : this.proveedorForm.get('telefono')?.value,
      correo : this.proveedorForm.get('correo')?.value,
      estado : this.proveedorForm.get('estado')?.value
    }
      this._proveedorService.guardarProveedor(PROVEEDOR).subscribe(data => {
        this.toastr.success('El proveedor fue registrado exitosamente', 'Proveedor registrado');
        this.router.navigate(['/proveedores']);
        this.obtenerProveedores();
      }, error => {
        console.log(error);
        this.proveedorForm.reset();
      });
  }

  get filteredProveedores(): Proveedor[] {
    if (!this.searchTerm.trim()) {
      return this.listProveedores;
    }

    const term = this.searchTerm.trim().toLowerCase();

    switch (this.selectedFilter) {
      case 'nombre':
        return this.listProveedores.filter(p =>
          p.nombre.toLowerCase().startsWith(term) // Filtra por la primera letra del nombre
        );
      case 'RUC':
        return this.listProveedores.filter(p =>
          p.tipoDoc === 'RUC' && p.nroDoc.toLowerCase().startsWith(term) // Filtra por el primer dígito del RUC
        );
      case 'DNI':
        return this.listProveedores.filter(p =>
          p.tipoDoc === 'DNI' && p.nroDoc.toLowerCase().startsWith(term) // Filtra por el primer dígito del DNI
        );
      default:
        return this.listProveedores;
    }
  }
  
  eliminarProveedor(id: any) {
    this._proveedorService.deleteProveedor(id).subscribe(data => {
      this.toastr.error('El proveedor fue eliminado exitosamente', 'Proveedor eliminado');
      this.obtenerProveedores();
    }, error => {
      console.log(error);
    })
  }

  editarProveedor(proveedor: Proveedor) {
    this.idProveedor = proveedor._id || null; 
    this.proveedorForm.patchValue({
      nombre: proveedor.nombre,
      tipoDoc: proveedor.tipoDoc,
      nroDoc: proveedor.nroDoc,
      telefono: proveedor.telefono,
      correo: proveedor.correo,
      estado: proveedor.estado
    });
    this.proveedorForm.get('nombre')?.disable();
    this.proveedorForm.get('tipoDoc')?.disable();
    this.proveedorForm.get('nroDoc')?.disable();
  }

  actualizarProv() {
    if (this.proveedorForm.invalid || !this.idProveedor) return;

    const PROVEEDOR: Proveedor = this.proveedorForm.value;

    this._proveedorService.editarProveedor(this.idProveedor, PROVEEDOR).subscribe(
      data => {
        this.toastr.info('El proveedor fue actualizado exitosamente', 'Proveedor actualizado');
        this.proveedorForm.reset();
        this.idProveedor = null;
        this.obtenerProveedores();
      },
      error => {
        console.log(error);
        this.proveedorForm.reset();
      }
    );
  }
  currentPage: number = 1;
      itemsPerPage: number = 10;
    
      get paginated(): Proveedor[] {
          const startIndex = (this.currentPage - 1) * this.itemsPerPage;
          return this.filteredProveedores.slice(startIndex, startIndex + this.itemsPerPage);
        }
        
        get totalPages(): number {
          return Math.ceil(this.filteredProveedores.length / this.itemsPerPage);
        }
        
        changePage(page: number) {
          if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
          }
        }
}