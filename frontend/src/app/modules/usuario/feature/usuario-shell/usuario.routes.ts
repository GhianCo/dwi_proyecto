import { Routes } from "@angular/router";
import { UsuarioPage } from "./usuario.page";
import { UsuarioListComponent } from "../usuario-list/usuario.list.component";
import { UsuarioListResolver } from "../usuario-list/usuario.list.resolvers";
import { usuarioNewResolver } from "../usuario-detail/resolvers/usuario.new.resolvers";
import { UsuarioDetailComponent } from "../usuario-detail/usuario.detail.component";
import { canDeactivateUsuarioDetail } from "../usuario-detail/usuario.detail.guards";
import { usuarioDetailResolver } from "../usuario-detail/resolvers/usuario.detail.resolvers";
import { permissionGuard } from "app/core/auth/permission.guard";

export default [
    {
        path: '',
        component: UsuarioPage,
        canActivate: [permissionGuard],
        data: {
            acl: 'sistema.usuario'
        },
        children: [
            {
                path: '',
                component: UsuarioListComponent,
                resolve: {
                    data: UsuarioListResolver,
                },
                children: [
                    {
                        path: "new",
                        component: UsuarioDetailComponent,
                        canDeactivate: [canDeactivateUsuarioDetail],
                        resolve: {
                            provider: usuarioNewResolver,
                        }
                    },
                    {
                        path: ":id",
                        component: UsuarioDetailComponent,
                        canDeactivate: [canDeactivateUsuarioDetail],
                        resolve: {
                            provider: usuarioDetailResolver
                        }
                    }
                ]
            },

        ]
    }
] as Routes;
