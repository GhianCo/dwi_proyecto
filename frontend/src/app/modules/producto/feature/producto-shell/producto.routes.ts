import { Routes } from "@angular/router";
import { ProductoPage } from "./producto.page";
import { ProductoPageListComponent } from "../producto-list/producto-list.component";
import { ProductoListResolver } from "../producto-list/producto.-list.resolvers";
import { ProductoDetailComponent } from "../producto-detail/producto.detail.component";
import { canDeactivateProductoDetail } from "../producto-detail/producto-detail.guards";
import { productoNewResolver } from "../producto-detail/resolvers/producto-new.resolvers";
import { productoDetailResolver } from "../producto-detail/resolvers/producto-detail.resolvers";
import { permissionGuard } from "app/core/auth/permission.guard";

export default [
    {
        path: '',
        component: ProductoPage,
        canActivate: [permissionGuard],
        data: {
            acl: 'productos.producto'
        },
        children: [
            {
                path: '',
                component: ProductoPageListComponent,
                resolve: {
                    data: ProductoListResolver,
                },
                children: [
                    {
                        path: "new",
                        component: ProductoDetailComponent,
                        canDeactivate: [canDeactivateProductoDetail],
                        resolve: {
                            provider: productoNewResolver,
                        }
                    },
                    {
                        path: ":id/:presentacionId",
                        component: ProductoDetailComponent,
                        canDeactivate: [canDeactivateProductoDetail],
                        resolve: {
                            provider: productoDetailResolver
                        }
                    }
                ]
            },

        ]
    }
] as Routes;
