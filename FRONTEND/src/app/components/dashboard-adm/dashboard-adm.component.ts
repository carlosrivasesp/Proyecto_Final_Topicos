import { Component } from '@angular/core';
import { ChartOptions, ChartType, ChartData } from 'chart.js';
import { Venta } from '../../models/venta';
import { Compra } from '../../models/compra';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VentaService } from '../../services/venta.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { CompraService } from '../../services/compra.service';
import { Producto } from '../../models/producto';
import { CompraSugeridaService } from '../../services/compraS.service';
import { CompraSugerida } from '../../models/compraS';

@Component({
  selector: 'app-dashboard-adm',
  standalone: false,
  templateUrl: './dashboard-adm.component.html',
  styleUrls: ['./dashboard-adm.component.css']
})
export class DashboardAdmComponent {
listCompras: Compra[]=[];
listVentas: Venta[] = [];
comprasPendientes: Compra[] = [];
ventasPendientes: Venta[] = [];
listCompraSugeridas: CompraSugerida[]=[];
  idCompra: string | null ;
  compraForm: FormGroup ;
  idVenta: string | null;
  ventaForm: FormGroup;
  selectedVenta: any = null;
  selectedFilter: string = 'cliente';
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 3;
  selectedCompra: any = null;
  //definimos las variables para los rangos
  fechaInicioFiltro: Date | null = null; 
  fechaFinFiltro: Date | null = null;    



  
  constructor(
    private _ventaService: VentaService,
    private _compraService: CompraService,
    private _compraSugService: CompraSugeridaService,
    private toastr: ToastrService,
    private router: Router,
    private aRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.ventaForm = this.fb.group({
      tipoComprobante: [''],
      serie: [''],
      nroComprobante: [''],
      fechaEmision: [{ value: '', disabled: true }],
      fechaVenc: [{ value: '', disabled: true }],
      total: [''],
      estado: ['', Validators.required],
      moneda: [''],
      tipoCambio: [''],
      cliente: [''],
      metodoPago: ['', Validators.required],
      detalles: this.fb.array([]),
    });

      this.compraForm = this.fb.group({
      tipoComprobante: [''],
      serie: [''],
      nroComprobante: [''],
      fechaEmision: [{ value: '', disabled: true }],
      fechaVenc: [{ value: '', disabled: true }],
      igv: [''],
      total: [''],
      estado: ['', Validators.required],
      moneda: [''],
      tipoCambio: [''],
      proveedor: [''],
      metodoPago: ['', Validators.required],
      detalleC: this.fb.array([]),
    });
    this.idCompra = this.aRoute.snapshot.paramMap.get('id');
    this.idVenta = this.aRoute.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.obtenerVentas();
    this.obtenerCompras();
    this.obtenerComprasSugeridas();
    this.obtenerComprasPendientes();
    this.obtenerVentasPendientes();
    
  }



obtenerComprasSugeridas(): void {
  this._compraSugService.getSugerencias().subscribe({
    next: (data: CompraSugerida[]) => {
      this.listCompraSugeridas = data;
    },
    error: (error) => {
      console.error('Error al obtener productos', error);
      this.toastr.error('Error al cargar los productos', 'Error');
    }
  });
}

  get filteredCompras(): Compra[] {
    if (!this.searchTerm.trim()) return this.listCompras;

    const term = this.searchTerm.toLowerCase();
    switch (this.selectedFilter) {
      case 'proveedor':
        return this.listCompras.filter((c) =>
          c.proveedor?.nombre?.toLowerCase().includes(term)
        );
      case 'fecha':
        return this.listCompras.filter((s) =>
          s.fechaEmision
            ? this.formatDate(s.fechaEmision).includes(term)
            : false
        );
      default:
        return this.listCompras;
    }
  }
  //------------------------------------------------------------------------------------
obtenerComprasPendientes(): void {
  this._compraService.getAllCompras().subscribe({
    next: (data: Compra[]) => {
      this.comprasPendientes = data
        .filter(compra => compra.estado === 'Pendiente')
        .reverse()
        .slice(0, 5); 
    },
    error: (err) => {
      console.error(err);
      this.toastr.error('Error al obtener las compras pendientes', 'Error');
    }
  });
}



obtenerVentasPendientes(): void {
  this._ventaService.getAllVentas().subscribe({
    next: (data: Venta[]) => {
      this.ventasPendientes = data.filter(venta => venta.estado === 'Pendiente')
         .reverse() 
         .slice(0, 5); 
    },
    error: (err) => {
      console.error(err);
      this.toastr.error('Error al obtener las ventas pendientes', 'Error');
    }
  });
}

