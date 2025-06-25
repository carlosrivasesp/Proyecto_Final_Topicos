import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaComprobantesComponent } from './lista-comprobantes.component';

describe('ListaComprobantesComponent', () => {
  let component: ListaComprobantesComponent;
  let fixture: ComponentFixture<ListaComprobantesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListaComprobantesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaComprobantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
