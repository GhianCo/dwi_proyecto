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
import {EmbarcacionStore} from "../../data-access/embarcacion.store";
import {MatButton, MatIconButton} from "@angular/material/button";
import {NgIf} from "@angular/common";
import {MatTooltip} from "@angular/material/tooltip";
import {RouterLink} from "@angular/router";
import {MatFormField} from "@angular/material/form-field";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import { LoadingButtonDirective } from '@shared/directives/loading-button.directive';
import {EmbarcacionListComponent} from "../embarcacion-list/embarcacion.list.component";
import {OnlyPositiveIntegerDirective} from "@shared/directives/only-positive-integer.directive";

@Component({
    standalone: true,
    templateUrl: './embarcacion.detail.component.html',
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
        LoadingButtonDirective,
        OnlyPositiveIntegerDirective
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class EmbarcacionDetailComponent implements OnInit, OnDestroy {
    editMode: boolean = false;
    embarcacionForm: FormGroup;

    private _tagsPanelOverlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    embarcacionStore = inject(EmbarcacionStore);

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _embarcacionListComponent: EmbarcacionListComponent,
        private _formBuilder: FormBuilder,
    ) {
    }

    ngOnInit(): void {
        this._embarcacionListComponent.matDrawer.open();
        this.embarcacionForm = this._formBuilder.group({
            id: [''],
            nombre: ['', [Validators.required]],
            matricula: ['', [Validators.required]],
            capacidad_bodega: ['', [Validators.required]],
            permiso_pesca: ['', [Validators.required]],
            regimen: ['', [Validators.required]],
            persona_id: ['', [Validators.required]],
            activa: [true]
        });
        of(this.embarcacionStore.vm().embarcacionSelected)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((embarcacionSelected: any) => {
                this._embarcacionListComponent.matDrawer.open();
                if(embarcacionSelected?.id > 0) {
                    this.toggleEditMode(false);
                } else {
                    this.toggleEditMode(true);
                }
                this.embarcacionForm.patchValue(embarcacionSelected);
                this._changeDetectorRef.markForCheck();
            });
    }

    closeDrawer(): Promise<MatDrawerToggleResult> {
        return this._embarcacionListComponent.matDrawer.close();
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
        if (this.embarcacionForm.invalid) {
            return;
        }
        const embarcacion = this.embarcacionForm.getRawValue();
        if (embarcacion.id) {
            this.embarcacionStore.loadUpdateEmbarcacion(embarcacion);
        } else {
            this.embarcacionStore.loadCreateEmbarcacion(embarcacion);
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
