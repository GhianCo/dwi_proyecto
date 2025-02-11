import {Routes} from '@angular/router';
import {TipoDocumentoPage} from './laboratorio.page';
import {LaboratorioListComponent} from "../laboratorio-list/laboratorio.list.component";
import {LaboratorioListResolver} from "../laboratorio-list/laboratorio.list.resolvers";
import {LaboratorioNewResolver} from "../tipo-documento-detail/resolvers/laboratorio.new.resolvers";
import {laboratioDetailResolver} from "../tipo-documento-detail/resolvers/laboratorio.detail.resolvers";
import {canDeactivateTipoDocumentoDetail} from "../tipo-documento-detail/laboratorio.detail.guards";
import { LaboratorioDetailComponent } from '../tipo-documento-detail/laboratorio.detail.component';
import { permissionGuard } from 'app/core/auth/permission.guard';

export default [
    {
        path: '',
        component: TipoDocumentoPage,
        canActivate: [permissionGuard],
        data: {
            acl: 'gestion.laboratorio'
        },
        children: [
            {
                path: '',
                component: LaboratorioListComponent,
                resolve: {
                    data: LaboratorioListResolver,
                },
                children: [
                    {
                        path: 'new',
                        component: LaboratorioDetailComponent,
                        resolve: {
                            provider: LaboratorioNewResolver,
                        },
                        canDeactivate: [canDeactivateTipoDocumentoDetail]
                    },
                    {
                        path: ':id',
                        component: LaboratorioDetailComponent,
                        resolve: {
                            provider: laboratioDetailResolver,
                        },
                        canDeactivate: [canDeactivateTipoDocumentoDetail]
                    }

                ]
            }
        ]
    }
] as Routes;
