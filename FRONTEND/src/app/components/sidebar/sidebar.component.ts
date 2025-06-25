import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  activeLink: string = '';
openSubmenu: string | null = null;

ngOnInit() {
  // Solo restaurar estado si fue una recarga
  if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {
    const savedLink = localStorage.getItem('activeLink');
    const savedSubmenu = localStorage.getItem('openSubmenu');
    if (savedLink) {
      this.activeLink = savedLink;
    }
    if (savedSubmenu) {
      this.openSubmenu = savedSubmenu;
    }
  }
}

setActiveLink(link: string): void {
  this.activeLink = link;
  localStorage.setItem('activeLink', link);

  const submenuMap: { [key: string]: string } = {
    'nuevo-comprobante': 'submenu1',
    'listado-comprobantes': 'submenu1',
    'pagos-pendientes': 'submenu1',

    'nueva-cotizacion': 'submenu2',
    'listado-cotizaciones': 'submenu2',

    'productos': 'submenu3',
    'categorias': 'submenu3',
    'marcas': 'submenu3',
    'entregas': 'submenu3',
    'lugares-entrega': 'submenu3',

    'ingresos': 'submenu4',
    'salidas': 'submenu4',
    'devoluciones': 'submenu4',

    'registrar-compra': 'submenu5',
    'listado-compras': 'submenu5',
    'compras-sugeridas': 'submenu5',
  };

  this.openSubmenu = submenuMap[link] || null;
  localStorage.setItem('openSubmenu', this.openSubmenu || '');
}

toggleSubmenu(menuId: string): void {
  this.openSubmenu = this.openSubmenu === menuId ? null : menuId;
}

}
