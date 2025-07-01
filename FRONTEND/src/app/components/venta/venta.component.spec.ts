// src/app/components/venta/venta.component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule, FormBuilder, Validators, FormsModule, FormArray } from '@angular/forms'; // <-- FormArray añadido aquí
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { PLATFORM_ID } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core'; // Añadido para ignorar elementos desconocidos si es necesario

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
import { AppModule } from '../../app.module'; // Considera eliminar si usas NO_ERRORS_SCHEMA y no necesitas otros módulos

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
  valor: number; // Aquí se usa 'valor' para el precio/costo
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

  // Este mockProducto se usará como base. Si necesitas precios diferentes en tests, los sobrescribes.
  const mockProducto: Producto = {
    _id: 'p1',
    nombre: 'Martillo',
    codInt: 'PROD001',
    precio: 10, // Precio base
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
        FormsModule,
        ToastrModule.forRoot(),
        // AppModule // Si el error NG0304 regresa (app-header), puedes importar tu AppModule o usar schemas
      ],
      providers: [
        { provide: VentaService, useValue: ventaServiceSpy },
        { provide: ProductoService, useValue: productoServiceSpy },
        { provide: LugarService, useValue: lugarServiceSpy },
        { provide: ClienteService, useValue: clienteServiceSpy },
        { provide: ToastrService, useValue: toastrServiceSpy },
        { provide: PLATFORM_ID, useValue: 'browser' },
        FormBuilder, // Asegúrate de proveer FormBuilder
      ],
      // Si el error NG0304 ('app-header is not a known element') vuelve a aparecer, descomenta esto:
      schemas: [NO_ERRORS_SCHEMA] // Ignora elementos/propiedades desconocidos en la plantilla HTML
    }).compileComponents();

    fixture = TestBed.createComponent(VentaComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

    // ******** Inicializa los formularios y otras propiedades del componente aquí ********
    // Los formularios deben inicializarse ANTES de fixture.detectChanges()
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
      detalles: TestBed.inject(FormBuilder).array([]), // Importante inicializar como FormArray
    });

    // Mock para getTodayString si tu componente lo usa
    spyOn(component as any, 'getTodayString').and.returnValue('01/01/2024');

    // Inicializa las propiedades del componente
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
    component.elementoSeleccionado = null; // Asegúrate de que su tipo sea Producto | Lugar | ListaUnificada en tu componente
    component.clienteSeleccionado = null;
    (component as any).stockDisponible = 0;


    // Mocks para los servicios que se llaman en ngOnInit u otros métodos iniciales
    productoServiceSpy.getAllProductos.and.returnValue(of([mockProducto]));
    lugarServiceSpy.getAllLugares.and.returnValue(of([mockLugar]));
    clienteServiceSpy.getAllClientes.and.returnValue(of([mockCliente]));

    fixture.detectChanges(); // Ejecuta ngOnInit y la detección inicial de cambios
  });

  afterEach(() => {
    // Verifica que no haya peticiones HTTP pendientes
    TestBed.inject(HttpTestingController).verify();
  });


  fit('se agregan elementos a la tabla y se actualiza el subtotal, igv y total', () => {
    // Definir las variables esperadas *antes* de usarlas
    const expectedSubtotal = 50;
    const expectedIgv = parseFloat((expectedSubtotal * 0.18).toFixed(2));
    const expectedTotal = parseFloat((expectedSubtotal + expectedIgv).toFixed(2));

    component.elementoSeleccionado = {
      _id: 'p1',
      codigo: 'PROD001',
      nombre: 'Martillo',
      tipo: 'producto',
      valor: 25, // Usamos 'valor' en ListaUnificada para el precio
      stockActual: 10
    } as ListaUnificada; // Casteamos explícitamente a ListaUnificada
    
    component.cantidad = 2;
    // Si precioSeleccionado toma el valor de elementoSeleccionado.valor
    component.precioSeleccionado = component.elementoSeleccionado.valor; 


    // Llama al método que estamos probando
    component.onRegisterElement();

    fixture.detectChanges();

    // console.log de depuración (AHORA se ejecutarán DESPUÉS de la detección de cambios)
    console.log('Valores del componente en la prueba DESPUÉS de fixture.detectChanges():');
    console.log('  elementosRegistrados.length:', component.elementosRegistrados.length);
    console.log('  igv:', component.igv);
    console.log('  total:', component.total);

    // Asertos
    expect(component.elementosRegistrados.length).toBe(1);
    expect(component.elementosRegistrados[0].subtotal).toBe(expectedSubtotal);
    expect(component.igv).toBe(expectedIgv);
    expect(component.total).toBe(expectedTotal);

    // Asertos de reseteo de campos después de agregar
    expect(component.searchTerm).toBe('');
    expect(component.elementoSeleccionado).toBeNull();
    expect(component.cantidad).toBe(1); // Si se resetea a 1
    expect(component.precioSeleccionado).toBe(0); // Si se resetea a 0
  });


  fit('se llama al método registrarVenta del servicio de VentaService ', () => {
    component.clienteSeleccionado = mockCliente;
    component.elementosRegistrados = [
      { codigo: 'PROD001', nombre: 'Martillo', cant: 2, precio: 10, subtotal: 20 },
      { codigo: 'LUG001', nombre: 'Surco', cant: 1, precio: 5, subtotal: 5 }
    ];
    component.subtotal = 25; // Suma de subtotales de elementosRegistrados
    component.igv = parseFloat((component.subtotal * 0.18).toFixed(2)); // Cálculo real para el test
    component.total = parseFloat((component.subtotal + component.igv).toFixed(2)); // Cálculo real para el test

    component.ventaForm.patchValue({
      serie: 'B01',
      nroComprobante: '00000001',
      fechaEmision: '01/01/2024',
      tipoComprobante: 'BOLETA DE VENTA ELECTRONICA',
      fechaVenc: '01/01/2024',
      total: component.total, // Usa el total calculado
      estado: 'Pendiente',
      moneda: 'S/',
      tipoCambio: '3.66',
      cliente: mockCliente, // Asegúrate que tu formulario acepta un objeto Cliente o su ID
      metodoPago: 'Efectivo',
    });

    ventaServiceSpy.registrarVenta.and.returnValue(of({ message: 'Venta registrada!' }));

    component.crearVenta();
    fixture.detectChanges();

    expect(ventaServiceSpy.registrarVenta).toHaveBeenCalledTimes(1);
    expect(toastrServiceSpy.success).toHaveBeenCalledWith('Venta registrada correctamente', 'Éxito');
    expect(router.navigate).toHaveBeenCalledWith(['/comprobantes']);

  });
});
