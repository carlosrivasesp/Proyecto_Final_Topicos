import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SalidaProductosComponent } from './salida-productos.component';
import { SalidaService } from '../../services/salida.service';
import { ProductoService } from '../../services/producto.service';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';  // <--- Importar

describe('SalidaProductosComponent', () => {
  let component: SalidaProductosComponent;
  let fixture: ComponentFixture<SalidaProductosComponent>;
  let salidaServiceMock: any;
  let productoServiceMock: any;

  beforeEach(async () => {
    salidaServiceMock = jasmine.createSpyObj('SalidaService', ['getAllSalidas']);
    productoServiceMock = jasmine.createSpyObj('ProductoService', ['getAllProductos']);

    await TestBed.configureTestingModule({
      declarations: [SalidaProductosComponent],
      imports: [FormsModule, RouterTestingModule],
      providers: [
        { provide: SalidaService, useValue: salidaServiceMock },
        { provide: ProductoService, useValue: productoServiceMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SalidaProductosComponent);
    component = fixture.componentInstance;
  });

  it('debería obtener las salidas correctamente', () => {
    const salidasMock = [
      { tipoOperacion: 'Venta Registrada', ventaId: { nroComprobante: 'F001-123' }, fechaSalida: new Date() }
    ];

    salidaServiceMock.getAllSalidas.and.returnValue(of(salidasMock));
    productoServiceMock.getAllProductos.and.returnValue(of([]));

    fixture.detectChanges();

    expect(component.listSalidas.length).toBe(1);
    expect(component.listSalidas[0].tipoOperacion).toBe('Venta Registrada');

    expect(salidaServiceMock.getAllSalidas).toHaveBeenCalled();
  });
});
