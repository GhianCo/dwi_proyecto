import { Routes } from "@angular/router";
import { permissionGuard } from "app/core/auth/permission.guard";
import { VentaPage } from "./venta.page";
import { VentaListComponent } from "../venta-list/venta-list.component";
import { VentaListResolver } from "../venta-list/venta-list.resolver";

export default [
    {
        path: 'nueva-venta',
        component: VentaPage,
        canActivate: [permissionGuard],
        data: {
            acl: 'caja.venta'
        },
    
    },
    {
        path: "list-venta",
        component: VentaListComponent,
        canActivate: [permissionGuard],
        data: {
            acl: 'caja.venta'
        },
        resolve: {
            provider: VentaListResolver,
        }
    }
] as Routes;
