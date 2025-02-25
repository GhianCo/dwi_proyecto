import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

export const permissionGuard = (route: any) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const hasPermission = authService.checkPermiso(route.data.acl);
  return true;
};
