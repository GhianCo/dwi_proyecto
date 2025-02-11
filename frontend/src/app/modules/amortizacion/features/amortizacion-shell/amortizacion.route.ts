import { Routes } from "@angular/router";
import { ListaAmortizacionesComponent } from "../lista-amortizaciones/lista-amortizaciones.component";
import { permissionGuard } from "app/core/auth/permission.guard";
import { ListaPedidosResolver } from "../lista-amortizaciones/lista-amortizaciones.resolver";


export default [
    {
      path: 'listamortizaciones',
      component: ListaAmortizacionesComponent,
      canActivate: [permissionGuard],
      data: {
        acl: 'amortizacion.amortizaciones'
      },
      resolve: {
        provider: ListaPedidosResolver
      }
    }
] as Routes;
