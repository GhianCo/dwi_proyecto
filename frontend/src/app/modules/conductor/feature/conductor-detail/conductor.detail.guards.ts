import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {ConductorDetailComponent} from './conductor.detail.component';
import {ConductorStore} from "../../data-access/conductor.store";

export const canDeactivateConductorDetail = (
    component: ConductorDetailComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
) => {

    const conductorStore = inject(ConductorStore);

    let nextRoute: ActivatedRouteSnapshot = nextState.root;
    while (nextRoute.firstChild) {
        nextRoute = nextRoute.firstChild;
    }

    if (!nextState.url.includes('/conductor')) {
        return true;
    }

    if (nextRoute.paramMap.get('id')) {
        return true;
    } else {
        conductorStore.discardFromListConductorToCreate();
        return component.closeDrawer().then(() => true);
    }
}
