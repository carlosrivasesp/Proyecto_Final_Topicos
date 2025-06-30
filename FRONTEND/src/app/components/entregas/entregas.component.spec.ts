// src/app/components/entregas/entregas.component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Necesario si el componente usa HttpClient
import { RouterTestingModule } from '@angular/router/testing'; // Necesario si el componente usa Router
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; // Necesario si el componente usa formularios
import { ToastrService, ToastrModule } from 'ngx-toastr'; // Necesario si el componente usa ToastrService
import { NO_ERRORS_SCHEMA } from '@angular/core'; // Importante para ignorar elementos HTML desconocidos como <app-header>

import { EntregasComponent } from './entregas.component';
// Si EntregasComponent usa algún servicio, impórtalo aquí para poder mockearlo
// import { EntregasService } from '../../services/entregas.service'; // Ejemplo: Si tienes un servicio de entregas

describe('EntregasComponent', () => {
  let component: EntregasComponent;
  let fixture: ComponentFixture<EntregasComponent>;
  let toastrServiceSpy: jasmine.SpyObj<ToastrService>; // Spy para ToastrService
  // let entregasServiceSpy: jasmine.SpyObj<EntregasService>; // Ejemplo: Spy para un servicio de entregas

  beforeEach(async () => {
    // Inicializa el spy para ToastrService
    toastrServiceSpy = jasmine.createSpyObj('ToastrService', ['success', 'error', 'info', 'warning']);
    // Inicializa otros spies si el componente los utiliza
    // entregasServiceSpy = jasmine.createSpyObj('EntregasService', ['getAllEntregas']); // Ejemplo: Mockear un método del servicio

    await TestBed.configureTestingModule({
      declarations: [EntregasComponent],
      imports: [
        HttpClientTestingModule, // Permite probar componentes con inyección de HttpClient sin hacer llamadas reales
        RouterTestingModule.withRoutes([]), // Permite probar componentes con inyección de Router
        ReactiveFormsModule, // Para componentes que usan Reactive Forms
        FormsModule, // Para componentes que usan Template-driven Forms
        ToastrModule.forRoot() // Configura ToastrService para el entorno de pruebas
      ],
      providers: [
        { provide: ToastrService, useValue: toastrServiceSpy }, // Provee el spy de ToastrService
        // { provide: EntregasService, useValue: entregasServiceSpy }, // Provee el spy para tu servicio de entregas
      ],
      // Importante: Esto le dice a Angular que ignore cualquier elemento o propiedad desconocida en la plantilla HTML
      // Esto previene errores como "app-header is not a known element" sin tener que importar módulos enteros de UI
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntregasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Esto activa ngOnInit y el ciclo inicial de detección de cambios del componente
  });

  // PRUEBA 1: Verificar que el componente se crea correctamente
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Puedes añadir más pruebas aquí, basándote en la funcionalidad real de EntregasComponent.
  // Por ejemplo, si EntregasComponent carga una lista de entregas al iniciar:
  // it('should load deliveries on init', () => {
  //   expect(entregasServiceSpy.getAllEntregas).toHaveBeenCalled();
  // });

  // Si tiene algún método para filtrar entregas:
  // it('should filter deliveries by search term', () => {
  //   component.searchTerm = 'express';
  //   component.applyFilter();
  //   expect(component.filteredDeliveries.length).toBeLessThan(component.allDeliveries.length);
  // });
});
