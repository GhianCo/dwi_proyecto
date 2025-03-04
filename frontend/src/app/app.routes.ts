import { Route } from '@angular/router';
import { initialDataResolver } from 'app/app.resolvers';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';

export const appRoutes: Route[] = [

    { path: '', pathMatch: 'full', redirectTo: 'example' },

    { path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'example' },

    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            { path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.routes') },
        ]
    },

    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            { path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.routes') },
        ]
    },

    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            { path: 'example', loadChildren: () => import('app/modules/admin/example/example.routes') },
            {
                path: 'gestion', children: [
                    { path: 'presentacion', loadChildren: () => import('app/modules/presentacion/feature/presentacion-shell/presentacion.routes') },
                    { path: 'puntodesembarque', loadChildren: () => import('app/modules/puntodesembarque/feature/punto-desembarque-shell/punto.desembarque.routes') },
                    { path: 'conductor', loadChildren: () => import('app/modules/conductor/feature/conductor-shell/conductor.routes') },
                    { path: 'embarcacion', loadChildren: () => import('app/modules/embarcacion/feature/embarcacion-shell/embarcacion.routes') },
                    { path: 'destino', loadChildren: () => import('app/modules/destino/feature/destino-shell/destino.routes') },
                ]
            },
            {
                path: 'sistema', children: [
                    { path: 'usuario', loadChildren: () => import('app/modules/usuario/feature/usuario-shell/usuario.routes') },
                ]
            },
        ]
    }
];
