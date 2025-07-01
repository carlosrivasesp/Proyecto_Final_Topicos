import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { EntregasComponent } from './entregas.component';
import { EntregaService } from '../../services/entregas.service';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('EntregasComponent', () => {
  let component: EntregasComponent;
  let fixture: ComponentFixture<EntregasComponent>;
  let entregasServiceSpy: jasmine.SpyObj<EntregaService>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    entregasServiceSpy = jasmine.createSpyObj('EntregaService', ['getAllEntregas', 'editarEstado']);
    toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);

    await TestBed.configureTestingModule({
      declarations: [EntregasComponent],
      imports: [ ToastrModule.forRoot() ],
      providers: [
        { provide: EntregaService, useValue: entregasServiceSpy },
        { provide: ToastrService, useValue: toastrSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA] 
    }).compileComponents();

    fixture = TestBed.createComponent(EntregasComponent);
    component = fixture.componentInstance;

    (window as any).bootstrap = {
      Modal: {
        getInstance: () => ({ hide: () => {} })
      }
    };
  });

  fit('al programar entrega llama a editarEstado y muestra toast y recarga entregas', fakeAsync(() => {

    entregasServiceSpy.editarEstado.and.returnValue(of({}));

    const obtenerSpy = spyOn(component, 'obtenerEntregas');

    component.direccion = 'Av. Siempre Viva 742';
    component.fechaInicio = '2025-07-01';
    component.fechaFin = '2025-07-02';

    component.cambiarEstado('entrega123', 'En proceso');

    tick();

    expect(entregasServiceSpy.editarEstado).toHaveBeenCalledOnceWith('entrega123', {
      estado: 'En proceso',
      direccion: 'Av. Siempre Viva 742',
      fechaInicio: '2025-07-01',
      fechaFin: '2025-07-02'
    });
    expect(toastrSpy.success).toHaveBeenCalledWith('Entrega programada', 'Éxito');

    expect(obtenerSpy).toHaveBeenCalled();
  }));

});
