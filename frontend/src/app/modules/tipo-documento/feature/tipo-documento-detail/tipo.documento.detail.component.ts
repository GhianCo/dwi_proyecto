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
import {TipoDocumentoStore} from "../../data-access/tipo.documento.store";
import {TipoDocumentoListComponent} from "../tipo-documento-list/tipo.documento.list.component";
import {MatButton, MatIconButton} from "@angular/material/button";
import {NgIf} from "@angular/common";
import {MatTooltip} from "@angular/material/tooltip";
import {RouterLink} from "@angular/router";
import {MatFormField} from "@angular/material/form-field";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import { LoadingButtonDirective } from '@shared/directives/loading-button.directive';

@Component({
    standalone: true,
    templateUrl: './tipo.documento.detail.component.html',
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

export class TipoDocumentoDetailComponent implements OnInit, OnDestroy {
    editMode: boolean = false;
    tipoDocumentoForm: FormGroup;

    private _tagsPanelOverlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    tipoDocumentoStore = inject(TipoDocumentoStore);

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _tipoDocumentoListComponent: TipoDocumentoListComponent,
        private _formBuilder: FormBuilder,
    ) {
    }

    ngOnInit(): void {
        this._tipoDocumentoListComponent.matDrawer.open();
        this.tipoDocumentoForm = this._formBuilder.group({
            tipodocumento_id: [''],
            tipodocumento_descripcion: ['', [Validators.required]],
            tipodocumento_activo: [true]
        });
        of(this.tipoDocumentoStore.vm().tipoDocumentoSelected)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((tipoDocumentoSelected: any) => {
                this._tipoDocumentoListComponent.matDrawer.open();
                if(tipoDocumentoSelected?.tipodocumento_id > 0) {
                    this.toggleEditMode(false);
                } else {
                    this.toggleEditMode(true);
                }
                this.tipoDocumentoForm.patchValue(tipoDocumentoSelected);
                this._changeDetectorRef.markForCheck();
            });
    }

    closeDrawer(): Promise<MatDrawerToggleResult> {
        return this._tipoDocumentoListComponent.matDrawer.close();
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
        if (this.tipoDocumentoForm.invalid) {
            return;
        }
        const tipoDocumento = this.tipoDocumentoForm.getRawValue();
        if (tipoDocumento.tipodocumento_id) {
            this.tipoDocumentoStore.loadUpdateTipoDocumento(tipoDocumento);
        } else {
            this.tipoDocumentoStore.loadCreateTipoDocumento(tipoDocumento);
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
