// src/app/components/venta/venta.component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs'; // Necesitamos throwError para el escenario de error del servicio
import { ReactiveFormsModule, FormBuilder, Validators, FormsModule } from '@angular/forms'; 
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
import { Categoria } from '../../models/categoria'; // Necesario para mockear Producto
import { Marca } from '../../models/marca';     // Necesario para mockear Producto
// Si DetalleVenta es usado en tus modelos o directamente en el componente para tipos, impórtalo
// import { DetalleVenta } from '../../models/detalleV';


// Interfaces internas del componente (ajustadas para reflejar el componente)
// Asegúrate de que estas interfaces coincidan con las que tienes en tu VentaComponent.ts
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
  stockActual?: number; // Es importante que esta propiedad sea opcional si no todos los elementos la tienen
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

  // Mock completo para Producto (asegúrate de que Categoria y Marca existan o estén mockeadas)
  const mockProducto: Producto = {
    _id: 'p1',
    nombre: 'Martillo',
    codInt: 'PROD001',
    precio: 10,
    stockActual: 5,
    stockMin: 1, // Asegúrate de que tu modelo Producto tenga stockMin
    categoria: { _id: 'cat1', nombre: 'Herramientas' } as Categoria, // Mock simple de Categoria
    marca: { _id: 'm1', nombre: 'MarcaA' } as Marca, // Mock simple de Marca
    estado: 'Activo' // Asegúrate de que tu modelo Producto tenga estado
  };

  // Mock completo para Lugar
  const mockLugar: Lugar = {
    _id: 'l1',
    codigo: 'LUG001',
    distrito: 'Surco',
    costo: 5,
    inicio: 1672531200000,
    fin: 1672617600000,
    __v: 0 // Importante: usa __v (doble guion bajo) si tu backend lo envía así
  };


  beforeEach(async () => {
    // Configura los spies para los servicios que tu componente usa
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
        HttpClientTestingModule, // Para mockear las llamadas HTTP
        RouterTestingModule.withRoutes([]), // Para mockear el Router
        ReactiveFormsModule,
        FormsModule, // Para el uso de formularios reactivos
        ToastrModule.forRoot() // Para el servicio Toastr
      ],
      providers: [
        // Provee los spies en lugar de las instancias reales de los servicios
        { provide: VentaService, useValue: ventaServiceSpy },
        { provide: ProductoService, useValue: productoServiceSpy },
        { provide: LugarService, useValue: lugarServiceSpy },
        { provide: ClienteService, useValue: clienteServiceSpy },
        { provide: ToastrService, useValue: toastrServiceSpy },
        { provide: PLATFORM_ID, useValue: 'browser' }, // Necesario para Toastr en algunas configuraciones
        FormBuilder, // Provee FormBuilder para inicializar los formularios
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VentaComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router); // Inyecta el Router mockeado
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true)); // Espía el método navigate

    // ******** Inicializa los formularios y otras propiedades del componente aquí ********
    // Es CRÍTICO que inicialices los FormGroups y las propiedades que tu componente usa
    // antes de que se ejecute ngOnInit (que es disparado por fixture.detectChanges()).
    // El orden aquí es importante.

    // Inicializar clienteForm
    component.clienteForm = TestBed.inject(FormBuilder).group({
      nombre: ['', Validators.required],
      tipoDoc: ['', Validators.required],
      nroDoc: ['', Validators.required],
      telefono: [{ value: '', disabled: true }, Validators.required],
      correo: [{ value: '', disabled: true }, Validators.required]
    });

    // Inicializar ventaForm
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
      detalles: TestBed.inject(FormBuilder).array([]), // Asegúrate de que sea un FormArray vacío
    });

    // Espía el método getTodayString si tu componente lo usa
    spyOn(component as any, 'getTodayString').and.returnValue('01/01/2024');

    // Inicializar otras propiedades del componente que se usan en las pruebas o en el ngOnInit
    component.elementosRegistrados = [];
    component.listaProducto_Lugar = []; // Necesario para onSelectElement
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
    const expectedStock = 10; 
