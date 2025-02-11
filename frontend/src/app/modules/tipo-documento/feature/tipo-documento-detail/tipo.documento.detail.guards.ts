import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {TipoDocumentoDetailComponent} from './tipo.documento.detail.component';
import {TipoDocumentoStore} from "../../data-access/tipo.documento.store";

export const canDeactivateTipoDocumentoDetail = (
    component: TipoDocumentoDetailComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
) => {

    const tipoDocumentoStore = inject(TipoDocumentoStore);

    let nextRoute: ActivatedRouteSnapshot = nextState.root;
    while (nextRoute.firstChild) {
        nextRoute = nextRoute.firstChild;
    }

    if (!nextState.url.includes('/tipo-documento')) {
        return true;
    }

    if (nextRoute.paramMap.get('id')) {
        return true;
    } else {
        tipoDocumentoStore.discardFromListTipoDocumentoToCreate();
        return component.closeDrawer().then(() => true);
    }
}
