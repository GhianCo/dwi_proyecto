import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { inject } from "@angular/core";
import { TransportistaStore } from 'app/modules/transportista/data-access/transportista.store';
import { ProveedorStore } from 'app/modules/proveedor/data-access/proveedor.store';
import { ClienteStore } from 'app/modules/cliente/data-access/cliente.store';

export const clienteDetailResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const clienteStore = inject(ClienteStore);
    const router = inject(Router);
    
    clienteStore.cargarTiposDocumentoActivos();
    clienteStore.cargarVendedoresActivos();
    clienteStore.cargarZonasActivas();
    return clienteStore.searchClienteById(route.paramMap.get('id')).pipe(
        catchError((error) => {
            console.error(error);
            const parentUrl = state.url.split('/').slice(0, -1).join('/');
            router.navigateByUrl(parentUrl);
            return throwError(() => error);
        })
    );

}
