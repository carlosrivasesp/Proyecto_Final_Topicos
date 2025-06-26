import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IngresarProductosComponent } from './ingresar-productos.component';
import { IngresoService } from '../../services/ingreso.service';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Compra } from '../../models/compra';
import { Venta } from '../../models/venta';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('IngresarProductosComponent', () => {
  let component: IngresarProductosComponent;
  let fixture: ComponentFixture<IngresarProductosComponent>;
  let ingresoServiceMock: any;

  beforeEach(async () => {
    ingresoServiceMock = jasmine.createSpyObj('IngresoService', [
      'getAllIngresos',
    ]);

    await TestBed.configureTestingModule({
      declarations: [IngresarProductosComponent],
      imports: [FormsModule, RouterTestingModule, HttpClientTestingModule],
      providers: [
        { provide: IngresoService, useValue: ingresoServiceMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(IngresarProductosComponent);
    component = fixture.componentInstance;
  });

  fit('debería obtener los ingresos correctamente y asignar listIngresos', () => {
    const ingresosMock = [
      {
        tipoOperacion: 'Compra registrada',
        compraId: { nroComprobante: 'C001-123' },
        ventaId: { nroComprobante: 'V001-123' },
        fechaIngreso: new Date('2023-06-01'),
      },
    ];

    ingresoServiceMock.getAllIngresos.and.returnValue(of(ingresosMock));

    fixture.detectChanges();

    console.log('listIngresos después de cargar:', component.listIngresos);

    expect(ingresoServiceMock.getAllIngresos).toHaveBeenCalled();
    expect(component.listIngresos.length).toBe(1);
    expect(component.listIngresos[0].tipoOperacion).toBe('Compra registrada');
  });

  describe('filteredIngresos', () => {
    beforeEach(() => {
      component.listIngresos = [
        {
          tipoOperacion: 'Compra registrada',
          compraId: {} as Compra,
          ventaId: {} as Venta,
          fechaIngreso: new Date('2023-06-01'),
          cantidadTotal: 0,
          detalles: [],
          detalleC: []
        },
        {
          tipoOperacion: 'Venta anulada',
          compraId: {} as Compra,
          ventaId: {} as Venta,
          fechaIngreso: new Date('2023-07-01'),
          cantidadTotal: 0,
          detalles: [],
          detalleC: []
        }
      ];
    });

    fit('filtra por tipoOperacion', () => {
      component.selectedFilter = 'tipoOperacion';
      component.searchTerm = 'compra';

      const filtered = component.filteredIngresos;

      console.log('filteredIngresos con searchTerm "compra":', filtered);

      expect(filtered.length).toBe(1);
      expect(filtered[0].tipoOperacion).toBe('Compra registrada');
    });

    fit('retorna toda la lista si searchTerm vacío', () => {
      component.selectedFilter = 'tipoOperacion';
      component.searchTerm = '';

      const filtered = component.filteredIngresos;
      console.log('filteredIngresos con searchTerm vacío:', filtered);

      expect(filtered.length).toBe(2);
    });
  });
});
