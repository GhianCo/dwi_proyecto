import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {PuntoDesembarqueStore} from "../../../data-access/punto.desembarque.store";
import {inject} from "@angular/core";

export const puntodesembarqueDetailResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const puntodesembarqueStore = inject(PuntoDesembarqueStore);
    const router = inject(Router);
    return puntodesembarqueStore.searchPuntoDesembarqueById(route.paramMap.get('id')).pipe(
        catchError((error) => {
            console.error(error);
            const parentUrl = state.url.split('/').slice(0, -1).join('/');
            router.navigateByUrl(parentUrl);
            return throwError(error);
        })
    );
}
