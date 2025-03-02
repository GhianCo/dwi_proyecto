import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {DestinoStore} from "../../../data-access/destino.store";
import {inject} from "@angular/core";

export const destinoDetailResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const destinoStore = inject(DestinoStore);
    const router = inject(Router);
    return destinoStore.searchDestinoById(route.paramMap.get('id')).pipe(
        catchError((error) => {
            console.error(error);
            const parentUrl = state.url.split('/').slice(0, -1).join('/');
            router.navigateByUrl(parentUrl);
            return throwError(error);
        })
    );
}
