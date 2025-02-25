import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    OnDestroy,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { OverlayRef } from '@angular/cdk/overlay';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import {of, Subject, takeUntil} from 'rxjs';
import {PresentacionStore} from "../../data-access/presentacion.store";
import {MatButton, MatIconButton} from "@angular/material/button";
import {NgIf} from "@angular/common";
import {MatTooltip} from "@angular/material/tooltip";
import {RouterLink} from "@angular/router";
import {MatFormField} from "@angular/material/form-field";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import { LoadingButtonDirective } from '@shared/directives/loading-button.directive';
import {PresentacionListComponent} from "../presentacion-list/presentacion.list.component";

@Component({
    standalone: true,
    templateUrl: './presentacion.detail.component.html',
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

export class PresentacionDetailComponent implements OnInit, OnDestroy {
    editMode: boolean = false;
    presentacionForm: FormGroup;

    private _tagsPanelOverlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    presentacionStore = inject(PresentacionStore);

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _presentacionListComponent: PresentacionListComponent,
        private _formBuilder: FormBuilder,
    ) {
    }

    ngOnInit(): void {
        this._presentacionListComponent.matDrawer.open();
        this.presentacionForm = this._formBuilder.group({
            tipodocumento_id: [''],
            tipodocumento_descripcion: ['', [Validators.required]],
            tipodocumento_activo: [true]
        });
        of(this.presentacionStore.vm().presentacionSelected)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((presentacionSelected: any) => {
                this._presentacionListComponent.matDrawer.open();
                if(presentacionSelected?.tipodocumento_id > 0) {
                    this.toggleEditMode(false);
                } else {
                    this.toggleEditMode(true);
                }
                this.presentacionForm.patchValue(presentacionSelected);
                this._changeDetectorRef.markForCheck();
            });
    }

    closeDrawer(): Promise<MatDrawerToggleResult> {
        return this._presentacionListComponent.matDrawer.close();
    }

    toggleEditMode(editMode: boolean | null = null){
        if (editMode === null) {
            this.editMode = !this.editMode;
        }
        else {
            this.editMode = editMode;
        }

        this._changeDetectorRef.markForCheck();
    }

    createUpdateSelected(): void {
        if (this.presentacionForm.invalid) {
            return;
        }
        const presentacion = this.presentacionForm.getRawValue();
        if (presentacion.tipodocumento_id) {
            this.presentacionStore.loadUpdateTipoDocumento(presentacion);
        } else {
            this.presentacionStore.loadCreateTipoDocumento(presentacion);
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
