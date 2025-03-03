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
import {ConductorStore} from "../../data-access/conductor.store";
import {MatButton, MatIconButton} from "@angular/material/button";
import {NgIf} from "@angular/common";
import {MatTooltip} from "@angular/material/tooltip";
import {RouterLink} from "@angular/router";
import {MatFormField} from "@angular/material/form-field";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import { LoadingButtonDirective } from '@shared/directives/loading-button.directive';
import {ConductorListComponent} from "../conductor-list/conductor.list.component";
import {OnlyPositiveIntegerDirective} from "@shared/directives/only-positive-integer.directive";

@Component({
    standalone: true,
    templateUrl: './conductor.detail.component.html',
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

export class ConductorDetailComponent implements OnInit, OnDestroy {
    editMode: boolean = false;
    conductorForm: FormGroup;

    private _tagsPanelOverlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    conductorStore = inject(ConductorStore);

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _conductorListComponent: ConductorListComponent,
        private _formBuilder: FormBuilder,
    ) {
    }

    ngOnInit(): void {
        this._conductorListComponent.matDrawer.open();
        this.conductorForm = this._formBuilder.group({
            id: [''],
            nombres: ['', [Validators.required]],
            apellidos: ['', [Validators.required]],
            numero_documento: ['', [Validators.required]],
            telefono: ['', [Validators.required]],
            fecha_nacimiento: ['', [Validators.required]],
            activo: [true]
        });
        of(this.conductorStore.vm().conductorSelected)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((conductorSelected: any) => {
                this._conductorListComponent.matDrawer.open();
                if(conductorSelected?.id > 0) {
                    this.toggleEditMode(false);
                } else {
                    this.toggleEditMode(true);
                }
                this.conductorForm.patchValue(conductorSelected);
                this._changeDetectorRef.markForCheck();
            });
    }

    closeDrawer(): Promise<MatDrawerToggleResult> {
        return this._conductorListComponent.matDrawer.close();
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
        if (this.conductorForm.invalid) {
            return;
        }
        const conductor = this.conductorForm.getRawValue();
        if (conductor.id) {
            this.conductorStore.loadUpdateConductor(conductor);
        } else {
            this.conductorStore.loadCreateConductor(conductor);
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
