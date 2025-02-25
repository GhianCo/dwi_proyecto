import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {PresentacionStore} from "../../../data-access/presentacion.store";
import {inject} from "@angular/core";

export const presentacionDetailResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const presentacionStore = inject(PresentacionStore);
    const router = inject(Router);
    return presentacionStore.searchTipoDocumentoById(route.paramMap.get('id')).pipe(
        catchError((error) => {
            console.error(error);
            const parentUrl = state.url.split('/').slice(0, -1).join('/');
            router.navigateByUrl(parentUrl);
            return throwError(error);
        })
    );
}
