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
import {PuntoDesembarqueStore} from "../../data-access/punto.desembarque.store";
import {MatButton, MatIconButton} from "@angular/material/button";
import {NgIf} from "@angular/common";
import {MatTooltip} from "@angular/material/tooltip";
import {RouterLink} from "@angular/router";
import {MatFormField} from "@angular/material/form-field";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import { LoadingButtonDirective } from '@shared/directives/loading-button.directive';
import {PuntoDesembarqueListComponent} from "../punto-desembarque-list/punto.desembarque.list.component";
import {OnlyPositiveIntegerDirective} from "@shared/directives/only-positive-integer.directive";

@Component({
    standalone: true,
    templateUrl: './punto.desembarque.detail.component.html',
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

export class PuntoDesembarqueDetailComponent implements OnInit, OnDestroy {
    editMode: boolean = false;
    puntodesembarqueForm: FormGroup;

    private _tagsPanelOverlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    puntodesembarqueStore = inject(PuntoDesembarqueStore);

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _puntodesembarqueListComponent: PuntoDesembarqueListComponent,
        private _formBuilder: FormBuilder,
    ) {
    }

    ngOnInit(): void {
        this._puntodesembarqueListComponent.matDrawer.open();
        this.puntodesembarqueForm = this._formBuilder.group({
            id: [''],
            nombre: ['', [Validators.required]],
            tipo: ['', [Validators.required]],
            ubigeo: ['', [Validators.required]],
            activo: [true]
        });
        of(this.puntodesembarqueStore.vm().puntodesembarqueSelected)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((puntodesembarqueSelected: any) => {
                this._puntodesembarqueListComponent.matDrawer.open();
                if(puntodesembarqueSelected?.id > 0) {
                    this.toggleEditMode(false);
                } else {
                    this.toggleEditMode(true);
                }
                this.puntodesembarqueForm.patchValue(puntodesembarqueSelected);
                this._changeDetectorRef.markForCheck();
            });
    }

    closeDrawer(): Promise<MatDrawerToggleResult> {
        return this._puntodesembarqueListComponent.matDrawer.close();
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
        if (this.puntodesembarqueForm.invalid) {
            return;
        }
        const puntodesembarque = this.puntodesembarqueForm.getRawValue();
        if (puntodesembarque.id) {
            this.puntodesembarqueStore.loadUpdatePuntoDesembarque(puntodesembarque);
        } else {
            this.puntodesembarqueStore.loadCreatePuntoDesembarque(puntodesembarque);
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
