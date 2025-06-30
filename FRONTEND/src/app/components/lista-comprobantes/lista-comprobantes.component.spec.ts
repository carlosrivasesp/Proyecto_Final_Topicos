// src/app/components/lista-comprobantes/lista-comprobantes.component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router'; // Importado: Necesario para el tipo ActivatedRoute

import { ListaComprobantesComponent } from './lista-comprobantes.component';
import { VentaService } from '../../services/venta.service';
import { Venta } from '../../models/venta';
import { DetalleVenta } from '../../models/detalleV';

describe('ListaComprobantesComponent', () => {
  let component: ListaComprobantesComponent;
  let fixture: ComponentFixture<ListaComprobantesComponent>;
  let ventaServiceSpy: jasmine.SpyObj<VentaService>;
  let httpTestingController: HttpTestingController;
  let toastrServiceSpy: jasmine.SpyObj<ToastrService>;

  // Mock para ActivatedRoute
  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: (key: string) => 'mockId' // Si tu componente lee IDs de la ruta
      }
    },
    paramMap: of({ // Si tu componente se suscribe a paramMap
      get: (key: string) => 'mockId'
    })
  };

  beforeEach(async () => {
    ventaServiceSpy = jasmine.createSpyObj('VentaService', ['getAllVentas']);
    toastrServiceSpy = jasmine.createSpyObj('ToastrService', ['success', 'error', 'info', 'warning']);

    await TestBed.configureTestingModule({
      declarations: [ListaComprobantesComponent],
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot()
      ],
      providers: [
        { provide: VentaService, useValue: ventaServiceSpy },
        { provide: ToastrService, useValue: toastrServiceSpy },
        // AÑADIDO: Provee un mock para ActivatedRoute
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaComprobantesComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  // PRUEBA ÚNICA SOLICITADA: Cargar comprobantes, revertir y asignar a listVentas
  it('should load all comprobantes, reverse them, and assign to listVentas', () => {
    const mockVentas: Venta[] = [
      {
        _id: 'v1',
        serie: 'B01',
        nroComprobante: '00000001',
        fechaEmision: new Date('2025-01-01'),
        fechaVenc: new Date('2025-01-15'),
        tipoComprobante: 'BOLETA DE VENTA ELECTRONICA',
        total: 100.00,
        estado: 'Pendiente',
        moneda: 'S/',
        tipoCambio: 3.66,
        cliente: {
          _id: 'c1',
          nombre: 'Test Cliente Uno',
          tipoDoc: 'DNI',
          nroDoc: '12345678',
          telefono: '987654321',
          correo: 'cliente1@example.com',
          estado: 'Activo'
        },
        metodoPago: 'Efectivo',
        detalles: [
          {
            ventaId: { _id: 'v1' } as Venta,
            producto: { _id: 'p1', codigo: 'PROD001', nombre: 'Martillo', precio: 50 } as any,
            lugarId: { _id: 'l1', codigo: 'LUG001', distrito: 'Centro', costo: 5 } as any,
            codInt: 'PROD001',
            nombre: 'Martillo',
            cantidad: 2,
            precio: 50,
            codigoL: 'LUG001',
            distrito: 'Centro',
            costoL: 5,
            subtotal: 100
          } as DetalleVenta
        ],
        lugarId: { _id: 'l1', codigo: 'LUG001', distrito: 'Centro', costo: 5 } as any
      } as Venta,
      {
        _id: 'v2',
        serie: 'F01',
        nroComprobante: '00000002',
        fechaEmision: new Date('2025-02-01'),
        fechaVenc: new Date('2025-02-15'),
        tipoComprobante: 'FACTURA ELECTRONICA',
        total: 250.50,
        estado: 'Pagada',
        moneda: 'S/',
        tipoCambio: 3.66,
        cliente: {
          _id: 'c2',
          nombre: 'Test Cliente Dos',
          tipoDoc: 'RUC',
          nroDoc: '20123456789',
          telefono: '912345678',
          correo: 'cliente2@example.com',
          estado: 'Activo'
        },
        metodoPago: 'Transferencia',
        detalles: [
          {
            ventaId: { _id: 'v2' } as Venta,
            producto: { _id: 'p2', codigo: 'SERV001', nombre: 'Servicio A', precio: 250.50 } as any,
            lugarId: { _id: 'l2', codigo: 'LUG002', distrito: 'Norte', costo: 10 } as any,
            codInt: 'SERV001',
            nombre: 'Servicio A',
            cantidad: 1,
            precio: 250.50,
            codigoL: 'LUG002',
            distrito: 'Norte',
            costoL: 10,
            subtotal: 250.50
          } as DetalleVenta
        ],
        lugarId: { _id: 'l2', codigo: 'LUG002', distrito: 'Norte', costo: 10 } as any
      } as Venta
    ];

    ventaServiceSpy.getAllVentas.and.returnValue(of(mockVentas));

    fixture.detectChanges();

    expect(ventaServiceSpy.getAllVentas).toHaveBeenCalledTimes(1);
    expect(component.listVentas).toEqual(mockVentas.slice().reverse());
  });
});
