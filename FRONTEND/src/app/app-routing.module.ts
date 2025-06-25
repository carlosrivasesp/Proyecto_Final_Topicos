import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { ForgotpasswordComponent } from './components/forgotpassword/forgotpassword.component';
import { DashboardAdmComponent } from './components/dashboard-adm/dashboard-adm.component';
import { ListaProductosComponent } from './components/lista-productos/lista-productos.component';
import { ListaClientesComponent } from './components/lista-clientes/lista-clientes.component';
import { VentaComponent } from './components/venta/venta.component';
import { ListaProveedoresComponent } from './components/lista-proveedores/lista-proveedores.component';
import { CotizacionesComponent } from './components/cotizaciones/cotizaciones.component';
import { ListaMarcasComponent } from './components/lista-marcas/lista-marcas.component';
import { ListaCategoriasComponent } from './components/lista-categorias/lista-categorias.component';
import { ListaComprobantesComponent } from './components/lista-comprobantes/lista-comprobantes.component';
import { DetalleComponent } from './components/detalle/detalle.component';
import { DetalleEntregaComponent } from './components/detalle-entrega/detalle-entrega.component';
import { EntregasComponent } from './components/entregas/entregas.component';
import { ReportesComponent } from './components/reportes/reportes.component';
import { IngresarProductosComponent } from './components/ingresar-productos/ingresar-productos.component';
import { SalidaProductosComponent } from './components/salida-productos/salida-productos.component';
import { PagosPendientesComponent } from './components/pagos-pendientes/pagos-pendientes.component';
import { ComprobantePagosPendientesComponent } from './components/comprobante-pagos-pendientes/comprobante-pagos-pendientes.component';
import { PrincipalComponent } from './components/principal/principal.component';
import { RegistrarCompraComponent } from './components/registrar-compra/registrar-compra.component';
import { ListadoComprasComponent } from './components/listado-compras/listado-compras.component';
import { DetalleCompraComponent } from './components/detalle-compra/detalle-compra.component';
import { DetalleSalidaProductosComponent } from './components/detalle-salida-productos/detalle-salida-productos.component';
import { DetalleIngresoProductosComponent } from './components/detalle-ingreso-productos/detalle-ingreso-productos.component';
import { ListadoCotizacionesComponent } from './components/lista-cotizaciones/lista-cotizaciones.component';
import { DetalleCotizacionComponent } from './components/detalle-cotizacion/detalle-cotizacion.component';
import { AuthGuard } from './services/auth.guard';
import { ComprasSugeridasComponent } from './components/compras-sugeridas/compras-sugeridas.component';
import { DevolucionesComponent } from './components/devoluciones/devoluciones.component';
import { DetalleDevolucionProductosComponent } from './components/detalle-devolucion-productos/detalle-devolucion-productos.component';

const routes: Routes = [
  // Rutas públicas
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'forgot-password', component: ForgotpasswordComponent },
  
  // Rutas protegidas (requieren autenticación)
  { path: 'dashboard', component: DashboardAdmComponent, canActivate: [AuthGuard] },
  { path: 'productos', component: ListaProductosComponent, canActivate: [AuthGuard] },
  { path: 'clientes', component: ListaClientesComponent, canActivate: [AuthGuard] },
  { path: 'ventas', component: VentaComponent, canActivate: [AuthGuard] },
  { path: 'proveedores', component: ListaProveedoresComponent, canActivate: [AuthGuard] },
  { path: 'marcas', component: ListaMarcasComponent, canActivate: [AuthGuard] },
  { path: 'categorias', component: ListaCategoriasComponent, canActivate: [AuthGuard] },
  { path: 'comprobantes', component: ListaComprobantesComponent, canActivate: [AuthGuard] },
  { path: 'detalle-comprobante/:id', component: DetalleComponent, canActivate: [AuthGuard] },
  { path: 'detalle-entrega', component: DetalleEntregaComponent, canActivate: [AuthGuard] },
  { path: 'entregas', component: EntregasComponent, canActivate: [AuthGuard] },
  { path: 'reportes', component: ReportesComponent, canActivate: [AuthGuard] },
  { path: 'ingresos', component: IngresarProductosComponent, canActivate: [AuthGuard] },
  { path: 'salidas', component: SalidaProductosComponent, canActivate: [AuthGuard] },
  { path: 'new-cotizaciones', component: CotizacionesComponent, canActivate: [AuthGuard] },
  { path: 'pagos-pendientes', component: PagosPendientesComponent, canActivate: [AuthGuard] },
  { path: 'comprobantepagospendientes', component: ComprobantePagosPendientesComponent, canActivate: [AuthGuard] },
  { path: 'principal', component: PrincipalComponent, canActivate: [AuthGuard] },
  { path: 'registrar-compra', component: RegistrarCompraComponent, canActivate: [AuthGuard] },
  { path: 'listado-compras', component: ListadoComprasComponent, canActivate: [AuthGuard] },
  { path: 'detalle-compra/:id', component: DetalleCompraComponent, canActivate: [AuthGuard] },
  { path: 'detalle-salida-prod/:id', component: DetalleSalidaProductosComponent, canActivate: [AuthGuard] },
  { path: 'detalle-ingreso-prod/:id', component: DetalleIngresoProductosComponent, canActivate: [AuthGuard] },
  { path: 'lista-cotizaciones', component: ListadoCotizacionesComponent, canActivate: [AuthGuard] },
  { path: 'detalle-cotizacion/:id', component: DetalleCotizacionComponent, canActivate: [AuthGuard] },
  { path: 'compras-sugeridas', component: ComprasSugeridasComponent, canActivate: [AuthGuard] },
  { path: 'detalle-cotizacion/:id/editar', component: DetalleCotizacionComponent, canActivate: [AuthGuard] },
  { path: 'devoluciones', component: DevolucionesComponent, canActivate: [AuthGuard] },
  { path: 'detalle-devolucion-prod/:id', component: DetalleDevolucionProductosComponent, canActivate: [AuthGuard] },

  // Redirecciones
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
