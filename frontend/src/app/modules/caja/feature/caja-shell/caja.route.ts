import { Route } from "@angular/router";
import { CajaPage } from "./caja.page";
import { CajaListComponent } from "../caja-list/caja-list.component";
import { CajaListResolver } from "../caja-list/caja-list.resolver";
import { CajaDetailComponent } from "../caja-detail/caja-detail.component";
import { canDeactivateCajaDetail } from "../caja-detail/caja-detail.guards";
import { cajaDetailResolver } from "../caja-detail/resolvers/caja-detail.resolvers";
import { cajaNewResolver } from "../caja-detail/resolvers/caja-new.resolvers";
import { permissionGuard } from "app/core/auth/permission.guard";

const cajaRoutes: Route[] = [
  {
    path: '',
    component: CajaPage,
    canActivate: [permissionGuard],
    data: {
      acl: 'gestion.caja'
    },
    children: [
      {
        path: '',
        component: CajaListComponent,
        resolve: {
          data: CajaListResolver
        },
        children: [
          {
            path: 'new',
            component: CajaDetailComponent,
            canDeactivate: [canDeactivateCajaDetail],
            resolve: {
              provider: cajaNewResolver
            }
          },
          {
            path: ':id',
            component: CajaDetailComponent,
            canDeactivate: [canDeactivateCajaDetail],
            resolve: {
              provider: cajaDetailResolver
            }
          }
        ]
      }
    ]
  }
];

export default cajaRoutes;
