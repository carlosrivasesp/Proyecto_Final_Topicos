import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Cliente } from '../../models/cliente';
import { ToastrService } from 'ngx-toastr';
import { ClienteService } from '../../services/cliente.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-lista-clientes',
  standalone: false,
  templateUrl: './lista-clientes.component.html',
  styleUrl: './lista-clientes.component.css'
})

export class ListaClientesComponent {

  listClientes: Cliente[] = [];
  clienteForm: FormGroup;

  selectedFilter: string = 'nombre'; // Por defecto se filtra por nombre
  searchTerm: string = '';

  idCliente: string | null;


  constructor(private fb: FormBuilder, private router: Router, private toastr: ToastrService, private _clienteService: ClienteService, private aRoute: ActivatedRoute){
    this.clienteForm = this.fb.group({
      nombre: ['', Validators.required],
      tipoDoc: ['', Validators.required],
      nroDoc: ['', Validators.required],
      telefono: ['', Validators.required],
      correo: ['', Validators.required],
      estado: ['', Validators.required]
    })
    this.idCliente = this.aRoute.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.obtenerClientes();
  }

  resetFormulario() {
    this.clienteForm.reset(); // Esto limpia todos los campos
    this.clienteForm.get('nombre')?.enable();
    this.clienteForm.get('tipoDoc')?.enable();
    this.clienteForm.get('nroDoc')?.enable();
  }

  obtenerClientes(){
    this._clienteService.getAllClientes().subscribe(data=>{
      console.log(data);
      this.listClientes = data;
    }, error => {
      console.log(error);
    })
  }

  registrarCliente(){
    console.log(this.clienteForm);

    const Cliente: Cliente = {
      nombre : this.clienteForm.get('nombre')?.value,
      tipoDoc : this.clienteForm.get('tipoDoc')?.value,
      nroDoc : this.clienteForm.get('nroDoc')?.value,
      telefono : this.clienteForm.get('telefono')?.value,
      correo : this.clienteForm.get('correo')?.value,
      estado: this.clienteForm.get('estado')?.value
    }    
      this._clienteService.guardarCliente(Cliente).subscribe(data => {
        this.toastr.success('El Cliente fue registrado exitosamente', 'Cliente registrado');
        this.router.navigate(['/clientes']);
        this.obtenerClientes();
      }, error => {
        console.log(error);
        this.clienteForm.reset();
      });
  }

  get filteredClientes(): Cliente[] {
    if (!this.searchTerm.trim()) {
      return this.listClientes;
    }

    const term = this.searchTerm.trim().toLowerCase();

    switch (this.selectedFilter) {
      case 'nombre':
        return this.listClientes.filter(p =>
          p.nombre.toLowerCase().startsWith(term) // Filtra por la primera letra del nombre
        );
      case 'RUC':
        return this.listClientes.filter(p =>
          p.tipoDoc === 'RUC' && p.nroDoc.toLowerCase().startsWith(term) // Filtra por el primer dígito del RUC
        );
      case 'DNI':
        return this.listClientes.filter(p =>
          p.tipoDoc === 'DNI' && p.nroDoc.toLowerCase().startsWith(term) // Filtra por el primer dígito del DNI
        );
       
      default:
        return this.listClientes;
    }
  }
  
  eliminarCliente(id: any) {
    this._clienteService.deleteCliente(id).subscribe(data => {
      this.toastr.error('El Cliente fue eliminado exitosamente', 'Cliente eliminado');
      this.obtenerClientes();
    }, error => {
      console.log(error);
    })
  }

  editarCliente(Cliente: Cliente) {
    this.idCliente = Cliente._id || null; 
    this.clienteForm.setValue({
      nombre: Cliente.nombre,
      tipoDoc: Cliente.tipoDoc,
      nroDoc: Cliente.nroDoc,
      telefono: Cliente.telefono,
      correo: Cliente.correo,
      estado: Cliente.estado
    });
    this.clienteForm.get('nombre')?.disable();
    this.clienteForm.get('tipoDoc')?.disable();
    this.clienteForm.get('nroDoc')?.disable();
  }

  actualizarCliente() {
    if (this.clienteForm.invalid || !this.idCliente) return;

    const Cliente: Cliente = this.clienteForm.value;

    this._clienteService.editarCliente(this.idCliente, Cliente).subscribe(
      data => {
        this.toastr.info('El Cliente fue actualizado exitosamente', 'Cliente actualizado');
        this.clienteForm.reset();
        this.idCliente = null;
        this.obtenerClientes();
      },
      error => {
        console.log(error);
        this.clienteForm.reset();
      }
    );
  }

  currentPage: number = 1;
  itemsPerPage: number = 10;

  get paginated(): Cliente[] {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredClientes.slice(startIndex, startIndex + this.itemsPerPage);
    }
    
    get totalPages(): number {
      return Math.ceil(this.filteredClientes.length / this.itemsPerPage);
    }
    
    changePage(page: number) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    }
}