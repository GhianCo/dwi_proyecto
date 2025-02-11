import { Routes } from "@angular/router";
import { ClienteListComponent } from "../cliente-list/cliente-list.component";
import { ClienteListResolver } from "../cliente-list/cliente-list.resolvers";
import { ClienteDetailComponent } from "../cliente-detail/cliente-detail.component";
import { canDeactivateClienteDetail } from "../cliente-detail/cliente-detail.guards";
import { ClientePage } from "./cliente.page";
import { clienteNewResolver } from "../cliente-detail/resolvers/cliente.new.resolvers";
import { clienteDetailResolver } from "../cliente-detail/resolvers/cliente.detail.resolvers";
import { permissionGuard } from "app/core/auth/permission.guard";


export default [
    {
        path: '',
        component: ClientePage,
        canActivate: [permissionGuard],
        data: {
            acl: 'gestion.cliente'
        },
        children: [
            {
                path: '',
                component: ClienteListComponent,
                resolve: {
                    data: ClienteListResolver,
                },
                children: [
                    {
                        path: "new",
                        component: ClienteDetailComponent,
                        canDeactivate: [canDeactivateClienteDetail],
                        resolve: {
                            provider: clienteNewResolver,
                        }
                    },
                    {
                        path: ":id",
                        component: ClienteDetailComponent,
                        canDeactivate: [canDeactivateClienteDetail],
                        resolve: {
                            provider: clienteDetailResolver
                        }
                    }
                ]
            },

        ]
    }
] as Routes;
