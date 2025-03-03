import {Routes} from '@angular/router';
import {ConductorPage} from './conductor.page';
import {ConductorListComponent} from "../conductor-list/conductor.list.component";
import {ConductorDetailComponent} from "../conductor-detail/conductor.detail.component";
import {conductorListResolver} from "../conductor-list/conductor.list.resolvers";
import {conductorNewResolver} from "../conductor-detail/resolvers/conductor.new.resolvers";
import {conductorDetailResolver} from "../conductor-detail/resolvers/conductor.detail.resolvers";
import {canDeactivateConductorDetail} from "../conductor-detail/conductor.detail.guards";
import {permissionGuard} from 'app/core/auth/permission.guard';

export default [
    {
        path: '',
        component: ConductorPage,
        canActivate: [permissionGuard],
        data: {
            acl: 'gestion.conductor'
        },
        children: [
            {
                path: '',
                component: ConductorListComponent,
                resolve: {
                    data: conductorListResolver,
                },
                children: [
                    {
                        path: 'new',
                        component: ConductorDetailComponent,
                        resolve: {
                            provider: conductorNewResolver,
                        },
                        canDeactivate: [canDeactivateConductorDetail]
                    },
                    {
                        path: ':id',
                        component: ConductorDetailComponent,
                        resolve: {
                            provider: conductorDetailResolver,
                        },
                        canDeactivate: [canDeactivateConductorDetail]
                    }

                ]
            }
        ]
    }
] as Routes;
