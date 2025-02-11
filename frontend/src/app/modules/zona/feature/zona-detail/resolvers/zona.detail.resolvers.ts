import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { inject } from "@angular/core";
import { ZonaStore } from 'app/modules/zona/data-access/zona.store';

export const zonaDetailResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const zonaStore = inject(ZonaStore);
    const router = inject(Router);
    return zonaStore.searchZonaById(route.paramMap.get('id')).pipe(
        catchError((error) => {
            console.error(error);
            const parentUrl = state.url.split('/').slice(0, -1).join('/');
            router.navigateByUrl(parentUrl);
            return throwError(() => error);
        })
    );

}
