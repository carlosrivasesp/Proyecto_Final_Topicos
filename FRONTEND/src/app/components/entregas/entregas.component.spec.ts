// src/app/components/entregas/entregas.component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';

import { EntregasComponent } from './entregas.component';
import { EntregaService } from '../../services/entregas.service';
import { Entregas } from '../../models/entregas';
import { Venta } from '../../models/venta';
import { Cliente } from '../../models/cliente';
import { DetalleVenta } from '../../models/detalleV';
import { Lugar } from '../../models/lugar';


describe('EntregasComponent', () => {
  let component: EntregasComponent;
  let fixture: ComponentFixture<EntregasComponent>;
  let entregaServiceSpy: jasmine.SpyObj<EntregaService>;
  let toastrServiceSpy: jasmine.SpyObj<ToastrService>;
  let httpTestingController: HttpTestingController;

  // Mocks de datos reutilizables
  const mockCliente: Cliente = { _id: 'c1', nombre: 'Cliente Test', nroDoc: '12345678', tipoDoc: 'DNI', telefono: '987654321', correo: 'test@cliente.com', estado: 'Activo' };
  const mockLugar: Lugar = { _id: 'l1', codigo: 'LUG001', distrito: 'Miraflores', costo: 5, inicio: 1672531200000, fin: 1672617600000, __v: 0 };
  const mockDetalle: DetalleVenta = {
    ventaId: {} as Venta, producto: {} as any, lugarId: mockLugar, codInt: 'PROD001', nombre: 'Producto A',
    cantidad: 2, precio: 10, codigoL: 'LUG001', distrito: 'Miraflores', costoL: 5, subtotal: 20
  };

  const mockVenta: Venta = {
    _id: 'venta123',
    serie: 'V01',
    nroComprobante: '00001',
    fechaEmision: new Date('2024-01-01T10:00:00Z'),
    fechaVenc: new Date('2024-01-08T10:00:00Z'),
    tipoComprobante: 'BOLETA',
    total: 100,
    estado: 'Completado',
    moneda: 'S/',
    tipoCambio: 3.7,
    cliente: mockCliente,
    metodoPago: 'Efectivo',
    detalles: [mockDetalle],
    lugarId: mockLugar,

  };


  beforeEach(async () => {
    entregaServiceSpy = jasmine.createSpyObj('EntregaService', [
      'getAllEntregas',
      'obtenerEntrega',
      'editarEstado' // Este spy se usa para el método `cambiarEstado` del componente
    ]);

    toastrServiceSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);

    await TestBed.configureTestingModule({
      declarations: [EntregasComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ToastrModule.forRoot()
      ],
      providers: [
        { provide: EntregaService, useValue: entregaServiceSpy },
        { provide: ToastrService, useValue: toastrServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntregasComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  // --- PRUEBA 1: Carga de entregas al iniciar el componente (ngOnInit) ---
  fit('should call obtenerEntregas on ngOnInit and populate listaEntregas', () => {
    const mockEntregas: Entregas[] = [
      {
        _id: 'entrega1',
        ventaId: mockVenta,
        direccion: 'Calle Falsa 123',
        estado: 'Pendiente',
        fechaInicio: new Date('2024-06-20T10:00:00Z'),
        fechaFin: new Date('2024-06-25T17:00:00Z')
      },
      {
        _id: 'entrega2',
        ventaId: { ...mockVenta, _id: 'venta124', nroComprobante: '00002' } as Venta,
        direccion: 'Av. Siempre Viva 742',
        estado: 'Entregado',
        fechaInicio: new Date('2024-06-18T09:00:00Z'),
        fechaFin: new Date('2024-06-19T14:00:00Z')
      }
    ];

    entregaServiceSpy.getAllEntregas.and.returnValue(of(mockEntregas));
    fixture.detectChanges();

    expect(entregaServiceSpy.getAllEntregas).toHaveBeenCalledTimes(1);
    expect(JSON.parse(JSON.stringify(component.listaEntregas)))
      .toEqual(JSON.parse(JSON.stringify(mockEntregas)));

    expect(component.listaEntregas.length).toBe(2);
    expect(component.listaEntregas[0]._id).toBe('entrega1');
    expect(component.listaEntregas[1].estado).toBe('Entregado');
    expect(component.listaEntregas[0].ventaId._id).toBe('venta123');
  });

  // --- PRUEBA 2: Actualización de estado exitosa ---
  // AHORA LLAMA A `cambiarEstado` Y PROVEE LAS PROPIEDADES NECESARIAS
  it('should call cambiarEstado and show success toast', () => {
    const entregaId = 'entrega1';
    const nuevoEstado = 'En proceso'; // Estado para la primera condición del if/else if
    const successMsg = 'Entrega programada';

    // Establece las propiedades del componente que el método `cambiarEstado` leerá
    component.direccion = 'Nueva Dirección Test';
    component.fechaInicio = '2024-07-01';
    component.fechaFin = '2024-07-05';

    // Mock para el servicio y Toastr
    entregaServiceSpy.editarEstado.and.returnValue(of({ msg: successMsg }));
    // Mockea obtenerEntregas si se llama después de un cambio de estado
    entregaServiceSpy.getAllEntregas.and.returnValue(of([]));

    // Espía `window.bootstrap.Modal.getInstance` para evitar errores del DOM
    spyOn(document, 'getElementById').and.returnValue({} as HTMLElement);
    (window as any).bootstrap = {
        Modal: {
            getInstance: jasmine.createSpy('getInstance').and.returnValue({
                hide: jasmine.createSpy('hide')
            })
        }
    };


    // Llama al método real del componente
    // ******** ¡VERIFICA ESTA LÍNEA! DEBE SER 'cambiarEstado' ********
    component.cambiarEstado(entregaId, nuevoEstado); // <<-- ¡Esta es la línea 150 (aprox)!

    // Crea el payload esperado que el componente debería enviar al servicio
    const expectedPayload = {
        estado: nuevoEstado,
        direccion: 'Nueva Dirección Test',
        fechaInicio: '2024-07-01',
        fechaFin: '2024-07-05'
    };

    // Verifica que el servicio `editarEstado` fue llamado con el ID y el payload correcto
    expect(entregaServiceSpy.editarEstado).toHaveBeenCalledWith(entregaId, expectedPayload);

    // Verifica que se mostró el mensaje de éxito correspondiente al estado 'En proceso'
    expect(toastrServiceSpy.success).toHaveBeenCalledWith(successMsg, 'Éxito');
  });

  // --- PRUEBA 3: Actualización de estado con error ---
  // AHORA LLAMA A `cambiarEstado` Y PROVEE LAS PROPIEDADES NECESARIAS
  it('should show error toast if cambiarEstado fails', () => {
    const entregaId = 'entrega1';
    const nuevoEstado = 'En proceso';
    const errorMessage = 'Error al cambiar estado.'; // Mensaje de error genérico del catch

    // Establece las propiedades del componente que el método `cambiarEstado` leerá
    component.direccion = 'Nueva Dirección Test';
    component.fechaInicio = '2024-07-01';
    component.fechaFin = '2024-07-05';

    // Mock para el servicio y Toastr
    entregaServiceSpy.editarEstado.and.returnValue(throwError(() => ({ error: { mensaje: 'Backend error' } }))); // Simula un error del backend
    entregaServiceSpy.getAllEntregas.and.returnValue(of([])); // Mockea obtenerEntregas

    // Espía `window.bootstrap.Modal.getInstance` para evitar errores del DOM
    spyOn(document, 'getElementById').and.returnValue({} as HTMLElement);
    (window as any).bootstrap = {
        Modal: {
            getInstance: jasmine.createSpy('getInstance').and.returnValue({
                hide: jasmine.createSpy('hide')
            })
        }
    };


    // Llama al método real del componente
    // ******** ¡VERIFICA ESTA LÍNEA! DEBE SER 'cambiarEstado' ********
    component.cambiarEstado(entregaId, nuevoEstado); // <<-- ¡Esta es la línea 174 (aprox)!

    // Crea el payload esperado que el componente debería enviar al servicio
    const expectedPayload = {
        estado: nuevoEstado,
        direccion: 'Nueva Dirección Test',
        fechaInicio: '2024-07-01',
        fechaFin: '2024-07-05'
    };

    // Verifica que el servicio `editarEstado` fue llamado con el ID y el payload correcto
    expect(entregaServiceSpy.editarEstado).toHaveBeenCalledWith(entregaId, expectedPayload);

    // Verifica que se mostró el mensaje de error del toastr
    expect(toastrServiceSpy.error).toHaveBeenCalledWith(errorMessage, 'Error');
  });

});