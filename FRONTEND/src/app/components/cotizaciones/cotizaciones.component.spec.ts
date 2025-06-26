//necesario para el entorno de pruebas
import { ComponentFixture, TestBed } from '@angular/core/testing';

//modulo para simular peticiones HTTP en pruebas
import { HttpClientTestingModule } from '@angular/common/http/testing';

//ignora elementos desconocidos en la plantilla, para evitar incluir el header y sidebar en este test
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

//componente que se va a probar
import { CotizacionesComponent } from './cotizaciones.component';

//modulos de formulario para que el componente trabaje con modulos test
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//servicios incluidos en el componente para ser simulados
import { CotizacionService } from '../../services/cotizacion.service';
import { ProductoService } from '../../services/producto.service';
import { ToastrService } from 'ngx-toastr';

//operador para simular Observables
import { of } from 'rxjs';

//modelo para los datos de prueba
import { Cliente } from '../../models/cliente';

//titulo del bloque de pruebas para el componente
describe('CotizacionesComponent', () => {
  let component: CotizacionesComponent;
  let fixture: ComponentFixture<CotizacionesComponent>;

  //mock con spye para simular el servicio de Cotizaciones
  let mockCotizacionService: jasmine.SpyObj<CotizacionService>;

  //se ejecuta antes de cada test
  beforeEach(async () => {
    
    //spy object para el CotizacionService, que simula el método registrarCotizacion
    const cotizacionServiceSpy = jasmine.createSpyObj('CotizacionService', [
      'registrarCotizacion',
    ]);

    //simula el método getAllProductos
    const productoServiceSpy = jasmine.createSpyObj('ProductoService', [
      'getAllProductos',
    ]);

    //devuelve un array vacio cuando se llame el metodo de obtener productos
    productoServiceSpy.getAllProductos.and.returnValue(of([]));

    //spy para las notificaciones, no hace nada real en el test
    const toastrServiceSpy = jasmine.createSpyObj('ToastrService', [
      'success',
      'error',
      'info',
      'warning',
    ]);

    //modulo de pruebas de angular
    await TestBed.configureTestingModule({
      declarations: [CotizacionesComponent],
      imports: [FormsModule, ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        { provide: CotizacionService, useValue: cotizacionServiceSpy },
        { provide: ProductoService, useValue: productoServiceSpy },
        { provide: ToastrService, useValue: toastrServiceSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CotizacionesComponent);
    component = fixture.componentInstance;
    mockCotizacionService = TestBed.inject(
      CotizacionService
    ) as jasmine.SpyObj<CotizacionService>;
    fixture.detectChanges();
  });

  //prueba unitaria 'fit' para que se realice solo esa prueba
  fit('debe llamar al servicio registrarCotizacion cuando se hace click en el botón', () => {
    // simula que el usuario ya agregó un producto para realizar la cotizacion
    component.elementosRegistrados = [{
      codigo: '001',
      nombre: 'Producto Prueba',
      cant: 1,
      precio: 20,
      subtotal: 20
    }];
    //simula cliente seleccionado
    component.clienteSeleccionado = {
      _id: '123',
      nombre: 'Cliente Prueba',
      telefono: '123456789',
    } as Cliente;

    mockCotizacionService.registrarCotizacion.and.returnValue(of({}));

    //llamada al metodo que genera la cotizacion como si se hubiera dado click al boton
    component.onGenerarCotizacion();

    //verifica que el spy haya sido llamado
    expect(mockCotizacionService.registrarCotizacion).toHaveBeenCalled();
  });
});
