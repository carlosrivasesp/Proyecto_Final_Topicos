import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprasSugeridasComponent } from './compras-sugeridas.component';

describe('ComprasSugeridasComponent', () => {
  let component: ComprasSugeridasComponent;
  let fixture: ComponentFixture<ComprasSugeridasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ComprasSugeridasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComprasSugeridasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
