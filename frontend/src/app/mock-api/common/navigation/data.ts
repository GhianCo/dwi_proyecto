/* eslint-disable */
import { Inject } from '@angular/core';
import { FuseNavigationItem } from '@fuse/components/navigation';
import { SecurityService } from '@shared/services/security.service';


const securityService = Inject(SecurityService);

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    },
    {
        id: 'gestion',
        title: 'Gestión',
        type: 'collapsable',
        icon: 'heroicons_outline:square-3-stack-3d',
        children: [
            {
                id: 'gestion.tipo-documento',
                title: 'Tipo de documento',
                type: 'basic',
                link: '/gestion/tipo-documento',
            },
            {
                id: 'gestion.zona',
                title: 'Zona',
                type: 'basic',
                link: '/gestion/zona',
            },
            {
                id: 'gestion.caja',
                title: 'Caja',
                type: 'basic',
                link: '/gestion/caja',
            },
            {
                id: 'gestion.transportista',
                title: 'Transportista',
                type: 'basic',
                link: '/gestion/transportista',
            },
            {
                id: 'gestion.proveedor',
                title: 'Proveedor',
                type: 'basic',
                link: '/gestion/proveedor',
            },
            {
                id: 'gestion.cliente',
                title: 'Cliente',
                type: 'basic',
                link: '/gestion/cliente',
            },
            {
                id: 'gestion.laboratorio',
                title: 'Laboratorio',
                type: 'basic',
                link: '/gestion/laboratorio',
            },

        ],
    },
    {
        id: 'producto',
        title: 'Productos',
        type: 'collapsable',
        icon: 'heroicons_outline:square-3-stack-3d',
        children: [
            {
                id: 'productos.producto',
                title: 'Producto',
                type: 'basic',
                link: '/producto/producto',
            },
        ]
    },
    {
        id: 'sistema',
        title: 'Sistema',
        type: 'collapsable',
        icon: 'heroicons_outline:square-3-stack-3d',
        children: [
            {
                id: 'sistema.usuario',
                title: 'Usuario',
                type: 'basic',
                link: '/sistema/usuario',
            },
        ]
    },
    {
        id: 'caja',
        title: 'Caja',
        type: 'collapsable',
        icon: 'heroicons_outline:square-3-stack-3d',
        children: [
            {
                id: 'caja.venta',
                title:  'Nueva venta',
                type: 'basic',
                link: '/caja/venta/nueva-venta',
            },
            {
                id: 'caja.listaventa',
                title: 'Ventas',
                type: 'basic',
                link: '/caja/venta/list-venta',
            },
            {
                id: 'pedido.nuevopedido',
                title: 'Nuevo pedido',
                type: 'basic',
                link: '/caja/pedido/nuevopedido',
            },
            {
                id: 'pedido.listapedidos',
                title: 'Pedidos',
                type: 'basic',
                link: '/caja/pedido/listapedidos',
            },
            {
                id: 'amortizacion.amortizaciones',
                title: 'Amortizaciones',
                type: 'basic',
                link: '/amortizacion/listamortizaciones',
            }
        ]
    },
    {
        id: 'informes',
        title: 'Informes',
        type: 'collapsable',
        icon: 'heroicons_outline:square-3-stack-3d',
        children: [
            
        ]
    },
    {
        id: 'compras',
        title: 'Compras',
        type: 'collapsable',
        icon: 'heroicons_outline:square-3-stack-3d',
        children: [
            {
                id: 'compras.ordenesdecompras',
                title: 'Órdenes de compra',
                type: 'basic',
                link: '/compras/ordenes-de-compra/',
            },   
            {
                id: 'compras.compras',
                title: 'Compras',
                type: 'basic',
                link: '/compras/compras',
            }   
        ]
    }
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id: 'example',
        title: 'Example',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/example'
    }
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id: 'example',
        title: 'Example',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/example'
    }
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id: 'example',
        title: 'Example',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/example'
    }
];
