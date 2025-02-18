import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { inject } from "@angular/core";
import { UsuarioStore } from 'app/modules/usuario/data-access/usuario.store';

export const usuarioDetailResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const usuarioStore = inject(UsuarioStore);
    const router = inject(Router);

    return usuarioStore.searchUsuarioById(route.paramMap.get('id')).pipe(
        catchError((error) => {
            console.error(error);
            const parentUrl = state.url.split('/').slice(0, -1).join('/');
            router.navigateByUrl(parentUrl);
            return throwError(() => error);
        })
    );

}
