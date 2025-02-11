import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ClienteDetailComponent } from './cliente-detail.component';
import { ClienteStore } from '../../data-access/cliente.store';

export const canDeactivateClienteDetail = (
  component: ClienteDetailComponent,
  currentRoute: ActivatedRouteSnapshot,
  currentState: RouterStateSnapshot,
  nextState: RouterStateSnapshot
) => {

  const clienteStore = inject(ClienteStore);

  let nextRoute: ActivatedRouteSnapshot = nextState.root;
  while (nextRoute.firstChild) {
    nextRoute = nextRoute.firstChild;
  }

  if (!nextState.url.includes('/cliente')) {
    return true;
  }

  if (nextRoute.paramMap.get('id')) {
    return true;
  } else {
    clienteStore.discardFromListClienteToCreate();
    return component.closeDrawer().then(() => true);
  }
}
