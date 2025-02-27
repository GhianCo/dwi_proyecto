import { FuseNavigationItem } from '@fuse/components/navigation';

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
                id: 'gestion.presentacion',
                title: 'Presentación',
                type: 'basic',
                link: '/gestion/presentacion',
            },
            {
                id: 'gestion.puntodesembarque',
                title: 'Punto de desembarque',
                type: 'basic',
                link: '/gestion/puntodesembarque',
            },
        ],
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
