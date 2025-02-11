import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ProveedorStore } from '../../data-access/proveedor.store';
import { ProveeodrDetailComponent } from './proveedor-detail.component';

export const canDeactivateTransportistaDetail = (
  component: ProveeodrDetailComponent,
  currentRoute: ActivatedRouteSnapshot,
  currentState: RouterStateSnapshot,
  nextState: RouterStateSnapshot
) => {

  const proveedorStore = inject(ProveedorStore);

  let nextRoute: ActivatedRouteSnapshot = nextState.root;
  while (nextRoute.firstChild) {
    nextRoute = nextRoute.firstChild;
  }

  if (!nextState.url.includes('/proveedor')) {
    return true;
  }

  if (nextRoute.paramMap.get('id')) {
    return true;
  } else {
    proveedorStore.discardFromListProveedorToCreate();
    return component.closeDrawer().then(() => true);
  }
}
