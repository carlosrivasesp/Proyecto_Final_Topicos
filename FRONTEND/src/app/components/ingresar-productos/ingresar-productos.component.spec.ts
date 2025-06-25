import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngresarProductosComponent } from './ingresar-productos.component';

describe('IngresarProductosComponent', () => {
  let component: IngresarProductosComponent;
  let fixture: ComponentFixture<IngresarProductosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IngresarProductosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IngresarProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
