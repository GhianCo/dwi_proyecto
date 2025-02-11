import {Routes} from '@angular/router';
import {TipoDocumentoPage} from './tipo.documento.page';
import {TipoDocumentoListComponent} from "../tipo-documento-list/tipo.documento.list.component";
import {TipoDocumentoDetailComponent} from "../tipo-documento-detail/tipo.documento.detail.component";
import {tipoDocumentoListResolver} from "../tipo-documento-list/tipo.documento.list.resolvers";
import {tipoDocumentoNewResolver} from "../tipo-documento-detail/resolvers/tipo.documento.new.resolvers";
import {tipoDocumentoDetailResolver} from "../tipo-documento-detail/resolvers/tipo.documento.detail.resolvers";
import {canDeactivateTipoDocumentoDetail} from "../tipo-documento-detail/tipo.documento.detail.guards";
import { permissionGuard } from 'app/core/auth/permission.guard';

export default [
    {
        path: '',
        component: TipoDocumentoPage,
        canActivate: [permissionGuard],
        data: {
            acl: 'gestion.tipodocumento'
        },
        children: [
            {
                path: '',
                component: TipoDocumentoListComponent,
                resolve: {
                    data: tipoDocumentoListResolver,
                },
                children: [
                    {
                        path: 'new',
                        component: TipoDocumentoDetailComponent,
                        resolve: {
                            provider: tipoDocumentoNewResolver,
                        },
                        canDeactivate: [canDeactivateTipoDocumentoDetail]
                    },
                    {
                        path: ':id',
                        component: TipoDocumentoDetailComponent,
                        resolve: {
                            provider: tipoDocumentoDetailResolver,
                        },
                        canDeactivate: [canDeactivateTipoDocumentoDetail]
                    }

                ]
            }
        ]
    }
] as Routes;
