import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CajaStore } from '../../data-access/mapers/caja.store';
import { CajaDetailComponent } from './caja-detail.component';

export const canDeactivateCajaDetail = (
  component: CajaDetailComponent,
  currentRoute: ActivatedRouteSnapshot,
  currentState: RouterStateSnapshot,
  nextState: RouterStateSnapshot
) => {

  const cajaStore = inject(CajaStore);

  let nextRoute: ActivatedRouteSnapshot = nextState.root;
  while (nextRoute.firstChild) {
    nextRoute = nextRoute.firstChild;
  }

  if (!nextState.url.includes('/caja')) {
    return true;
  }

  if (nextRoute.paramMap.get('id')) {
    return true;
  } else {
    cajaStore.discardFromListCajaToCreate();
    return component.closeDrawer().then(() => true);
  }
}
