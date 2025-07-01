import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';

import { ListaComprobantesComponent } from './lista-comprobantes.component';
import { VentaService } from '../../services/venta.service';
import { Venta } from '../../models/venta';

describe('ListaComprobantesComponent', () => {
  let component: ListaComprobantesComponent;
  let fixture: ComponentFixture<ListaComprobantesComponent>;
  let ventaServiceSpy: jasmine.SpyObj<VentaService>;
  let httpTestingController: HttpTestingController;
  let toastrServiceSpy: jasmine.SpyObj<ToastrService>;

  const mockActivatedRoute = {
    snapshot: { paramMap: { get: (key: string) => 'mockId' } },
    paramMap: of({ get: (key: string) => 'mockId' })
  };

  beforeEach(async () => {
    ventaServiceSpy = jasmine.createSpyObj('VentaService', ['getAllVentas']);
    toastrServiceSpy = jasmine.createSpyObj('ToastrService', ['success', 'error', 'info', 'warning']);

    await TestBed.configureTestingModule({
      declarations: [ ListaComprobantesComponent ],
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot()
      ],
      providers: [
        { provide: VentaService, useValue: ventaServiceSpy },
        { provide: ToastrService, useValue: toastrServiceSpy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListaComprobantesComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  fit('should load all comprobantes, reverse them, and assign to listVentas', () => {
    // Datos originales
    const mockVentas: Venta[] = [
      {
        _id: 'v1',
        serie: 'B01',
        nroComprobante: '00000001',
        fechaEmision: new Date('2025-01-01'),
        fechaVenc: new Date('2025-01-15'),
        tipoComprobante: 'BOLETA DE VENTA ELECTRONICA',
        total: 100.0,
        estado: 'Pendiente',
        moneda: 'S/',
        tipoCambio: 3.66,
        cliente: { _id: 'c1', nombre: 'Test Cliente Uno', tipoDoc: 'DNI', nroDoc: '12345678', telefono: '987654321', correo: 'cliente1@example.com', estado: 'Activo' },
        metodoPago: 'Efectivo',
        detalles: [],
        lugarId: { _id: 'l1', codigo: 'LUG001', distrito: 'Centro', costo: 5 } as any
      },
      {
        _id: 'v2',
        serie: 'F01',
        nroComprobante: '00000002',
        fechaEmision: new Date('2025-02-01'),
        fechaVenc: new Date('2025-02-15'),
        tipoComprobante: 'FACTURA ELECTRONICA',
        total: 250.5,
        estado: 'Pagada',
        moneda: 'S/',
        tipoCambio: 3.66,
        cliente: { _id: 'c2', nombre: 'Test Cliente Dos', tipoDoc: 'RUC', nroDoc: '20123456789', telefono: '912345678', correo: 'cliente2@example.com', estado: 'Activo' },
        metodoPago: 'Transferencia',
        detalles: [],
        lugarId: { _id: 'l2', codigo: 'LUG002', distrito: 'Norte', costo: 10 } as any
      }
    ];

    // Creamos una copia invertida para la expectativa
    const expectedVentas = [...mockVentas].reverse();

    ventaServiceSpy.getAllVentas.and.returnValue(of(mockVentas));

    // Invocamos el método que suscribe y asigna `listVentas`
    component.obtenerVentas();

    expect(ventaServiceSpy.getAllVentas).toHaveBeenCalledTimes(1);
    expect(component.listVentas).toEqual(expectedVentas);
  });
});
