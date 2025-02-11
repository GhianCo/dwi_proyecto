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
import { DOCUMENT, NgClass, NgForOf, NgIf } from '@angular/common';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { FormControl } from '@angular/forms';
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
import { CajaStore } from '../../data-access/mapers/caja.store';
import { LoadingDirective } from '@shared/directives/loading.directive';

@Component({
  standalone: true,
  templateUrl: './caja-list.component.html',
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
export class CajaListComponent implements OnInit {
  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;

  public drawerMode: 'side' | 'over';
  public selectedStateFixedasset: any;

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  private searchZonaChanged: Subject<string> = new Subject<string>();
  public cajaStore = inject(CajaStore);

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
              this.cajaStore.changeQueryInCaja(searchValue);
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
      this.cajaStore.changePageInCaja(event);
  }

  public loadAllStatesFixedAsset() {
      this.cajaStore.loadAllCajaStore();
  }

  ngOnDestroy(): void {
      this._unsubscribeAll.next(true);
      this._unsubscribeAll.complete();
  }
}
