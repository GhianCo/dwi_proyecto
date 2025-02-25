import {inject, Injectable} from '@angular/core';
import {AuthUtils} from 'app/core/auth/auth.utils';
import {Observable, of} from 'rxjs';
import {PersistenceService} from "@shared/services/persistence.service";
import {PKEY} from "@shared/constants/persistence.const";

@Injectable({providedIn: 'root'})
export class AuthService {

    persistence = inject(PersistenceService);

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string) {
        this.persistence.set(PKEY.TOKEN, token)
    }

    get accessToken(): string {
        return this.persistence.get(PKEY.TOKEN) ?? '';
    }

    /**
     * Sign out
     */
    signOut(): Observable<any> {
        this.persistence.remove(PKEY.TOKEN);
        this.persistence.remove(PKEY.PERMISOS_USER);
        this.persistence.remove(PKEY.PERMISOS_LIST);

        return of(true);
    }


    /**
     * Check the authentication status
     */
    check(): Observable<boolean> {
        if (!this.accessToken) {
            return of(false);
        }

        return of(true);
    }

    get permisosUser(): any {
        return this.persistence.get(PKEY.PERMISOS_USER);
    }

    checkPermiso(modulo: string): boolean {
        const hasPermissions = this.permisosUser?.find((permiso: any) => permiso.permiso_modulo === modulo);
        return !!hasPermissions;
    }
}
