import { Route } from '@angular/router';
import { initialDataResolver } from 'app/app.resolvers';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [

    // Redirect empty path to '/example'
    { path: '', pathMatch: 'full', redirectTo: 'example' },

    // Redirect signed-in user to the '/example'
    //
    // After the user signs in, the sign-in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file. a
    { path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'example' },

    // Auth routes for guests
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

    // Auth routes for authenticated users
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

    // Admin routes
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
                    { path: 'tipo-documento', loadChildren: () => import('app/modules/tipo-documento/feature/tipo-documento-shell/tipo.documento.routes') },
                    { path: 'zona', loadChildren: () => import('app/modules/zona/feature/zona-shell/zona.routes') },
                    { path: "caja", loadChildren: () => import('app/modules/caja/feature/caja-shell/caja.route') },
                    { path: "transportista", loadChildren: () => import('app/modules/transportista/feature/transportista-shell/transportista.route') },
                    { path: "proveedor", loadChildren: () => import('app/modules/proveedor/feature/proveedor-shell/proveedor.route') },
                    { path: "cliente", loadChildren: () => import('app/modules/cliente/feature/cliente-shell/cliente.route') },
                    { path: "laboratorio", loadChildren: () => import('app/modules/laboratorio/feature/laboratio-shell/laboratorio.routes') },
                ]

            },                
            {
                path: 'sistema', children: [
                    { path: 'usuario', loadChildren: () => import('app/modules/usuario/feature/usuario-shell/usuario.routes') },
                ]
            },
            {
                path: "producto",
                children: [
                    { path: "producto", loadChildren: () => import('app/modules/producto/feature/producto-shell/producto.routes') },
                ]
            },
            {
                path: "caja",
                children: [
                    { path: "venta", loadChildren: () => import('app/modules/venta/feature/venta-shell/venta.routes') },
                    { path: "pedido", loadChildren: () => import('app/modules/pedido/features/pedido-shell/pedido.routes') },
                ]
            },
            {
                path: "amortizacion",
                children: [
                    { path: "", loadChildren: () => import('app/modules/amortizacion/features/amortizacion-shell/amortizacion.route') },
                ]
            },
            {
                path: "compras",
                children: [
                    { path: "ordenes-de-compra", loadChildren: () => import('app/modules/ordencompra/feature/orden-compra-shell/orden-compra.routes') },
                    { path: "compras", loadChildren: () => import('app/modules/compra/feature/compra-shell/compra.routes') },
                ]
            }
        
        ]
    }
];
