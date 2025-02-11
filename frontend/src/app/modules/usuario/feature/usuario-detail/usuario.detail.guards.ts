import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UsuarioDetailComponent } from './usuario.detail.component';
import { UsuarioStore } from '../../data-access/usuario.store';

export const canDeactivateUsuarioDetail = (
  component: UsuarioDetailComponent,
  currentRoute: ActivatedRouteSnapshot,
  currentState: RouterStateSnapshot,
  nextState: RouterStateSnapshot
) => {

  const usuarioStore = inject(UsuarioStore);
  usuarioStore.cargarTiposDocumentoActivos();

  let nextRoute: ActivatedRouteSnapshot = nextState.root;
  while (nextRoute.firstChild) {
    nextRoute = nextRoute.firstChild;
  }

  if (!nextState.url.includes('/usuario')) {
    return true;
  }

  if (nextRoute.paramMap.get('id')) {
    return true;
  } else {
    usuarioStore.discardFromListUsuarioToCreate();
    return component.closeDrawer().then(() => true);
  }
}
