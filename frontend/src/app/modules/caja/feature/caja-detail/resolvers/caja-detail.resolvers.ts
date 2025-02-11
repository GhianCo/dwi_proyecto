import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { inject } from "@angular/core";
import { ZonaStore } from 'app/modules/zona/data-access/zona.store';
import { CajaStore } from 'app/modules/caja/data-access/mapers/caja.store';

export const cajaDetailResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const cajaStore = inject(CajaStore);
    const router = inject(Router);
    return cajaStore.searchCajaById(route.paramMap.get('id')).pipe(
        catchError((error) => {
            console.error(error);
            const parentUrl = state.url.split('/').slice(0, -1).join('/');
            router.navigateByUrl(parentUrl);
            return throwError(() => error);
        })
    );
}
