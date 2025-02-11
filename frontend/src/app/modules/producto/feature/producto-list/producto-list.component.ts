import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    effect,
    inject,
    Inject,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { DOCUMENT, JsonPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDrawer, MatDrawerContainer, MatSidenavModule } from '@angular/material/sidenav';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil, tap } from 'rxjs/operators';
import { FuseMediaWatcherService } from "../../../../../@fuse/services/media-watcher";
import { ProductoStore } from "../../data-access/producto.store";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { LeadIconComponent } from "@shared/ui/lead-icon/lead.icon.component";
import { MatAnchor, MatButton } from "@angular/material/button";
import { MatPaginator } from "@angular/material/paginator";
import { MatInput } from "@angular/material/input";
import { MatIcon } from "@angular/material/icon";
import { LoadingDirective } from '@shared/directives/loading.directive';
import { DynamicTableService } from '@shared/services/dynamic-table.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { ModalVerHistorialProductoComponent } from '../modals/modal-ver-historial-producto/modal-ver-historial-producto.component';

@Component({
    standalone: true,
    templateUrl: './producto-list.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [
        MatDrawerContainer,
        RouterOutlet,
        NgIf,
        MatFormField,
        LeadIconComponent,
        MatButton,
        RouterLink,
        NgClass,
        NgForOf,
        MatPaginator,
        MatAnchor,
        MatSidenavModule,
        MatInput,
        MatIcon,
        JsonPipe,
        LoadingDirective,
        MatMenuModule,
        MatCheckboxModule,
        MatLabel,
        MatSelect,
        MatOption,
        ReactiveFormsModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProductoPageListComponent implements OnInit, OnDestroy {
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;

    public drawerMode: 'side' | 'over';
    public selectedStateFixedasset: any;

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    private searchZonaChanged: Subject<string> = new Subject<string>();
    public productoStore = inject(ProductoStore);
    public columns: { key: string; label: string; visible: boolean; fixed: boolean; }[];
    public columnasParaConfigurar = [];

    public filtrosList = [
        { tipo: "1", value: "Nombre" },
        { tipo: "2", value: "Código interno" },
        { tipo: "3", value: "Marca/Laboratorio" },
        // { tipo: "4", value: "Código de barras" },
    ];

    public form: FormGroup;


    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        @Inject(DOCUMENT) private _document: any,
        private _router: Router,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private dynamicTableService: DynamicTableService,
        private fb: FormBuilder,
        private dialog: MatDialog
    ) { 
        effect(() => {
            console.log(this.productoStore.state().refreshData);

            if (this.productoStore.state().refreshData) {
                this.loadAllStatesFixedAsset();
                this.productoStore.updateRefreshData(false);
            }

        }, { allowSignalWrites : true });

    }

    ngOnInit(): void {

        const primerFiltroSeleccionado = this.filtrosList[0].tipo;

        this.form = this.fb.group({
            tipoFiltro: [primerFiltroSeleccionado]
        });

        this.productoStore.updateFilterProductoToApply({
            tipoFiltro: primerFiltroSeleccionado
        })

        this.cargarConfiguracionTabla();

        this.matDrawer.openedChange.subscribe((opened) => {

            if (!opened) {
                this.selectedStateFixedasset = null;
                this._changeDetectorRef.markForCheck();
            }
        });

        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {

                if (matchingAliases.includes('lg')) {
                    this.drawerMode = 'side';
                } else {
                    this.drawerMode = 'over';
                }

                this._changeDetectorRef.markForCheck();
            });


        this.searchZonaChanged.pipe(
            takeUntil(this._unsubscribeAll),
            debounceTime(800),
            tap(searchValue => {
                this.productoStore.changeQueryInProducto(searchValue);
            })
        ).subscribe();
    }

    onBackdropClicked(): void {
        this._router.navigate(['./'], { relativeTo: this._activatedRoute });
        this._changeDetectorRef.markForCheck();
    }

    public searchTipoDocumentoByQuery(searchValue: string) {
        this.searchZonaChanged.next(searchValue);
    }

    public changePagination(event: any) {
        this.productoStore.changePageInProducto(event);
    }

    public loadAllStatesFixedAsset() {
        this.productoStore.loadAllProductoStore();
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(true);
        this._unsubscribeAll.complete();
    }

    toggleColumn(key: string) {
        this.dynamicTableService.toggleColumnVisibility(key);
    }
    changeFiltroSelected(event: any) {
        const tipoFiltro = event.value;
        const criteria = { tipoFiltro }

        this.productoStore.updateFilterProductoToApply(criteria);
    }
    
    private cargarConfiguracionTabla() {
        const initalColumns = [
            { key: 'presentacionproducto_nombre', label: 'Producto', visible: true, fixed: true },
            { key: 'presentacionproducto_descripcion', label: 'Descripción', visible: false, fixed: false },
            { key: 'producto_codigo', label: 'Codigo interno', visible: true, fixed: true },
            { key: 'unidad_medida', label: 'Unidad medida', visible: true, fixed: true },
            { key: 'laboratorio', label: 'Laboratorio', visible: false, fixed: false },
            { key: 'producto_incluyeivg', label: 'IGV', visible: true, fixed: false },
            { key: 'precio_unitario', label: 'Precio unitario', visible: true, fixed: true },
            { key: 'presentacionproducto_stockactual', label: 'Stock actual', visible: true, fixed: true },
            { key: 'presentacionproducto_registrosanitario', label: 'N° Sanitario', visible: false, fixed: false },
            { key: 'presentacionproducto_digemid', label: 'Digemind', visible: false, fixed: false },
            { key: 'presentacionproducto_activo', label: 'Activo', visible: false, fixed: false },
            { key: 'ver_detalles', label: 'Detalles', visible: true, fixed: true },
            { key: 'ver_historial', label: 'Historial', visible: true, fixed: true },
        ];

        this.dynamicTableService.setColumnConfig(initalColumns);

        this.dynamicTableService.columnConfig$.subscribe((config) => {
            this.columns = config;
            this.columnasParaConfigurar = config.filter(column => !column.fixed);
        });
    }

    public verHistorialProducto(presentacion: any) {
        this.dialog.open(ModalVerHistorialProductoComponent, {
            data: {
                presentacionproducto: presentacion
            },
            width: '900px'
        })
    }

}
