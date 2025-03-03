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
import {DOCUMENT, NgClass, NgForOf, NgIf} from '@angular/common';
import {ActivatedRoute, Router, RouterLink, RouterOutlet} from '@angular/router';
import {MatDrawer, MatDrawerContainer, MatSidenavModule} from '@angular/material/sidenav';
import {Subject} from 'rxjs';
import {debounceTime, takeUntil, tap} from 'rxjs/operators';
import {FuseMediaWatcherService} from "../../../../../@fuse/services/media-watcher";
import {EmbarcacionStore} from "../../data-access/embarcacion.store";
import {MatFormField} from "@angular/material/form-field";
import {LeadIconComponent} from "@shared/ui/lead-icon/lead.icon.component";
import {MatAnchor, MatButton} from "@angular/material/button";
import {MatPaginator} from "@angular/material/paginator";
import {MatInput} from "@angular/material/input";
import {MatIcon} from "@angular/material/icon";
import { LoadingDirective } from '@shared/directives/loading.directive';

@Component({
    standalone: true,
    templateUrl: './embarcacion.list.component.html',
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
        LoadingDirective
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class EmbarcacionListComponent implements OnInit, OnDestroy {
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;

    drawerMode: 'side' | 'over';
    selectedStateFixedasset: any;

    private _unsubscribeAll: Subject<any> = new Subject<any>();
 
    private searchEmbarcacionChanged: Subject<string> = new Subject<string>();

    embarcacionStore = inject(EmbarcacionStore);

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        @Inject(DOCUMENT) private _document: any,
        private _router: Router,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
    ) {
    }

    ngOnInit(): void {

        this.matDrawer.openedChange.subscribe((opened) => {
            if (!opened) {
                this.selectedStateFixedasset = null;

                this._changeDetectorRef.markForCheck();
            }
        });

        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {

                if (matchingAliases.includes('lg')) {
                    this.drawerMode = 'side';
                } else {
                    this.drawerMode = 'over';
                }

                this._changeDetectorRef.markForCheck();
            });
        this.searchEmbarcacionChanged.pipe(
            takeUntil(this._unsubscribeAll),
            debounceTime(800),
            tap(searchValue => {
                this.embarcacionStore.changeQueryInEmbarcacion(searchValue);
            })
        ).subscribe();
    }

    onBackdropClicked(): void {
        this._router.navigate(['./'], {relativeTo: this._activatedRoute});

        this._changeDetectorRef.markForCheck();
    }

    public searchEmbarcacionByQuery(searchValue: string) {
        this.searchEmbarcacionChanged.next(searchValue);
    }

    public changePagination(event: any) {
        this.embarcacionStore.changePageInEmbarcacion(event);
    }

    public loadAllStatesFixedAsset() {
        this.embarcacionStore.loadAllEmbarcacion();
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(true);
        this._unsubscribeAll.complete();
    }
}
