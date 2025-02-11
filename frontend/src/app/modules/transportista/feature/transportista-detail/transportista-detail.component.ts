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
import { TransportistaStore } from "../../data-access/transportista.store";
import { MatButton, MatIconButton } from "@angular/material/button";
import { NgFor, NgIf } from "@angular/common";
import { MatTooltip } from "@angular/material/tooltip";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { MatFormField } from "@angular/material/form-field";
import { MatSlideToggle } from "@angular/material/slide-toggle";
import { MatIcon } from "@angular/material/icon";
import { MatInput } from "@angular/material/input";
import { tap } from 'lodash';
import { TransportistaListComponent } from '../transportista-list/transportista-list.component';
import { MatOption, MatSelect } from '@angular/material/select';
import { LoadingButtonDirective } from '@shared/directives/loading-button.directive';

@Component({
    standalone: true,
    templateUrl: './transportista-detail.component.html',
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
        MatOption,
        NgFor,
        LoadingButtonDirective
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class TransportistaDetailComponent implements OnInit, OnDestroy {
    public editMode: boolean = false;
    public transportistaForm: FormGroup;

    private _tagsPanelOverlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    public transportistaStore = inject(TransportistaStore);

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _transportistaListComponent: TransportistaListComponent,
        private _formBuilder: FormBuilder,
        private _activatedRoute: ActivatedRoute,
    ) {
    }

    ngOnInit(): void {
        this._transportistaListComponent.matDrawer.open();

        this.transportistaForm = this._formBuilder.group({
            transportista_id: [''],
            transportista_nombre: ['', [Validators.required]],
            tipodocumento_id: ['', [Validators.required]],
            transportista_numero: ['', [Validators.required]],
            transportista_direccionfiscal: [''],
            transportista_activo: [true]
        });

        of(this.transportistaStore.vm().transportistaSelected)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((transportistaSelected: any) => {
                this._transportistaListComponent.matDrawer.open();
                if (transportistaSelected?.transportista_id > 0) {
                    this.toggleEditMode(false);
                } else {
                    this.toggleEditMode(true);
                }
                this.transportistaForm.patchValue(transportistaSelected);
                this._changeDetectorRef.markForCheck();
            });

        this._activatedRoute.params
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((params) => {
                if (params.id) {
                    this.transportistaStore.searchTransportistaById(params.id);
                    const zonaData = this.transportistaStore.transportistaSelected;
                    this.transportistaForm.patchValue(zonaData);
                }
            });

    }

    closeDrawer(): Promise<MatDrawerToggleResult> {
        return this._transportistaListComponent.matDrawer.close();
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
        if (this.transportistaForm.invalid) {
            return;
        }
        const transportista = this.transportistaForm.getRawValue();
        if (transportista.transportista_id) {
            this.transportistaStore.loadUpdateTransportista(transportista);
        } else {
            this.transportistaStore.loadCreateTransportista(transportista);
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
