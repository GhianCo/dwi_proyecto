import {Routes} from '@angular/router';
import {PresentacionPage} from './presentacion.page';
import {PresentacionListComponent} from "../presentacion-list/presentacion.list.component";
import {PresentacionDetailComponent} from "../presentacion-detail/presentacion.detail.component";
import {presentacionListResolver} from "../presentacion-list/presentacion.list.resolvers";
import {presentacionNewResolver} from "../presentacion-detail/resolvers/presentacion.new.resolvers";
import {presentacionDetailResolver} from "../presentacion-detail/resolvers/presentacion.detail.resolvers";
import {canDeactivatePresentacionDetail} from "../presentacion-detail/presentacion.detail.guards";
import {permissionGuard} from 'app/core/auth/permission.guard';

export default [
    {
        path: '',
        component: PresentacionPage,
        canActivate: [permissionGuard],
        data: {
            acl: 'gestion.presentacion'
        },
        children: [
            {
                path: '',
                component: PresentacionListComponent,
                resolve: {
                    data: presentacionListResolver,
                },
                children: [
                    {
                        path: 'new',
                        component: PresentacionDetailComponent,
                        resolve: {
                            provider: presentacionNewResolver,
                        },
                        canDeactivate: [canDeactivatePresentacionDetail]
                    },
                    {
                        path: ':id',
                        component: PresentacionDetailComponent,
                        resolve: {
                            provider: presentacionDetailResolver,
                        },
                        canDeactivate: [canDeactivatePresentacionDetail]
                    }

                ]
            }
        ]
    }
] as Routes;
