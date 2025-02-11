import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ProductoDetailComponent } from './producto.detail.component';
import { ProductoStore } from '../../data-access/producto.store';

export const canDeactivateProductoDetail = (
  component: ProductoDetailComponent,
  currentRoute: ActivatedRouteSnapshot,
  currentState: RouterStateSnapshot,
  nextState: RouterStateSnapshot
) => {

  const zonaStore = inject(ProductoStore);

  let nextRoute: ActivatedRouteSnapshot = nextState.root;
  while (nextRoute.firstChild) {
    nextRoute = nextRoute.firstChild;
  }

  if (!nextState.url.includes('/producto')) {
    return true;
  }

  if (nextRoute.paramMap.get('id')) {
    return true;
  } else {
    zonaStore.discardFromListProductoToCreate();
    return component.closeDrawer().then(() => true);
  }
}
