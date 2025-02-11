import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { inject } from "@angular/core";
import { TransportistaStore } from 'app/modules/transportista/data-access/transportista.store';
import { ProveedorStore } from 'app/modules/proveedor/data-access/proveedor.store';

export const proveedorDetailResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const proveedorStore = inject(ProveedorStore);
    const router = inject(Router);
    
    proveedorStore.cargarTiposDocumentoActivos();
    proveedorStore.cargarPaisesActivos();
    return proveedorStore.searchProveedorById(route.paramMap.get('id')).pipe(
        catchError((error) => {
            console.error(error);
            const parentUrl = state.url.split('/').slice(0, -1).join('/');
            router.navigateByUrl(parentUrl);
            return throwError(() => error);
        })
    );

}
