import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';

//importacion para chartjs (graficas), las versiones se encuentran en el package.json
import { NgChartsModule } from 'ng2-charts';

//componentes
import { AppComponent } from './app.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { DashboardAdmComponent } from './components/dashboard-adm/dashboard-adm.component';
import { HeaderComponent } from './components/header/header.component';
import { ListaComprobantesComponent } from './components/lista-comprobantes/lista-comprobantes.component';
import { ListaClientesComponent } from './components/lista-clientes/lista-clientes.component';
import { ListaProveedoresComponent } from './components/lista-proveedores/lista-proveedores.component';
import { ListaProductosComponent } from './components/lista-productos/lista-productos.component';
import { VentaComponent } from './components/venta/venta.component';
import { ListaMarcasComponent } from './components/lista-marcas/lista-marcas.component';
import { ListaCategoriasComponent } from './components/lista-categorias/lista-categorias.component';
import { DetalleComponent } from './components/detalle/detalle.component';
import { DetalleEntregaComponent } from './components/detalle-entrega/detalle-entrega.component';
import { EntregasComponent } from './components/entregas/entregas.component';
import { ForgotpasswordComponent } from './components/forgotpassword/forgotpassword.component';
import { ReportesComponent } from './components/reportes/reportes.component';
import { IngresarProductosComponent } from './components/ingresar-productos/ingresar-productos.component';
import { SalidaProductosComponent } from './components/salida-productos/salida-productos.component';
import { CotizacionesComponent } from './components/cotizaciones/cotizaciones.component';
import { PagosPendientesComponent } from './components/pagos-pendientes/pagos-pendientes.component';
import { ComprobantePagosPendientesComponent } from './components/comprobante-pagos-pendientes/comprobante-pagos-pendientes.component';
import { FormsModule } from '@angular/forms';
import { PrincipalComponent } from './components/principal/principal.component';
import { NavbarPrincipalComponent } from './components/navbar-principal/navbar-principal.component';
import { RegistrarCompraComponent } from './components/registrar-compra/registrar-compra.component';
import { ListadoComprasComponent } from './components/listado-compras/listado-compras.component';
import { DetalleCompraComponent } from './components/detalle-compra/detalle-compra.component';
import { DetalleIngresoProductosComponent } from './components/detalle-ingreso-productos/detalle-ingreso-productos.component';
import { DetalleSalidaProductosComponent } from './components/detalle-salida-productos/detalle-salida-productos.component';
import { ListadoCotizacionesComponent } from './components/lista-cotizaciones/lista-cotizaciones.component';
import { DetalleCotizacionComponent } from './components/detalle-cotizacion/detalle-cotizacion.component';
import { ComprasSugeridasComponent } from './components/compras-sugeridas/compras-sugeridas.component';
import { DevolucionesComponent } from './components/devoluciones/devoluciones.component';
import { DetalleDevolucionProductosComponent } from './components/detalle-devolucion-productos/detalle-devolucion-productos.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    SignupComponent,
    DashboardAdmComponent,
    ListaComprobantesComponent,
    ListaClientesComponent,
    ListaProveedoresComponent,
    ListaProductosComponent,
    VentaComponent,
    ForgotpasswordComponent,
    ListaMarcasComponent,
    ListaCategoriasComponent,
    DetalleComponent,
    DetalleEntregaComponent,
    EntregasComponent,
    PagosPendientesComponent,
    ComprobantePagosPendientesComponent,
    ReportesComponent,
    IngresarProductosComponent,
    SalidaProductosComponent,
    CotizacionesComponent,
    PrincipalComponent,
    NavbarPrincipalComponent,
    RegistrarCompraComponent,
    ListadoComprasComponent,
    DetalleCompraComponent,
    DetalleIngresoProductosComponent,
    DetalleSalidaProductosComponent,
    ListadoCotizacionesComponent,
    DetalleCotizacionComponent,
    ComprasSugeridasComponent,
    DevolucionesComponent,
    DetalleDevolucionProductosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    NgChartsModule,
    FormsModule,
    LoginComponent,
    HeaderComponent

    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
