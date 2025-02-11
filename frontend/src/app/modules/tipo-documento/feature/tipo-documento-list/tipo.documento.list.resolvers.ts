import {inject, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {TipoDocumentoStore} from "../../data-access/tipo.documento.store";

export const tipoDocumentoListResolver = () => {
    const tipoDocumentoStore = inject(TipoDocumentoStore);
    return tipoDocumentoStore.loadAllTipoDocumento()
}
