import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Lugar } from '../../models/lugar';
import { ToastrService } from 'ngx-toastr';
import { LugarService } from '../../services/lugar.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-detalle-entrega',
  standalone: false,
  templateUrl: './detalle-entrega.component.html',
  styleUrl: './detalle-entrega.component.css'
})
export class DetalleEntregaComponent {

  listLugar: Lugar[] = [];
  lugarForm: FormGroup;

  selectedFilter: string = 'distrito';
  searchTerm: string = '';

  idLugar: string | null;

  constructor(private fb: FormBuilder, private router: Router, private toastr: ToastrService, private _lugarService: LugarService, private aRoute: ActivatedRoute){
    this.lugarForm = this.fb.group({
      codigo: [''],
      distrito: ['', Validators.required],
      costo: ['', Validators.required],
      inicio: ['', Validators.required],
      fin: ['', Validators.required],
    })
    this.idLugar = this.aRoute.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.obtenerLugar();
  }
  resetFormulario() {
    this.lugarForm.reset(); // Esto limpia todos los campos
    this.lugarForm.get('distrito')?.enable();    
  }  
  obtenerLugar(){
    this._lugarService.getAllLugares().subscribe(data=>{
      console.log(data);
      this.listLugar = data;
    }, error => {
      console.log(error);
    })
  }
  

  registrarLugar(){
    console.log(this.lugarForm);

    const Lugar: Lugar = {
      codigo : this.lugarForm.get('codigo')?.value,
      distrito : this.lugarForm.get('distrito')?.value,
      costo: this.lugarForm.get('costo')?.value,
      inicio : this.lugarForm.get('inicio')?.value,
      fin : this.lugarForm.get('fin')?.value,
      __v:  this.lugarForm.get('__v')?.value,
      
    }    
      this._lugarService.guardarLugar(Lugar).subscribe(data => {
        this.toastr.success('La entrega fue registrada exitosamente', 'Entrega registrada');
        this.router.navigate(['/lugar']);
        this.obtenerLugar();
      }, error => {
        console.log(error);
        this.lugarForm.reset();
      });
  }

  get filteredLugares(): Lugar[] {
      if (!this.searchTerm.trim()) {
        return this.listLugar;
      }
  
      const term = this.searchTerm.trim().toLowerCase();
  
      switch (this.selectedFilter) {
        case 'distrito':
          return this.listLugar.filter(l =>
            l.distrito.toLowerCase().startsWith(term) 
          );
          case 'codigo':
            return this.listLugar.filter(p =>
              String(p.codigo).toLowerCase().startsWith(term)
            );
          
        
        default:
          return this.listLugar;
      }
    }
  
    editarLugar(Lugar: Lugar) {
      this.idLugar = Lugar._id || null;
      this.lugarForm.patchValue({
        codigo: Lugar.codigo,
        distrito: Lugar.distrito,
        costo: Lugar.costo,
        inicio: Lugar.inicio,
        fin: Lugar.fin,
        __v: Lugar.__v,
      });
      this.lugarForm.get('distrito')?.disable(); 
    }
    

  actualizarLugar() {
    if (this.lugarForm.invalid || !this.idLugar) return;

    const Lugar: Lugar = this.lugarForm.value;

    this._lugarService.editarLugar(this.idLugar, Lugar).subscribe(
      data => {
        this.toastr.info('La entrega fue actualizada exitosamente', 'Entrega actualizada');
        this.lugarForm.reset();
        this.obtenerLugar();
      },
      error => {
        console.log(error);
        this.lugarForm.reset();
      }
    );
  }
  

  currentPage: number = 1;
  itemsPerPage: number = 10;

  get paginated(): Lugar[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredLugares.slice(startIndex, startIndex + this.itemsPerPage);
  }
  
  get totalPages(): number {
    return Math.ceil(this.filteredLugares.length / this.itemsPerPage);
  }
  
  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
  capitalize(word: string): string {
    if (!word) return '';
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }
}
