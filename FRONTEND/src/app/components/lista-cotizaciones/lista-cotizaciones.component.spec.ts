import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaCotizacionesComponent } from './lista-cotizaciones.component';

describe('ListaCotizacionesComponent', () => {
  let component: ListaCotizacionesComponent;
  let fixture: ComponentFixture<ListaCotizacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListaCotizacionesComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ListaCotizacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
