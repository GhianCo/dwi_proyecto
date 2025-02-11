import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormField, MatFormFieldControl } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { ZonaStore } from 'app/modules/zona/data-access/zona.store';
import { OverlayRef } from '@angular/cdk/overlay';
import { Subject, of, takeUntil } from 'rxjs';
import { CajaListComponent } from '../caja-list/caja-list.component';
import { MatSelect } from '@angular/material/select';
import { CajaStore } from '../../data-access/mapers/caja.store';
import { LoadingButtonDirective } from '@shared/directives/loading-button.directive';

@Component({
  standalone: true,
  templateUrl: './caja-detail.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [
    MatButton,
    NgIf,
    MatIconButton,
    MatTooltip,
    RouterLink,
    ReactiveFormsModule,
    MatFormField,
    MatSlideToggle,
    MatIcon,
    MatInput,
    MatSelect,
    LoadingButtonDirective
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CajaDetailComponent implements OnInit {
  public editMode: boolean = false;
  public cajaForm: FormGroup;

  private _tagsPanelOverlayRef: OverlayRef;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  public cajaStore = inject(CajaStore);

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _cajaListComponent: CajaListComponent,
    private _formBuilder: FormBuilder,
  ) {
  }

  ngOnInit(): void {
    this._cajaListComponent.matDrawer.open();

    this.cajaForm = this._formBuilder.group({
      caja_id: [''],
      caja_descripcion: ['', [Validators.required]],
      caja_activo: [true],
    });

    of(this.cajaStore.vm().cajaSelected)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((cajaSelected: any) => {
        this._cajaListComponent.matDrawer.open();
        if (cajaSelected?.caja_id > 0) {
          this.toggleEditMode(false);
        } else {
          this.toggleEditMode(true);
        }
        this.cajaForm.patchValue(cajaSelected);
        this._changeDetectorRef.markForCheck();
      });
  }

  closeDrawer(): Promise<MatDrawerToggleResult> {
    return this._cajaListComponent.matDrawer.close();
  }

  toggleEditMode(editMode: boolean | null = null) {
    if (editMode === null) {
      this.editMode = !this.editMode;
    }
    else {
      this.editMode = editMode;
    }
    this._changeDetectorRef.markForCheck();
  }

  createUpdateSelected(): void {
    if (this.cajaForm.invalid) {
      return;
    }
    const caja = this.cajaForm.getRawValue();
    if (caja.caja_id) {
      const data = {
        ...this.cajaStore.vm().cajaSelected,
        ...caja
      }
      this.cajaStore.loadUpdateCaja(data);
    } else {
      this.cajaStore.loadCreateCaja(caja);
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();

    if (this._tagsPanelOverlayRef) {
      this._tagsPanelOverlayRef.dispose();
    }
  }
}
