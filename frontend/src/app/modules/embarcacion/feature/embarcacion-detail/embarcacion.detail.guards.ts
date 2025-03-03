import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {EmbarcacionDetailComponent} from './embarcacion.detail.component';
import {EmbarcacionStore} from "../../data-access/embarcacion.store";

export const canDeactivateEmbarcacionDetail = (
    component: EmbarcacionDetailComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
) => {

    const embarcacionStore = inject(EmbarcacionStore);

    let nextRoute: ActivatedRouteSnapshot = nextState.root;
    while (nextRoute.firstChild) {
        nextRoute = nextRoute.firstChild;
    }

    if (!nextState.url.includes('/embarcacion')) {
        return true;
    }

    if (nextRoute.paramMap.get('id')) {
        return true;
    } else {
        embarcacionStore.discardFromListEmbarcacionToCreate();
        return component.closeDrawer().then(() => true);
    }
}
