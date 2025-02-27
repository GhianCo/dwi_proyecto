import {Routes} from '@angular/router';
import {PuntoDesembarquePage} from './punto.desembarque.page';
import {PuntoDesembarqueListComponent} from "../punto-desembarque-list/punto.desembarque.list.component";
import {PuntoDesembarqueDetailComponent} from "../punto-desembarque-detail/punto.desembarque.detail.component";
import {puntodesembarqueListResolver} from "../punto-desembarque-list/punto.desembarque.list.resolvers";
import {puntodesembarqueNewResolver} from "../punto-desembarque-detail/resolvers/punto.desembarque.new.resolvers";
import {puntodesembarqueDetailResolver} from "../punto-desembarque-detail/resolvers/punto.desembarque.detail.resolvers";
import {canDeactivatePuntoDesembarqueDetail} from "../punto-desembarque-detail/punto.desembarque.detail.guards";
import {permissionGuard} from 'app/core/auth/permission.guard';

export default [
    {
        path: '',
        component: PuntoDesembarquePage,
        canActivate: [permissionGuard],
        data: {
            acl: 'gestion.puntodesembarque'
        },
        children: [
            {
                path: '',
                component: PuntoDesembarqueListComponent,
                resolve: {
                    data: puntodesembarqueListResolver,
                },
                children: [
                    {
                        path: 'new',
                        component: PuntoDesembarqueDetailComponent,
                        resolve: {
                            provider: puntodesembarqueNewResolver,
                        },
                        canDeactivate: [canDeactivatePuntoDesembarqueDetail]
                    },
                    {
                        path: ':id',
                        component: PuntoDesembarqueDetailComponent,
                        resolve: {
                            provider: puntodesembarqueDetailResolver,
                        },
                        canDeactivate: [canDeactivatePuntoDesembarqueDetail]
                    }

                ]
            }
        ]
    }
] as Routes;
