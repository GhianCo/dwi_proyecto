import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    Inject,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { CommonModule, DOCUMENT, NgClass, NgForOf, NgIf } from '@angular/common';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDrawer, MatDrawerContainer, MatSidenavModule } from '@angular/material/sidenav';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil, tap } from 'rxjs/operators';
import { FuseMediaWatcherService } from "../../../../../@fuse/services/media-watcher";
import { MatFormField } from "@angular/material/form-field";
import { LeadIconComponent } from "@shared/ui/lead-icon/lead.icon.component";
import { MatAnchor, MatButton } from "@angular/material/button";
import { MatPaginator } from "@angular/material/paginator";
import { MatInput } from "@angular/material/input";
import { MatIcon } from "@angular/material/icon";
import { ClienteStore } from '../../data-access/cliente.store';
import { LoadingDirective } from '@shared/directives/loading.directive';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { SecurityService } from '@shared/services/security.service';
import { CurrencyFormatPipe } from '@shared/pipes/currency-formant.pipe';
import { MatMenuModule } from '@angular/material/menu';
import { NO, SI } from '@shared/constants/app.const';

@Component({
    standalone: true,
    templateUrl: './cliente-list.component.html',
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
        CommonModule,
        LoadingDirective,
        MatOption,
        MatSelect,
        ReactiveFormsModule,
        CurrencyFormatPipe,
        MatMenuModule,
        LoadingDirective
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ClienteListComponent implements OnInit, OnDestroy {
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;

    public drawerMode: 'side' | 'over';
    public selectedStateFixedasset: any;

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    private searchZonaChanged: Subject<string> = new Subject<string>();
    public clienteStore = inject(ClienteStore);

    public filtrosList = [
        { tipo: "1", value: "Nombre" },
        { tipo: "2", value: "Número" },
        { tipo: "3", value: "Código interno" },
    ];

    public form: FormGroup;

    public simboloMoneda = this.securityService.getSimboloMoneda();

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        @Inject(DOCUMENT) private _document: any,
        private _router: Router,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private fb: FormBuilder,
        private securityService: SecurityService
    ) {
    }

    ngOnInit(): void {
        const primerFiltroSeleccionado = this.filtrosList[0].tipo;

        this.form = this.fb.group({
            tipoFiltro: [primerFiltroSeleccionado]
        })

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
                // this.clienteStore.changeQueryInTransportista(searchValue);
                this.clienteStore.changeQueryInCliente(searchValue);
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
        // this.clienteStore.changePageInTransportista(event);
        this.clienteStore.changePageInCliente(event);
    }

    public loadAllStatesFixedAsset() {
        this.clienteStore.loadAllClienteStore();
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(true);
        this._unsubscribeAll.complete();
    }

    public changeFiltroSelected(event: any) {
        const criteria = {
            tipoFiltro: event.value
        }
        this.clienteStore.updateFilterClienteToApply(criteria);
    }

    public bloquearPorDeudaPendiete(cliente: any) {
        const clienteToUpdate = structuredClone(cliente);
        clienteToUpdate.cliente_bloqueadopordeudapendiente = SI;
        this.clienteStore.loadUpdateCliente(clienteToUpdate);
    }

    public desbloquearPorDeudaPendiete(cliente: any) {
        const clienteToUpdate = structuredClone(cliente);
        clienteToUpdate.cliente_bloqueadopordeudapendiente = NO;
        this.clienteStore.loadUpdateCliente(clienteToUpdate);
    }

    public bloquearPorLineaDeCredito(cliente: any) {
        const clienteToUpdate = structuredClone(cliente);
        clienteToUpdate.cliente_bloqueadoporlineadecredito = SI;
        this.clienteStore.loadUpdateCliente(clienteToUpdate);        
    }

    public desbloquearPorLineaDeCredito(cliente: any) {
        const clienteToUpdate = structuredClone(cliente);
        clienteToUpdate.cliente_bloqueadoporlineadecredito = NO;
        this.clienteStore.loadUpdateCliente(clienteToUpdate);        
    }


}
