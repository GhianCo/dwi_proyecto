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
import {DestinoStore} from "../../data-access/destino.store";
import {MatButton, MatIconButton} from "@angular/material/button";
import {NgIf} from "@angular/common";
import {MatTooltip} from "@angular/material/tooltip";
import {RouterLink} from "@angular/router";
import {MatFormField} from "@angular/material/form-field";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import { LoadingButtonDirective } from '@shared/directives/loading-button.directive';
import {DestinoListComponent} from "../destino-list/destino.list.component";
import {OnlyPositiveIntegerDirective} from "@shared/directives/only-positive-integer.directive";

@Component({
    standalone: true,
    templateUrl: './destino.detail.component.html',
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

export class DestinoDetailComponent implements OnInit, OnDestroy {
    editMode: boolean = false;
    destinoForm: FormGroup;

    private _tagsPanelOverlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    destinoStore = inject(DestinoStore);

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _destinoListComponent: DestinoListComponent,
        private _formBuilder: FormBuilder,
    ) {
    }

    ngOnInit(): void {
        this._destinoListComponent.matDrawer.open();
        this.destinoForm = this._formBuilder.group({
            id: [''],
            nombre: ['', [Validators.required]],
            tipo: ['', [Validators.required]],
            actividad: ['', [Validators.required]],
            direccion: ['', [Validators.required]],
            activa: [true]
        });
        of(this.destinoStore.vm().destinoSelected)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((destinoSelected: any) => {
                this._destinoListComponent.matDrawer.open();
                if(destinoSelected?.id > 0) {
                    this.toggleEditMode(false);
                } else {
                    this.toggleEditMode(true);
                }
                this.destinoForm.patchValue(destinoSelected);
                this._changeDetectorRef.markForCheck();
            });
    }

    closeDrawer(): Promise<MatDrawerToggleResult> {
        return this._destinoListComponent.matDrawer.close();
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
        if (this.destinoForm.invalid) {
            return;
        }
        const destino = this.destinoForm.getRawValue();
        if (destino.id) {
            this.destinoStore.loadUpdateDestino(destino);
        } else {
            this.destinoStore.loadCreateDestino(destino);
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
