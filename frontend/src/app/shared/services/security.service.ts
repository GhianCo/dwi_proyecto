import { Injectable } from '@angular/core';
import { PersistenceService } from './persistence.service';
import { PKEY } from '@shared/constants/persistence.const';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  constructor(
    private persistenceService: PersistenceService
  ) {

  }

  public hasAccess(modulo: string): boolean {
    let tienePermiso = false;
    const permisosList = this.persistenceService.get(PKEY.PERMISOS_LIST) ?? [];

    for (const permiso of permisosList) {
      if (permiso.permiso_modulo === modulo) {
        tienePermiso = true;
        break;
      }
    }

    // return tienePermiso;
    return true;
  }

  public getSimboloMoneda() {
    const moneda = this.persistenceService.get(PKEY.MONEDA);
    if(moneda && moneda.moneda_simbolo) {
      return moneda.moneda_simbolo;
    }
    return "S/";
  }

  public getLocalLogeado() {
    return this.persistenceService.get(PKEY.LOCAL_LOGEADO);
  }

}