import { Routes } from "@angular/router";
import { TransportistaPage } from "./transportista.page";
import { TransportistaListComponent } from "../transportista-list/transportista-list.component";
import { TransportistaListResolver } from "../transportista-list/transportista-list.resolvers";
import { TransportistaDetailComponent } from "../transportista-detail/transportista-detail.component";
import { canDeactivateTransportistaDetail } from "../transportista-detail/transportista-detail.guards";
import { transportistaNewResolver } from "../transportista-detail/resolvers/transportista.new.resolvers";
import { transportistaDetailResolver } from "../transportista-detail/resolvers/transportista.detail.resolvers";
import { permissionGuard } from "app/core/auth/permission.guard";


export default [
    {
        path: '',
        component: TransportistaPage,
        canActivate: [permissionGuard],
        data: {
            acl: 'gestion.cliente'
        },
        children: [
            {
                path: '',
                component: TransportistaListComponent,
                resolve: {
                    data: TransportistaListResolver,
                },
                children: [
                    {
                        path: "new",
                        component: TransportistaDetailComponent,
                        canDeactivate: [canDeactivateTransportistaDetail],
                        resolve: {
                            provider: transportistaNewResolver,
                        }
                    },
                    {
                        path: ":id",
                        component: TransportistaDetailComponent,
                        canDeactivate: [canDeactivateTransportistaDetail],
                        resolve: {
                            provider: transportistaDetailResolver
                        }
                    }
                ]
            },

        ]
    }
] as Routes;
