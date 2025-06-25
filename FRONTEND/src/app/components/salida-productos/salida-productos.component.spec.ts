import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalidaProductosComponent } from './salida-productos.component';

describe('SalidaProductosComponent', () => {
  let component: SalidaProductosComponent;
  let fixture: ComponentFixture<SalidaProductosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SalidaProductosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalidaProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
