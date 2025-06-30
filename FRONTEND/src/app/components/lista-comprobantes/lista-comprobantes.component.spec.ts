import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { ListaComprobantesComponent } from './lista-comprobantes.component';
import { VentaService } from '../../services/venta.service';
import { Venta } from '../../models/venta';
import { Cliente } from '../../models/cliente';
import { DetalleVenta } from '../../models/detalleV';
import { Lugar } from '../../models/lugar';
import { Producto } from '../../models/producto';
import { Categoria } from '../../models/categoria';
import { Marca } from '../../models/marca';

describe('ListaComprobantesComponent', () => {
  let component: ListaComprobantesComponent;
  let fixture: ComponentFixture<ListaComprobantesComponent>;
  let ventaServiceSpy: jasmine.SpyObj<VentaService>;
  let toastrServiceSpy: jasmine.SpyObj<ToastrService>;
  let router: Router;
  let formBuilder: FormBuilder;

  // Mocks de datos reutilizables - DEFINICIÓN ORIGINAL (v1, v2)
  const mockCliente: Cliente = { _id: 'c1', nombre: 'Cliente Test', nroDoc: '12345678', tipoDoc: 'DNI', telefono: '987654321', correo: 'test@cliente.com', estado: 'Activo' };
  const mockLugar: Lugar = { _id: 'l1', codigo: 'LUG001', distrito: 'Miraflores', costo: 5, inicio: 1672531200000, fin: 1672617600000, __v: 0 };
  const mockProducto: Producto = {
    _id: 'p1', nombre: 'Producto A', codInt: 'PROD001', precio: 10, stockActual: 100,
    stockMin: 10, categoria: {} as Categoria, marca: {} as Marca, estado: 'Activo'
  };
  const mockDetalle: DetalleVenta = {
    ventaId: {} as Venta, producto: mockProducto, lugarId: mockLugar, codInt: 'PROD001', nombre: 'Producto A',
    cantidad: 2, precio: 10, codigoL: 'LUG001', distrito: 'Miraflores', costoL: 5, subtotal: 20
  };

  // ESTA ES LA DEFINICIÓN ORIGINAL DE MOCKVENTAS (v1, luego v2)
  const mockVentas: Venta[] = [
    {
      _id: 'v1', serie: 'B01', nroComprobante: '00001', fechaEmision: new Date('2023-01-01T10:00:00Z'), fechaVenc: new Date('2023-01-08T10:00:00Z'),
      tipoComprobante: 'BOLETA DE VENTA ELECTRONICA', total: 120, estado: 'Pendiente', moneda: 'S/', tipoCambio: 3.66,
      cliente: mockCliente, metodoPago: 'Efectivo', detalles: [mockDetalle], lugarId: mockLugar
    },
    {
      _id: 'v2', serie: 'F01', nroComprobante: '00002', fechaEmision: new Date('2023-01-05T12:00:00Z'), fechaVenc: new Date('2023-01-12T12:00:00Z'),
      tipoComprobante: 'FACTURA ELECTRONICA', total: 240, estado: 'Completado', moneda: 'S/', tipoCambio: 3.66,
      cliente: mockCliente, metodoPago: 'Tarjeta', detalles: [mockDetalle], lugarId: mockLugar
    },
  ];

  beforeEach(async () => {
    ventaServiceSpy = jasmine.createSpyObj('VentaService', ['getAllVentas', 'obtenerVenta', 'editarVenta']);
    toastrServiceSpy = jasmine.createSpyObj('ToastrService', ['success', 'error', 'info']);

    await TestBed.configureTestingModule({
      declarations: [
        ListaComprobantesComponent
      ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule,
        FormsModule,
        ToastrModule.forRoot(),
      ],
      providers: [
        FormBuilder,
        { provide: VentaService, useValue: ventaServiceSpy },
        { provide: ToastrService, useValue: toastrServiceSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '123' } } } }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ListaComprobantesComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    formBuilder = TestBed.inject(FormBuilder);

    spyOn(router, 'navigate').and.stub();

    component.ventaForm = formBuilder.group({
      tipoComprobante: [''],
      serie: [''],
      nroComprobante: [''],
      fechaEmision: [{ value: '', disabled: true }],
      fechaVenc: [{ value: '', disabled: true }],
      total: [''],
      estado: ['', Validators.required],
      moneda: [''],
      tipoCambio: [''],
      cliente: [''],
      metodoPago: ['', Validators.required],
      detalles: formBuilder.array([]),
    });
  });

  // PRUEBA UNITARIA SOLICITADA:
  fit('should load sales on init and reverse the list', () => {
    // Configura el spy para que devuelva los datos mock al llamar a getAllVentas
    // Aseguramos que el mockVentas original no sea mutado por el componente, pasamos una copia profunda.
    const mockVentasParaComponente = JSON.parse(JSON.stringify(mockVentas));
    ventaServiceSpy.getAllVentas.and.returnValue(of(mockVentasParaComponente));

    // Ejecuta la detección de cambios para activar ngOnInit y la carga de datos
    fixture.detectChanges();

    // Verificaciones
    expect(ventaServiceSpy.getAllVentas).toHaveBeenCalledTimes(1);

    // ***********************************************************************************
    // ****** CAMBIO CLAVE PARA DEPURACIÓN: HARDCODEAR LA EXPECTATIVA REVERTIDA *******
    // ***********************************************************************************
    // Creamos la expectativa del resultado final que esperamos del componente: ['v2', 'v1']
    const hardcodedExpectedReversedVentas: Venta[] = [
      {
        _id: 'v2', serie: 'F01', nroComprobante: '00002', fechaEmision: new Date('2023-01-05T12:00:00Z'), fechaVenc: new Date('2023-01-12T12:00:00Z'),
        tipoComprobante: 'FACTURA ELECTRONICA', total: 240, estado: 'Completado', moneda: 'S/', tipoCambio: 3.66,
        cliente: mockCliente, metodoPago: 'Tarjeta', detalles: [mockDetalle], lugarId: mockLugar
      },
      {
        _id: 'v1', serie: 'B01', nroComprobante: '00001', fechaEmision: new Date('2023-01-01T10:00:00Z'), fechaVenc: new Date('2023-01-08T10:00:00Z'),
        tipoComprobante: 'BOLETA DE VENTA ELECTRONICA', total: 120, estado: 'Pendiente', moneda: 'S/', tipoCambio: 3.66,
        cliente: mockCliente, metodoPago: 'Efectivo', detalles: [mockDetalle], lugarId: mockLugar
      },
    ];

    // ************ CONSOLE.LOGS PARA DEPURACIÓN FINAL **************
    // Si esta prueba falla, necesito la salida exacta de estos console.logs
    console.log('--- DEPURACIÓN HARDCODEADA ---');
    console.log('Esperado (hardcodedExpectedReversedVentas):', JSON.parse(JSON.stringify(hardcodedExpectedReversedVentas)));
    console.log('Actual (component.listVentas):', JSON.parse(JSON.stringify(component.listVentas)));
    console.log('--- FIN DEPURACIÓN HARDCODEADA ---');
    // ***************************************************************


    expect(JSON.parse(JSON.stringify(component.listVentas)))
      .toEqual(JSON.parse(JSON.stringify(hardcodedExpectedReversedVentas)));

    // Aserciones individuales (opcionales, pero buenas para claridad)
    // Confirmamos que el primer elemento es el que era 'v2'
    expect(component.listVentas[0]._id).toBe('v2');
    expect(component.listVentas[0].serie).toBe('F01');

    // Confirmamos que el segundo elemento es el que era 'v1'
    expect(component.listVentas[1]._id).toBe('v1');
    expect(component.listVentas[1].serie).toBe('B01');

    // Aseguramos el número total de elementos
    expect(component.listVentas.length).toBe(mockVentas.length);
  });
});