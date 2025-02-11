import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { EMPTY, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { inject } from "@angular/core";
import { ProductoStore } from 'app/modules/producto/data-access/producto.store';

export const productoDetailResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const productoStore = inject(ProductoStore);
    const router = inject(Router);
    
    const productoId = route.paramMap.get('id');
    const presentacionId = route.paramMap.get('presentacionId');

    productoStore.updatePresetacionIdSelected(presentacionId);

    return productoStore.searchProductoById(productoId, presentacionId).pipe(
        catchError((error) => {
            console.error(error);
            const parentUrl = state.url.split('/').slice(0, -2).join('/');
            router.navigateByUrl(parentUrl);
            return throwError(() => error);
        })
    );


}
