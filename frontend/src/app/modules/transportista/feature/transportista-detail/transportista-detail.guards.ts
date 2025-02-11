import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { TransportistaStore } from '../../data-access/transportista.store';
import { TransportistaDetailComponent } from './transportista-detail.component';

export const canDeactivateTransportistaDetail = (
  component: TransportistaDetailComponent,
  currentRoute: ActivatedRouteSnapshot,
  currentState: RouterStateSnapshot,
  nextState: RouterStateSnapshot
) => {

  const transportistaStore = inject(TransportistaStore);

  let nextRoute: ActivatedRouteSnapshot = nextState.root;
  while (nextRoute.firstChild) {
    nextRoute = nextRoute.firstChild;
  }

  if (!nextState.url.includes('/transportista')) {
    return true;
  }

  if (nextRoute.paramMap.get('id')) {
    return true;
  } else {
    transportistaStore.discardFromListTransportistaToCreate();
    return component.closeDrawer().then(() => true);
  }
}
