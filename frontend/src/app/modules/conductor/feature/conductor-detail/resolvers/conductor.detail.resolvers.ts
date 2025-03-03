import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {ConductorStore} from "../../../data-access/conductor.store";
import {inject} from "@angular/core";

export const conductorDetailResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const conductorStore = inject(ConductorStore);
    const router = inject(Router);
    return conductorStore.searchConductorById(route.paramMap.get('id')).pipe(
        catchError((error) => {
            console.error(error);
            const parentUrl = state.url.split('/').slice(0, -1).join('/');
            router.navigateByUrl(parentUrl);
            return throwError(error);
        })
    );
}
