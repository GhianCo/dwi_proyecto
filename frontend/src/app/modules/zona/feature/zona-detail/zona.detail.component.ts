import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    OnDestroy,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OverlayRef } from '@angular/cdk/overlay';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { of, Subject, takeUntil } from 'rxjs';
import { ZonaStore } from "../../data-access/zona.store";
import { MatButton, MatIconButton } from "@angular/material/button";
import { NgIf } from "@angular/common";
import { MatTooltip } from "@angular/material/tooltip";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { MatFormField } from "@angular/material/form-field";
import { MatSlideToggle } from "@angular/material/slide-toggle";
import { MatIcon } from "@angular/material/icon";
import { MatInput } from "@angular/material/input";
import { ZonaPageListComponent } from '../zona-list/zona.list.component';
import { tap } from 'lodash';
import { LoadingButtonDirective } from '@shared/directives/loading-button.directive';

@Component({
    standalone: true,
    templateUrl: './zona.detail.component.html',
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
        LoadingButtonDirective
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ZonaDetailComponent implements OnInit, OnDestroy {
    public editMode: boolean = false;
    public zonaForm: FormGroup;

    private _tagsPanelOverlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    public zonaStore = inject(ZonaStore);

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _zonaListComponent: ZonaPageListComponent,
        private _formBuilder: FormBuilder,
        private _activatedRoute: ActivatedRoute,
    ) {
    }

    ngOnInit(): void {
        this._zonaListComponent.matDrawer.open();

        this.zonaForm = this._formBuilder.group({
            zona_id: [''],
            zona_descripcion: ['', [Validators.required]],
            zona_activo: [true]
        });

        of(this.zonaStore.vm().zonaSelected)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((zonaSelected: any) => {
                this._zonaListComponent.matDrawer.open();
                if (zonaSelected?.zona_id > 0) {
                    this.toggleEditMode(false);
                } else {
                    this.toggleEditMode(true);
                }
                this.zonaForm.patchValue(zonaSelected);
                this._changeDetectorRef.markForCheck();
            });

        this._activatedRoute.params
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((params) => {
                if (params.id) {
                    this.zonaStore.searchZonaById(params.id);
                    const zonaData = this.zonaStore.zonaSelected;
                    this.zonaForm.patchValue(zonaData);
                }
            });

    }

    closeDrawer(): Promise<MatDrawerToggleResult> {
        return this._zonaListComponent.matDrawer.close();
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
        if (this.zonaForm.invalid) {
            return;
        }
        const zona = this.zonaForm.getRawValue();
        if (zona.zona_id) {
            this.zonaStore.loadUpdateZona(zona);
        } else {
            this.zonaStore.loadCreateZona(zona);
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