  obtenerCompras(): void {
  this._compraService.getAllCompras().subscribe({
    next: (data) => {
      this.listCompras = data.reverse()
    },
    error: (err) => {
      console.error(err);
      this.toastr.error('Error al obtener las compras', 'Error');
    }
  });
}

obtenerVentas(): void {
  this._ventaService.getAllVentas().subscribe({
    next: (data) => {
      this.listVentas = data.reverse(); 
      this.procesarProductosMasVendidos(); //para la grafica de los productos x mes
    },
    error: (err) => {
      console.error(err);
      this.toastr.error('Error al obtener las ventas', 'Error');
    },
  });
}
  get filteredVentas(): Venta[] {
    if (!this.searchTerm.trim()) return this.listVentas;

    const term = this.searchTerm.toLowerCase();
    switch (this.selectedFilter) {
      case 'cliente':
        return this.listVentas.filter((v) =>
          v.cliente?.nombre?.toLowerCase().includes(term)
        );
      case 'fecha':
        return this.listVentas.filter((s) =>
          s.fechaEmision
            ? this.formatDate(s.fechaEmision).includes(term)
            : false
        );
      default:
        return this.listVentas;
    }
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  //----funcion para hayar el mes con mas ventas(retornamos un numerico)
get mesConMasVentas(): { mes: string, cantidad: number } | null {
  if (!this.listVentas.length) {
    return null;
  }

  const ventasPorMes: { [key: string]: number } = {};

  this.listVentas.forEach((venta) => {
    if (
      venta.estado === 'Registrado' &&
      venta.fechaEmision
    ) {
      const fechaEmision = new Date(venta.fechaEmision);

      // validacion de los rangos
      if (this.fechaInicioFiltro && fechaEmision < this.fechaInicioFiltro) {
        return; 
      }
      if (this.fechaFinFiltro && fechaEmision > this.fechaFinFiltro) {
        return; 
      }

      const year = "";
      const month = String(fechaEmision.getMonth() + 1).padStart(2, '0');
      const key = `${year}-${month}`;

      ventasPorMes[key] = (ventasPorMes[key] || 0) + 1;
    }
  });

  let mesConMasVentas: string = '';
  let maxVentas = 0;

  for (const [key, cantidad] of Object.entries(ventasPorMes)) {
    if (cantidad > maxVentas) {
      maxVentas = cantidad;
      mesConMasVentas = key;
    }
  }

  return mesConMasVentas
    ? { mes: mesConMasVentas, cantidad: maxVentas }
    : null;
}


//obtener los nombres de cada mes en base al mes que se esta estableciendo en la variable del front
getNombreMes(mesKey: string): string {
  const [year, month] = mesKey.split('-'); // Divide "YYYY-MM" en año y mes
  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  const mesIndex = parseInt(month) - 1; // Convertimos a número desde el 0
  return `${meses[mesIndex]} ${year}`; 
}

get totalDeVentas(): number {
  return this.listVentas.filter(venta => {

    //solo los contamos si su estado es "Registrado"
    if (venta.estado !== 'Registrado' || !venta.fechaEmision) {
      return false;
    }

    const fechaEmision = new Date(venta.fechaEmision); //guardamos la fechaEmision de la venta en la variable

    //validaciones para que la venta se encuentre en el rango emision y vencimiento
    if (this.fechaInicioFiltro && fechaEmision < this.fechaInicioFiltro) {
      return false;
    }
    if (this.fechaFinFiltro && fechaEmision > this.fechaFinFiltro) {
      return false;
    }

    return true;
  }).length; //.length para sacar el numero de ventas
}


//funcion para obtener el mes con menos ventas
get mesConMenosVentas(): { mes: string, cantidad: number } | null {
  //si no hay nada en la lista retornamos null
  if (!this.listVentas.length) {
    return null;
  }

  const ventasPorMes: { [key: string]: number } = {};
  
  this.listVentas.forEach((venta) => {
    if (
      venta.estado === 'Registrado' &&
      venta.fechaEmision &&
      venta.fechaVenc
    ) {
      const fechaEmision = new Date(venta.fechaEmision);
      const fechaVenc = new Date(venta.fechaVenc);

      if (fechaEmision <= fechaVenc) {
        const year = ""; // Ignorar año 
        const month = String(fechaEmision.getMonth() + 1).padStart(2, '0');
        const key = `${year}-${month}`;

        ventasPorMes[key] = (ventasPorMes[key] || 0) + 1;
      }
    }
  });

  let mesConMenosVentas: string = '';
  let minVentas = Infinity;

  for (const [key, cantidad] of Object.entries(ventasPorMes)) {
    if (cantidad < minVentas) {
      minVentas = cantidad;
      mesConMenosVentas = key;
    }
  }

  return mesConMenosVentas
    ? { mes: mesConMenosVentas, cantidad: minVentas }
    : null;
}


get productoMasVendido(): { nombre: string, cantidad: number } | null {
  if (!this.listVentas.length) {
    return null;
  }

  const cantidadesPorProducto: { [productoId: string]: { nombre: string, cantidad: number } } = {};

  const now = new Date();
  const mesActual = now.getMonth();       // 0 = enero, ... 4 = mayo, etc.
  const añoActual = now.getFullYear();

  this.listVentas.forEach((venta) => {
    if (
      venta.estado === 'Registrado' &&
      venta.detalles && 
      venta.detalles.length &&
      venta.fechaEmision
    ) {
      const fechaEmision = new Date(venta.fechaEmision);
      if (fechaEmision.getMonth() === mesActual && fechaEmision.getFullYear() === añoActual) {
        venta.detalles.forEach(detalle => {
          if (cantidadesPorProducto[detalle.nombre]) {
            cantidadesPorProducto[detalle.nombre].cantidad += detalle.cantidad;
          } else {
            cantidadesPorProducto[detalle.nombre] = {
              nombre: detalle.nombre,
              cantidad: detalle.cantidad
            };
          }
        });
      }
    }
  });

  let productoMasVendido = null;
  let maxCantidad = 0;

  for (const productoId in cantidadesPorProducto) {
    if (cantidadesPorProducto[productoId].cantidad > maxCantidad) {
      maxCantidad = cantidadesPorProducto[productoId].cantidad;
      productoMasVendido = cantidadesPorProducto[productoId];
    }
  }

  return productoMasVendido;
}

productosMasVendidos: string[] = [];
cantidades: number[] = [];

procesarProductosMasVendidos() {
  const cantidadesPorProducto: { [nombre: string]: number } = {};

  const now = new Date();
  const mesActual = now.getMonth(); // 0=enero, 11=diciembre
  const añoActual = now.getFullYear();

  this.listVentas.forEach(venta => {
    if (venta.estado === 'Registrado' && venta.detalles && venta.detalles.length) {
      const fechaEmision = new Date(venta.fechaEmision);
      if (fechaEmision.getMonth() === mesActual && fechaEmision.getFullYear() === añoActual) {
        venta.detalles.forEach(detalle => {
          cantidadesPorProducto[detalle.nombre] = (cantidadesPorProducto[detalle.nombre] || 0) + detalle.cantidad;
        });
      }
    }
  });

  // Convertimos a array para ordenar por cantidad descendente
  const productosOrdenados = Object.entries(cantidadesPorProducto)
    .sort((a, b) => b[1] - a[1])  // Orden descendente por cantidad
    .slice(0, 5);  // Tomar solo los primeros 5 productos

  // Separamos etiquetas y cantidades de los top 5
  this.productosMasVendidos = productosOrdenados.map(item => item[0]);
  this.cantidades = productosOrdenados.map(item => item[1]);

  this.barChartData = {
    labels: this.productosMasVendidos,
    datasets: [
      {
        data: this.cantidades,
        label: 'Cantidad Vendida',
        backgroundColor: this.productosMasVendidos.map(() => '#0B3D1C'),
        borderColor: '#fff',
        borderWidth: 1,
        hoverBackgroundColor: this.productosMasVendidos.map(() => '#218838')
      }
    ]
  };
}

get ingresosTotales(): number {
  return this.listVentas
    .filter(venta => 
      venta.estado === 'Registrado' &&
      venta.fechaEmision &&
      (!this.fechaInicioFiltro || new Date(venta.fechaEmision) >= this.fechaInicioFiltro) &&
      (!this.fechaFinFiltro || new Date(venta.fechaEmision) <= this.fechaFinFiltro)
    )
    .reduce((acumulado, venta) => acumulado + (venta.total || 0), 0);
}

get totalComprasRegistradas(): number {
  return this.listCompras
    .filter(compra =>
      compra.estado === 'Registrado'
    )
    .reduce((total, compra) => total + (compra.total || 0), 0);
}


  // Gráfico de barras: Productos más vendidos
public barChartOptions: ChartOptions = {
  responsive: true,
  scales: {
    x: {
      ticks: {
        callback: function(value: any, index: number, ticks: any) {
          const label = this.getLabelForValue(value); 
          return label.length > 10 ? label.slice(0, 10) + '…' : label;  // Truncar si es muy largo
        },
        maxRotation: 45,  // Opcional: rota el texto si aún hay problemas de espacio
        minRotation: 0,
        font: {
          size: 11
        }
      }
    },
    y: {
      beginAtZero: true
    }
  },
  plugins: {
    tooltip: {
      callbacks: {
        title: (tooltipItems) => {
          return tooltipItems[0].label;  // Mostrar label completo en el tooltip
        }
      }
    },
    legend: {
      labels: {
        font: {
          size: 12
        }
      }
    }
  }
};

  
  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = {
    datasets: [],
  };
}  
