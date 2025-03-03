import {Routes} from '@angular/router';
import {EmbarcacionPage} from './embarcacion.page';
import {EmbarcacionListComponent} from "../embarcacion-list/embarcacion.list.component";
import {EmbarcacionDetailComponent} from "../embarcacion-detail/embarcacion.detail.component";
import {embarcacionListResolver} from "../embarcacion-list/embarcacion.list.resolvers";
import {embarcacionNewResolver} from "../embarcacion-detail/resolvers/embarcacion.new.resolvers";
import {embarcacionDetailResolver} from "../embarcacion-detail/resolvers/embarcacion.detail.resolvers";
import {canDeactivateEmbarcacionDetail} from "../embarcacion-detail/embarcacion.detail.guards";
import {permissionGuard} from 'app/core/auth/permission.guard';

export default [
    {
        path: '',
        component: EmbarcacionPage,
        canActivate: [permissionGuard],
        data: {
            acl: 'gestion.Embarcacion'
        },
        children: [
            {
                path: '',
                component: EmbarcacionListComponent,
                resolve: {
                    data: embarcacionListResolver,
                },
                children: [
                    {
                        path: 'new',
                        component: EmbarcacionDetailComponent,
                        resolve: {
                            provider: embarcacionNewResolver,
                        },
                        canDeactivate: [canDeactivateEmbarcacionDetail]
                    },
                    {
                        path: ':id',
                        component: EmbarcacionDetailComponent,
                        resolve: {
                            provider: embarcacionDetailResolver,
                        },
                        canDeactivate: [canDeactivateEmbarcacionDetail]
                    }

                ]
            }
        ]
    }
] as Routes;
