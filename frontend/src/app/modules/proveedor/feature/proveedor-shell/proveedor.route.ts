import { Routes } from "@angular/router";
import { TransportistaPage } from "./proveedor.page";
import { ProveedorListComponent } from "../proveedor-list/proveedor-list.component";
import { TransportistaListResolver } from "../proveedor-list/proveedor-list.resolvers";
import { ProveeodrDetailComponent } from "../transportista-detail/proveedor-detail.component";
import { canDeactivateTransportistaDetail } from "../transportista-detail/proveedor-detail.guards";
import { proveedorNewResolver } from "../transportista-detail/resolvers/proveedor.new.resolvers";
import { proveedorDetailResolver } from "../transportista-detail/resolvers/proveedor.detail.resolvers";
import { permissionGuard } from "app/core/auth/permission.guard";


export default [
    {
        path: '',
        component: TransportistaPage,
        canActivate: [permissionGuard],
        data: {
            acl: 'gestion.proveedor'
        },
        children: [
            {
                path: '',
                component: ProveedorListComponent,
                resolve: {
                    data: TransportistaListResolver,
                },
                children: [
                    {
                        path: "new",
                        component: ProveeodrDetailComponent,
                        canDeactivate: [canDeactivateTransportistaDetail],
                        resolve: {
                            provider: proveedorNewResolver,
                        }
                    },
                    {
                        path: ":id",
                        component: ProveeodrDetailComponent,
                        canDeactivate: [canDeactivateTransportistaDetail],
                        resolve: {
                            provider: proveedorDetailResolver
                        }
                    }
                ]
            },

        ]
    }
] as Routes;
