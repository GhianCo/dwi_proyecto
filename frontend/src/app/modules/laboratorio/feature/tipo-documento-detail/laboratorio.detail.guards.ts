import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { LaboratorioStore } from '../../data-access/laboratorio.store';
import { LaboratorioDetailComponent } from './laboratorio.detail.component';

export const canDeactivateTipoDocumentoDetail = (
    component: LaboratorioDetailComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
) => {

    const laboratioStore = inject(LaboratorioStore);

    let nextRoute: ActivatedRouteSnapshot = nextState.root;
    while (nextRoute.firstChild) {
        nextRoute = nextRoute.firstChild;
    }

    if (!nextState.url.includes('/laboratorio')) {
        return true;
    }

    if (nextRoute.paramMap.get('id')) {
        return true;
    } else {
        laboratioStore.discardFromListlaboratorioToCreate();
        return component.closeDrawer().then(() => true);
    }
}
