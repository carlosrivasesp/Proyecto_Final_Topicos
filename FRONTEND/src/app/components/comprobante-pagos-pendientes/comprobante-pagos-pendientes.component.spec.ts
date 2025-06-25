import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComprobantePagosPendientesComponent } from './comprobante-pagos-pendientes.component';

describe('ComprobantePagosPendientesComponent', () => {
  let component: ComprobantePagosPendientesComponent;
  let fixture: ComponentFixture<ComprobantePagosPendientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ComprobantePagosPendientesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComprobantePagosPendientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
