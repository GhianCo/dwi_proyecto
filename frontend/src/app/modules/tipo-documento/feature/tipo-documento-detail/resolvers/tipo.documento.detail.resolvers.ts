import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {TipoDocumentoStore} from "../../../data-access/tipo.documento.store";
import {inject} from "@angular/core";

export const tipoDocumentoDetailResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const tipoDocumentoStore = inject(TipoDocumentoStore);
    const router = inject(Router);
    return tipoDocumentoStore.searchTipoDocumentoById(route.paramMap.get('id')).pipe(
        catchError((error) => {
            console.error(error);
            const parentUrl = state.url.split('/').slice(0, -1).join('/');
            router.navigateByUrl(parentUrl);
            return throwError(error);
        })
    );
}
