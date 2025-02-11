import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

export const permissionGuard = (route: any) => {
  // Inyectamos el servicio de autenticación y el router
  const authService = inject(AuthService);
  const router = inject(Router);

  const hasPermission = authService.checkPermiso(route.data.acl);
  // if(!hasPermission) {
  //   router.navigate(['/']);
  // }
  return true;
};
