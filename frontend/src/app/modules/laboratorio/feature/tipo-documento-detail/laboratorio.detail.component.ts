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
import {LaboratorioListComponent} from "../laboratorio-list/laboratorio.list.component";
import {MatButton, MatIconButton} from "@angular/material/button";
import {NgIf} from "@angular/common";
import {MatTooltip} from "@angular/material/tooltip";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import { LaboratorioStore } from '../../data-access/laboratorio.store';
import { LoadingButtonDirective } from '@shared/directives/loading-button.directive';

@Component({
    standalone: true,
    templateUrl: './laboratorio.detail.component.html',
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
        MatLabel,
        LoadingButtonDirective
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class LaboratorioDetailComponent implements OnInit, OnDestroy {

    public editMode: boolean = false;
    public form: FormGroup;

    private _tagsPanelOverlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    public laboratorioStore = inject(LaboratorioStore);
    public editandoLaboratorio: boolean = false;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _laboratorioListComponent: LaboratorioListComponent,
        private _formBuilder: FormBuilder,
        private _activatedRoute: ActivatedRoute
    ) {};

    public ngOnInit(): void {
        // Abre el sidebar
        this._laboratorioListComponent.matDrawer.open();

        // Crea el formulario
        this.form = this._formBuilder.group({
            laboratorio_id: [''],
            laboratorio_descripcion: ['', [Validators.required]],
            laboratorio_sigla: ['', [Validators.required]],
            laboratorio_activo: [true]
        });

        // Suscribe a los cambios del laboratorio seleccionado
        of(this.laboratorioStore.vm().laboratorioSelected)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((laboratorioSelected: any) => {
                this._laboratorioListComponent.matDrawer.open();
                if(laboratorioSelected?.laboratorio_id > 0) {
                    this.toggleEditMode(false);
                    this.editandoLaboratorio = true;
            } else {
                    this.toggleEditMode(true);
                    this.editandoLaboratorio = false;
                }
                this.form.patchValue(laboratorioSelected);
                this._changeDetectorRef.markForCheck();
            });

        this._activatedRoute.params
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((params) => {
            if (params.id) {
                this.laboratorioStore.searchlaboratorioById(params.id);
                const laboratorioData = this.laboratorioStore.laboratorioSelected;
                this.form.patchValue(laboratorioData);
            }
        });
    };

    public closeDrawer(): Promise<MatDrawerToggleResult> {
        return this._laboratorioListComponent.matDrawer.close();
    };

    public toggleEditMode(editMode: boolean | null = null){
        if (editMode === null) {
            this.editMode = !this.editMode;
        }
        else {
            this.editMode = editMode;
        }

        this._changeDetectorRef.markForCheck();
    };

    public createUpdateSelected(): void {
        if (this.form.invalid) {
            return;
        }
        const tipoDocumento = this.form.getRawValue();
        if (tipoDocumento.laboratorio_id) {
            this.laboratorioStore.loadUpdatelaboratorio(tipoDocumento);
        } else {
            this.laboratorioStore.loadCreatelaboratorio(tipoDocumento);
        }
    };

    public ngOnDestroy(): void {
        this._unsubscribeAll.next(true);
        this._unsubscribeAll.complete();

        if (this._tagsPanelOverlayRef) {
            this._tagsPanelOverlayRef.dispose();
        };
    };
};
