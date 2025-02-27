import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {PuntoDesembarqueDetailComponent} from './punto.desembarque.detail.component';
import {PuntoDesembarqueStore} from "../../data-access/punto.desembarque.store";

export const canDeactivatePuntoDesembarqueDetail = (
    component: PuntoDesembarqueDetailComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
) => {

    const puntodesembarqueStore = inject(PuntoDesembarqueStore);

    let nextRoute: ActivatedRouteSnapshot = nextState.root;
    while (nextRoute.firstChild) {
        nextRoute = nextRoute.firstChild;
    }

    if (!nextState.url.includes('/puntodesembarque')) {
        return true;
    }

    if (nextRoute.paramMap.get('id')) {
        return true;
    } else {
        puntodesembarqueStore.discardFromListPuntoDesembarqueToCreate();
        return component.closeDrawer().then(() => true);
    }
}
