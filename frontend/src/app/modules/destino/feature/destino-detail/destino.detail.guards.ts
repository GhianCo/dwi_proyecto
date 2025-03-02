import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {DestinoDetailComponent} from './destino.detail.component';
import {DestinoStore} from "../../data-access/destino.store";

export const canDeactivateDestinoDetail = (
    component: DestinoDetailComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
) => {

    const destinoStore = inject(DestinoStore);

    let nextRoute: ActivatedRouteSnapshot = nextState.root;
    while (nextRoute.firstChild) {
        nextRoute = nextRoute.firstChild;
    }

    if (!nextState.url.includes('/destino')) {
        return true;
    }

    if (nextRoute.paramMap.get('id')) {
        return true;
    } else {
        destinoStore.discardFromListDestinoToCreate();
        return component.closeDrawer().then(() => true);
    }
}
