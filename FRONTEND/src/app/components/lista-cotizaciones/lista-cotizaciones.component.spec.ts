import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoCotizacionesComponent } from './lista-cotizaciones.component';

describe('ListaCotizacionesComponent', () => {
  let component: ListadoCotizacionesComponent;
  let fixture: ComponentFixture<ListadoCotizacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListadoCotizacionesComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ListadoCotizacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
