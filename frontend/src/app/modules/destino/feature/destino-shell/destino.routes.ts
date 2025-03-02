import {Routes} from '@angular/router';
import {DestinoPage} from './destino.page';
import {DestinoListComponent} from "../destino-list/destino.list.component";
import {DestinoDetailComponent} from "../destino-detail/destino.detail.component";
import {destinoListResolver} from "../destino-list/destino.list.resolvers";
import {destinoNewResolver} from "../destino-detail/resolvers/destino.new.resolvers";
import {destinoDetailResolver} from "../destino-detail/resolvers/destino.detail.resolvers";
import {canDeactivateDestinoDetail} from "../destino-detail/destino.detail.guards";
import {permissionGuard} from 'app/core/auth/permission.guard';

export default [
    {
        path: '',
        component: DestinoPage,
        canActivate: [permissionGuard],
        data: {
            acl: 'gestion.destino'
        },
        children: [
            {
                path: '',
                component: DestinoListComponent,
                resolve: {
                    data: destinoListResolver,
                },
                children: [
                    {
                        path: 'new',
                        component: DestinoDetailComponent,
                        resolve: {
                            provider: destinoNewResolver,
                        },
                        canDeactivate: [canDeactivateDestinoDetail]
                    },
                    {
                        path: ':id',
                        component: DestinoDetailComponent,
                        resolve: {
                            provider: destinoDetailResolver,
                        },
                        canDeactivate: [canDeactivateDestinoDetail]
                    }

                ]
            }
        ]
    }
] as Routes;
