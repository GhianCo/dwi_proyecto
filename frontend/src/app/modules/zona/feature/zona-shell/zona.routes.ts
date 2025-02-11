import { Routes } from "@angular/router";
import { ZonaPageListComponent } from "../zona-list/zona.list.component";
import { ZonaPage } from "./zona.page";
import { ZonaDetailComponent } from "../zona-detail/zona.detail.component";
import { ZonaListResolver } from "../zona-list/zona.list.resolvers";
import { canDeactivateZonaDetail } from "../zona-detail/zona.detail.guards";
import { zonaDetailResolver } from "../zona-detail/resolvers/zona.detail.resolvers";
import { zonaNewResolver } from "../zona-detail/resolvers/zona.new.resolvers";
import { permissionGuard } from "app/core/auth/permission.guard";

export default [
    {
        path: '',
        component: ZonaPage,
        canActivate: [permissionGuard],
        data: {
            acl: 'gestion.zona'
        },
        children: [
            {
                path: '',
                component: ZonaPageListComponent,
                resolve: {
                    data: ZonaListResolver,
                },
                children: [
                    {
                        path: "new",
                        component: ZonaDetailComponent,
                        canDeactivate: [canDeactivateZonaDetail],
                        resolve: {
                            provider: zonaNewResolver,
                        }
                    },
                    {
                        path: ":id",
                        component: ZonaDetailComponent,
                        canDeactivate: [canDeactivateZonaDetail],
                        resolve: {
                            provider: zonaDetailResolver
                        }
                    }
                ]
            },

        ]
    }
] as Routes;
