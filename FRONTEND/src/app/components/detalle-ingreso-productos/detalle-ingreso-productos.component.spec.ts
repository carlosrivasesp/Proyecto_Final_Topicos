import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleIngresoProductosComponent } from './detalle-ingreso-productos.component';

describe('DetalleIngresoProductosComponent', () => {
  let component: DetalleIngresoProductosComponent;
  let fixture: ComponentFixture<DetalleIngresoProductosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetalleIngresoProductosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleIngresoProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
