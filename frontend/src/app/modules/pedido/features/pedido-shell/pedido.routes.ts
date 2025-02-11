import { Routes } from "@angular/router";
import { permissionGuard } from "app/core/auth/permission.guard";
import { VentaPage } from "app/modules/venta/feature/venta-shell/venta.page";
import { ListaPedidos } from "../lista-pedidos/lista-pedidos.component";
import { NuevoPedidoComponent } from "../nuevo-pedido/nuevo-pedido.component";
import { ListaPedidosResolver } from "../lista-pedidos/lista-pedidos..resolver";


export default [
    {
        path: 'nuevopedido',
        component: NuevoPedidoComponent,
        canActivate: [permissionGuard],
        data: {
            acl: 'pedido.nuevopedido'
        },
    
    },
    {
        path: 'listapedidos',
        component: ListaPedidos,
        canActivate: [permissionGuard],
        data: {
            acl: 'pedido.listapedidos'
        },
        resolve: {
            provider: ListaPedidosResolver
        }
    
    },
    
] as Routes;
