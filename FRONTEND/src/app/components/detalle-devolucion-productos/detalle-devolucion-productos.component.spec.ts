import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleDevolucionProductosComponent } from './detalle-devolucion-productos.component';

describe('DetalleDevolucionProductosComponent', () => {
  let component: DetalleDevolucionProductosComponent;
  let fixture: ComponentFixture<DetalleDevolucionProductosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetalleDevolucionProductosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleDevolucionProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
