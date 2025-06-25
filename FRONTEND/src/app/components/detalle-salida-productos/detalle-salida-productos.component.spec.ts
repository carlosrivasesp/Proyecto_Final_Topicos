import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleSalidaProductosComponent } from './detalle-salida-productos.component';

describe('DetalleSalidaProductosComponent', () => {
  let component: DetalleSalidaProductosComponent;
  let fixture: ComponentFixture<DetalleSalidaProductosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetalleSalidaProductosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleSalidaProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
