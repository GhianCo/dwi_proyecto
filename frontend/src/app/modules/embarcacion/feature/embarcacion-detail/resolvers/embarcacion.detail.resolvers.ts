import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {EmbarcacionStore} from "../../../data-access/embarcacion.store";
import {inject} from "@angular/core";

export const embarcacionDetailResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const embarcacionStore = inject(EmbarcacionStore);
    const router = inject(Router);
    return embarcacionStore.searchEmbarcacionById(route.paramMap.get('id')).pipe(
        catchError((error) => {
            console.error(error);
            const parentUrl = state.url.split('/').slice(0, -1).join('/');
            router.navigateByUrl(parentUrl);
            return throwError(error);
        })
    );
}
 