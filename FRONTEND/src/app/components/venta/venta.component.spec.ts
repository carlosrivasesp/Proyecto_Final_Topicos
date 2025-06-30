// src/app/components/venta/venta.component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule, FormBuilder, Validators, FormsModule } from '@angular/forms'; // <-- Asegúrate de FormsModule aquí
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { PLATFORM_ID } from '@angular/core';

import { VentaComponent } from './venta.component';
import { VentaService } from '../../services/venta.service';
import { ProductoService } from '../../services/producto.service';
import { LugarService } from '../../services/lugar.service';
import { ClienteService } from '../../services/cliente.service';

// Importa tus modelos para usarlos en los mocks
import { Venta } from '../../models/venta';
import { Producto } from '../../models/producto';
import { Lugar } from '../../models/lugar';
import { Cliente } from '../../models/cliente';
import { Categoria } from '../../models/categoria';
import { Marca } from '../../models/marca';


// Interfaces internas del componente
interface ElementoRegistrado {
  codigo: string;
  nombre: string;
  cant: number;
  precio: number;
  subtotal: number;
}

interface ListaUnificada {
  _id: string;
  codigo: string;
  tipo: 'producto' | 'lugar';
  nombre: string;
  valor: number;
  stockActual?: number;
}


describe('VentaComponent', () => {
  let component: VentaComponent;
  let fixture: ComponentFixture<VentaComponent>;
  let ventaServiceSpy: jasmine.SpyObj<VentaService>;
  let productoServiceSpy: jasmine.SpyObj<ProductoService>;
  let lugarServiceSpy: jasmine.SpyObj<LugarService>;
  let clienteServiceSpy: jasmine.SpyObj<ClienteService>;
  let toastrServiceSpy: jasmine.SpyObj<ToastrService>;
  let router: Router;

  // Mocks de datos reutilizables
  const mockCliente: Cliente = { _id: 'c1', nombre: 'Test Cliente', tipoDoc: 'DNI', nroDoc: '12345678', telefono: '987654321', correo: 'test@example.com', estado: 'Activo' };

  const mockProducto: Producto = {
    _id: 'p1',
    nombre: 'Martillo',
    codInt: 'PROD001',
    precio: 10,
    stockActual: 5,
    stockMin: 1,
    categoria: { _id: 'cat1', nombre: 'Herramientas' } as Categoria,
    marca: { _id: 'm1', nombre: 'MarcaA' } as Marca,
    estado: 'Activo'
  };

  const mockLugar: Lugar = {
    _id: 'l1',
    codigo: 'LUG001',
    distrito: 'Surco',
    costo: 5,
    inicio: 1672531200000,
    fin: 1672617600000,
    __v: 0
  };


  beforeEach(async () => {
    ventaServiceSpy = jasmine.createSpyObj('VentaService', [
      'getAllVentas', 'registrarVenta', 'obtenerVenta', 'editarVenta'
    ]);
    productoServiceSpy = jasmine.createSpyObj('ProductoService', ['getAllProductos']);
    lugarServiceSpy = jasmine.createSpyObj('LugarService', ['getAllLugares']);
    clienteServiceSpy = jasmine.createSpyObj('ClienteService', ['getAllClientes', 'guardarCliente']);
    toastrServiceSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);

    await TestBed.configureTestingModule({
      declarations: [VentaComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
        ReactiveFormsModule,
        FormsModule, // <-- Asegúrate de que FormsModule esté aquí
        ToastrModule.forRoot()
      ],
      providers: [
        { provide: VentaService, useValue: ventaServiceSpy },
        { provide: ProductoService, useValue: productoServiceSpy },
        { provide: LugarService, useValue: lugarServiceSpy },
        { provide: ClienteService, useValue: clienteServiceSpy },
        { provide: ToastrService, useValue: toastrServiceSpy },
        { provide: PLATFORM_ID, useValue: 'browser' },
        FormBuilder,
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VentaComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

    // ******** Inicializa los formularios y otras propiedades del componente aquí ********
    component.clienteForm = TestBed.inject(FormBuilder).group({
      nombre: ['', Validators.required],
      tipoDoc: ['', Validators.required],
      nroDoc: ['', Validators.required],
      telefono: [{ value: '', disabled: true }, Validators.required],
      correo: [{ value: '', disabled: true }, Validators.required]
    });

    component.ventaForm = TestBed.inject(FormBuilder).group({
      serie: ['B01', Validators.required],
      nroComprobante: [''],
      fechaEmision: ['01/01/2024', Validators.required],
      tipoComprobante: ['BOLETA DE VENTA ELECTRONICA', Validators.required],
      fechaVenc: ['01/01/2024', Validators.required],
      total: [0, Validators.required],
      estado: ['Pendiente', Validators.required],
      moneda: ['S/', Validators.required],
      tipoCambio: ['3.66', Validators.required],
      cliente: ['', Validators.required],
      metodoPago: ['', Validators.required],
      detalles: TestBed.inject(FormBuilder).array([]),
    });

    spyOn(component as any, 'getTodayString').and.returnValue('01/01/2024');

    component.elementosRegistrados = [];
    component.listaProducto_Lugar = [];
    component.listaProductos = [];
    component.listaLugares = [];
    component.listClientes = [];
    component.total = 0;
    component.igv = 0;
    component.subtotal = 0;
    component.cantidad = 1;
    component.precioSeleccionado = 0;
    component.LugarSeleccionado = false;
    component.searchTerm = '';
    component.clienteSearchTerm = '';
    component.elementoSeleccionado = null;
    component.clienteSeleccionado = null;
    (component as any).stockDisponible = 0; // Casteo a any aquí por si el tipo no está 100% resuelto en spec


    productoServiceSpy.getAllProductos.and.returnValue(of([mockProducto]));
    lugarServiceSpy.getAllLugares.and.returnValue(of([mockLugar]));
    clienteServiceSpy.getAllClientes.and.returnValue(of([mockCliente]));

    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
  });


  // --- PRUEBA 1: "que agregue productos correctamente a la tabla" ---
  it('should add element to elementosRegistrados and update total/igv correctly', () => {
    const mockSelectedElement: ListaUnificada = { _id: 'p1', codigo: 'PROD001', nombre: 'Martillo', tipo: 'producto', valor: 25, stockActual: 10 };

    component.elementoSeleccionado = mockSelectedElement;
    component.cantidad = 2;
    component.precioSeleccionado = mockSelectedElement.valor;

    component.onRegisterElement();
    fixture.detectChanges(); // Fuerza la detección de cambios

    expect(component.elementosRegistrados.length).toBe(1);
    expect(component.elementosRegistrados[0]).toEqual({
      codigo: 'PROD001',
      nombre: 'Martillo',
      cant: 2,
      precio: 25,
      subtotal: 50
    });

    const expectedSubtotal = 50;
    const expectedIgv = parseFloat((expectedSubtotal * 0.18).toFixed(2));
    const expectedTotal = parseFloat((expectedSubtotal + expectedIgv).toFixed(2));

    expect(component.subtotal).toBe(expectedSubtotal);
    expect(component.igv).toBe(expectedIgv);
    expect(component.total).toBe(expectedTotal);

    expect(component.searchTerm).toBe('');
    expect(component.elementoSeleccionado).toBeNull();
  });


  // --- PRUEBA 2: "O si te sale pasandole solo la logica de ventas, chevere" ---
  it('should call registrarVenta on VentaService when creating a new sale successfully', () => {
    component.clienteSeleccionado = mockCliente;
    component.elementosRegistrados = [
      { codigo: 'PROD001', nombre: 'Martillo', cant: 2, precio: 10, subtotal: 20 },
      { codigo: 'LUG001', nombre: 'Surco', cant: 1, precio: 5, subtotal: 5 }
    ];
    component.total = 25 * 1.18;
    component.subtotal = 25;
    component.igv = 25 * 0.18;

    component.ventaForm.patchValue({
      serie: 'B01',
      nroComprobante: '00000001',
      fechaEmision: '01/01/2024',
      tipoComprobante: 'BOLETA DE VENTA ELECTRONICA',
      fechaVenc: '01/01/2024',
      total: component.total,
      estado: 'Pendiente',
      moneda: 'S/',
      tipoCambio: '3.66',
      cliente: mockCliente,
      metodoPago: 'Efectivo',
      detalles: []
    });

    ventaServiceSpy.registrarVenta.and.returnValue(of({ message: 'Venta registrada!' }));

    component.crearVenta();
    fixture.detectChanges(); // Asegura que los cambios de estado en el componente se reflejen

    expect(ventaServiceSpy.registrarVenta).toHaveBeenCalledTimes(1);
    expect(toastrServiceSpy.success).toHaveBeenCalledWith('Venta registrada correctamente', 'Éxito');
    expect(router.navigate).toHaveBeenCalledWith(['/comprobantes']);

    // Verificaciones de reseteo
    expect(component.elementosRegistrados.length).toBe(0);
    expect(component.total).toBe(0);
    expect(component.igv).toBe(0);
    expect(component.subtotal).toBe(0);
    expect(component.clienteSeleccionado).toBeNull();
    expect(component.ventaForm.pristine).toBeTrue(); // Si se resetea el formulario
  });

  // Puedes añadir una prueba simple de que el componente se crea, si lo deseas
  it('should create the VentaComponent', () => {
    expect(component).toBeTruthy();
  });
});