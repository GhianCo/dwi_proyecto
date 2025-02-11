import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { inject } from "@angular/core";
import { TransportistaStore } from 'app/modules/transportista/data-access/transportista.store';

export const transportistaDetailResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const transportistaStore = inject(TransportistaStore);
    const router = inject(Router);
    
    transportistaStore.cargarTiposDocumentoActivos();
    return transportistaStore.searchTransportistaById(route.paramMap.get('id')).pipe(
        catchError((error) => {
            console.error(error);
            const parentUrl = state.url.split('/').slice(0, -1).join('/');
            router.navigateByUrl(parentUrl);
            return throwError(() => error);
        })
    );

}