expect((component as any).stockDisponible).toBe(expectedStock);


    // Mockea las llamadas de carga inicial que se harán en ngOnInit
    // Aunque estas pruebas no se centran en la carga inicial, ngOnInit se dispara.
    // Provee mocks básicos para evitar errores de null o undefined.
    productoServiceSpy.getAllProductos.and.returnValue(of([mockProducto]));
    lugarServiceSpy.getAllLugares.and.returnValue(of([mockLugar]));
    clienteServiceSpy.getAllClientes.and.returnValue(of([mockCliente]));

    fixture.detectChanges(); // Esto dispara ngOnInit del componente y lo inicializa
  });

  afterEach(() => {
    // Verifica que no haya peticiones HTTP pendientes, asegurando que todos los mocks se usaron
    TestBed.inject(HttpTestingController).verify();
  });


  // --- PRUEBA 1: "que agregue productos correctamente a la tabla" ---
  // Cubre la lógica de `onRegisterElement`
  it('should add element to elementosRegistrados and update total/igv correctly', () => {
    // Mock del elemento seleccionado que se va a agregar
    const mockSelectedElement: ListaUnificada = { _id: 'p1', codigo: 'PROD001', nombre: 'Martillo', tipo: 'producto', valor: 25, stockActual: 10 };

    // Establece las propiedades del componente que onRegisterElement usará
    component.elementoSeleccionado = mockSelectedElement;
    component.cantidad = 2; // Cantidad a agregar
    component.precioSeleccionado = mockSelectedElement.valor; // Precio del elemento

    // Llama al método del componente que agrega el elemento a la "tabla"
    component.onRegisterElement();
fixture.detectChanges();
    // Verificaciones
    // 1. El elemento debe estar en la lista `elementosRegistrados`
    expect(component.elementosRegistrados.length).toBe(1);
    expect(component.elementosRegistrados[0]).toEqual({
      codigo: 'PROD001',
      nombre: 'Martillo',
      cant: 2,
      precio: 25,
      subtotal: 50 // 2 * 25
    });

    // 2. El subtotal, IGV y total deben haberse actualizado correctamente
    const expectedSubtotal = 50;
    const expectedIgv = parseFloat((expectedSubtotal * 0.18).toFixed(2)); // 9.00
    const expectedTotal = parseFloat((expectedSubtotal + expectedIgv).toFixed(2)); // 59.00

    expect(component.subtotal).toBe(expectedSubtotal);
    expect(component.igv).toBe(expectedIgv);
    expect(component.total).toBe(expectedTotal);

    // 3. Los campos de búsqueda y elemento seleccionado deben limpiarse
    expect(component.searchTerm).toBe('');
    expect(component.elementoSeleccionado).toBeNull();
  });


  // --- PRUEBA 2: "O si te sale pasandole solo la logica de ventas, chevere" ---
  // Cubre la lógica de `crearVenta` (registro exitoso de la venta)
  it('should call registrarVenta on VentaService when creating a new sale successfully', () => {
    // Configura el estado del componente para que una venta sea válida para registrar
    component.clienteSeleccionado = mockCliente; // Un cliente mockeado
    component.elementosRegistrados = [ // Algunos elementos en el carrito
      { codigo: 'PROD001', nombre: 'Martillo', cant: 2, precio: 10, subtotal: 20 },
      { codigo: 'LUG001', nombre: 'Surco', cant: 1, precio: 5, subtotal: 5 }
    ];
    component.total = 25 * 1.18; // El total calculado
    component.subtotal = 25;
    component.igv = 25 * 0.18;


    // Rellena el formulario de venta con datos válidos
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
      cliente: mockCliente, // Asigna el objeto cliente completo
      metodoPago: 'Efectivo',
      detalles: [] // Se llenará en el método crearVenta
    });

    // Mockea la respuesta exitosa del servicio `registrarVenta`
    ventaServiceSpy.registrarVenta.and.returnValue(of({ message: 'Venta registrada!' }));

    // Llama al método del componente que crea la venta
    component.crearVenta();

    // Verificaciones
    // 1. El servicio `registrarVenta` debe haber sido llamado una vez
    expect(ventaServiceSpy.registrarVenta).toHaveBeenCalledTimes(1);

    // 2. El mensaje de éxito debe mostrarse con Toastr
    expect(toastrServiceSpy.success).toHaveBeenCalledWith('Venta registrada correctamente', 'Éxito');

    // 3. El componente debe navegar a la ruta de comprobantes
    expect(router.navigate).toHaveBeenCalledWith(['/comprobantes']);

    // 4. Verifica que los formularios y listas se hayan reseteado (si tu componente los resetea)
    expect(component.ventaForm.pristine).toBeTrue(); // Si se resetea
    expect(component.elementosRegistrados.length).toBe(0); // Si se vacía
    expect(component.total).toBe(0);
    expect(component.igv).toBe(0);
    expect(component.subtotal).toBe(0);
    expect(component.clienteSeleccionado).toBeNull();
  });

  
  // Puedes añadir una prueba simple de que el componente se crea, si lo deseas
  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});