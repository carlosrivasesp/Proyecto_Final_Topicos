import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrarCompraComponent } from './registrar-compra.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProductoService } from '../../services/producto.service';
import { ToastrService } from 'ngx-toastr';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

describe('RegistrarCompraComponent', () => {
  let component: RegistrarCompraComponent;
  let fixture: ComponentFixture<RegistrarCompraComponent>;

  const productoServiceMock = {
    getAllProductos: () => ({
      subscribe: (callback: any) => callback([]) // simula respuesta vacía
    })
  };

  beforeEach(async () => {
    const toastrServiceSpy = jasmine.createSpyObj('ToastrService', [
      'success',
      'error',
      'info',
      'warning',
    ]);

    await TestBed.configureTestingModule({
      declarations: [RegistrarCompraComponent],
      imports: [ReactiveFormsModule, FormsModule, HttpClientTestingModule],
      providers: [
        { provide: ProductoService, useValue: productoServiceMock },
        { provide: ToastrService, useValue: toastrServiceSpy },
        { provide: ActivatedRoute, useValue: {} }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrarCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

   it('debería calcular correctamente el IGV y el total', () => {
    // Simulamos productos registrados
    component.elementosRegistrados = [
      {
        producto: {} as any,
        codigo: 'P001',
        nombre: 'Producto 1',
        cant: 2,
        precio: 100,
        subtotal: 200,
      },
      {
        producto: {} as any,
        codigo: 'P002',
        nombre: 'Producto 2',
        cant: 1,
        precio: 50,
        subtotal: 50,
      },
    ];

    // Ejecutar el cálculo
    (component as any).actualizarTotalYIgv();
    fixture.detectChanges();

    // Log para ver en consola
    console.log('IGV calculado:', component.igv);
    console.log('Total calculado:', component.total);

    // Validación esperada
    expect(component.igv).toBeCloseTo(45, 2);
    expect(component.total).toBeCloseTo(295, 2);

    const igvElement = fixture.debugElement.query(By.css('#igv')).nativeElement;
    const totalElement = fixture.debugElement.query(
      By.css('#total')
    ).nativeElement;

    console.log('Texto en el DOM - IGV:', igvElement.textContent);
    console.log('Texto en el DOM - Total:', totalElement.textContent);

    expect(igvElement.textContent).toBe('45.00');
    expect(totalElement.textContent).toBe('295.00');
  });
});
