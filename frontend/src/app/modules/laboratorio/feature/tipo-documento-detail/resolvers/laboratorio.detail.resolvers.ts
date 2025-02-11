import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {inject} from "@angular/core";
import { LaboratorioStore } from 'app/modules/laboratorio/data-access/laboratorio.store';

export const laboratioDetailResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const laboratioStore = inject(LaboratorioStore);
    const router = inject(Router);
    return laboratioStore.searchlaboratorioById(route.paramMap.get('id')).pipe(
        catchError((error) => {
            console.error(error);
            const parentUrl = state.url.split('/').slice(0, -1).join('/');
            router.navigateByUrl(parentUrl);
            return throwError(error);
        })
    );
}
