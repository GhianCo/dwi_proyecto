import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {PresentacionDetailComponent} from './presentacion.detail.component';
import {PresentacionStore} from "../../data-access/presentacion.store";

export const canDeactivateTipoDocumentoDetail = (
    component: PresentacionDetailComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
) => {

    const presentacionStore = inject(PresentacionStore);

    let nextRoute: ActivatedRouteSnapshot = nextState.root;
    while (nextRoute.firstChild) {
        nextRoute = nextRoute.firstChild;
    }

    if (!nextState.url.includes('/presentacion')) {
        return true;
    }

    if (nextRoute.paramMap.get('id')) {
        return true;
    } else {
        presentacionStore.discardFromListTipoDocumentoToCreate();
        return component.closeDrawer().then(() => true);
    }
}
