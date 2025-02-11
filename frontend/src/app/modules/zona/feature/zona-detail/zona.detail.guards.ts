import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ZonaDetailComponent } from './zona.detail.component';
import { ZonaStore } from '../../data-access/zona.store';

export const canDeactivateZonaDetail = (
  component: ZonaDetailComponent,
  currentRoute: ActivatedRouteSnapshot,
  currentState: RouterStateSnapshot,
  nextState: RouterStateSnapshot
) => {

  const zonaStore = inject(ZonaStore);

  let nextRoute: ActivatedRouteSnapshot = nextState.root;
  while (nextRoute.firstChild) {
    nextRoute = nextRoute.firstChild;
  }

  if (!nextState.url.includes('/zona')) {
    return true;
  }

  if (nextRoute.paramMap.get('id')) {
    return true;
  } else {
    zonaStore.discardFromListZonaToCreate();
    return component.closeDrawer().then(() => true);
  }
}
