import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    OnDestroy,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OverlayRef } from '@angular/cdk/overlay';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { catchError, map, of, Subject, takeUntil } from 'rxjs';
import { UsuarioStore } from "../../data-access/usuario.store";
import { MatButton, MatButtonModule, MatIconButton } from "@angular/material/button";
import { JsonPipe, KeyValuePipe, NgFor, NgIf } from "@angular/common";
import { MatTooltip } from "@angular/material/tooltip";
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from "@angular/router";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatSlideToggle } from "@angular/material/slide-toggle";
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { MatInput } from "@angular/material/input";
import { tap } from 'lodash';
import { UsuarioListComponent } from '../usuario-list/usuario.list.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { PersistenceService } from '@shared/services/persistence.service';
import { PKEY } from '@shared/constants/persistence.const';
import { CARGOS, COMISION_POR_COBRANZA, COMISION_POR_VENTA, TIPOS_COMISIONES } from '@shared/constants/app.const';
import { CustomFilterPipe } from '@shared/pipes/filter.pipe';
import { DiasCreditoRemoteReq } from 'app/modules/diascredito/data-access/diascredito.remote.req';
import { LoadingDirective } from '@shared/directives/loading.directive';
import { MatProgressSpinner, MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingButtonDirective } from '@shared/directives/loading-button.directive';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatOption, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';

export const MY_FORMATS = {
    parse: {
        dateInput: 'LL'
    },
    display: {
        dateInput: 'DD/MM/YYYY',
        monthYearLabel: 'YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'YYYY'
    }
  };

@Component({
    standalone: true,
    templateUrl: './usuario.detail.component.html',
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
        MatSelectModule,
        MatOption,
        NgFor,
        MatExpansionModule,
        MatTabsModule,
        MatGridListModule,
        MatLabel,
        MatGridListModule,
        MatCheckboxModule,
        LoadingButtonDirective,
        MatProgressSpinnerModule,
        MatDatepickerModule,
    ],
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class UsuarioDetailComponent implements OnInit, OnDestroy {

    public hidePassword = true;

    public editMode: boolean = false;
    public form: FormGroup;

    private _tagsPanelOverlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    public usuarioStore = inject(UsuarioStore);

    public permisosAgrupados: any[] = [];
    public permisosUsuario: any[] = [];

    public cargosList = CARGOS;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _usuarioListResolver: UsuarioListComponent,
        private _formBuilder: FormBuilder,
        private _activatedRoute: ActivatedRoute,
        private _persistenceService: PersistenceService,
        private diasCreditoRemoteReq: DiasCreditoRemoteReq,
        private router: Router
    ) {
    }

    ngOnInit(): void {

        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                console.log('Navegación terminada:', event.url);
                // Lógica de recarga aquí
              }
        });

        this._usuarioListResolver.matDrawer.open();

        this.form = this._formBuilder.group({
            id: [''],
            nombres: ['', [Validators.required]],
            apellidos: [],
            email: ["", [Validators.required]],
            telefono: [""],
            nick: ["", [Validators.required]],
            activo: [true],
            clave: ["", [Validators.required]],
            tipo_documento: ["DNI", [Validators.required]],
            numero_documento: ["", [Validators.required]],
            direccion: [null, []],
            rol: [null, []],
        });

        of(this.usuarioStore.vm().usuarioSelected)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((usuarioSelected: any) => {
                this._usuarioListResolver.matDrawer.open();
                if (usuarioSelected?.id > 0) {
                    this.permisosUsuario = usuarioSelected.permisos;
                    this._changeDetectorRef.detectChanges();
                    this.toggleEditMode(false);
                } else {
                    this.toggleEditMode(true);
                }
                this.form.patchValue(usuarioSelected);
                this._changeDetectorRef.markForCheck();
            });
        this.addCheckboxes();
    }

    public addCheckboxes() {
        const permisosArray = this.form.get('permisos') as FormArray;

        Object.entries(this.permisosAgrupados).forEach(([grupo, permisos]) => {
            const grupoFormArray = this._formBuilder.group({
                grupo: [grupo],
                permisos: this._formBuilder.array([]) // Asegúrate de que esto sea un FormArray
            });

            permisos.forEach(permiso => {
                // Verificar si el permiso actual está en la lista de permisos del usuario
                const isChecked = this.permisosUsuario.some(usuarioPermiso => usuarioPermiso.permiso_id === permiso.permiso_id);
                // Agregar control con el estado correspondiente (checked o unchecked)
                (grupoFormArray.get('permisos') as FormArray).push(this._formBuilder.control(isChecked));
            });

            permisosArray.push(grupoFormArray); // Agregar grupo al FormArray principal
        });
    }



    closeDrawer(): Promise<MatDrawerToggleResult> {
        return this._usuarioListResolver.matDrawer.close();
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
        if (this.form.invalid) {
            return;
        }
        let usuario = this.form.getRawValue();
        const permisos = this.getSelectedPermisos();
        usuario.permisos = permisos;

        if (usuario.id) {
            this.usuarioStore.loadUpdateUsuario(usuario);
        } else {
            this.usuarioStore.loadCreateUsuario(usuario);
        }
    }

    public getSelectedPermisos() {
        const selectedPermisos = [];

        // Recorrer cada grupo de permisos
        (this.form.get('permisos') as FormArray).controls.forEach((grupoFormGroup, grupoIndex) => {
            const grupo = grupoFormGroup.get('grupo').value;
            const permisosFormArray = grupoFormGroup.get('permisos') as FormArray;

            // Recorrer los permisos dentro del grupo
            permisosFormArray.controls.forEach((permisoControl, permisoIndex) => {
                if (permisoControl.value === true) {
                    // Recuperar el permiso que está marcado
                    const permiso = this.permisosAgrupados[grupo][permisoIndex];
                    selectedPermisos.push(permiso);
                }
            });
        });

        return selectedPermisos;
    }


    togglePassword() {
        this.hidePassword = !this.hidePassword;
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(true);
        this._unsubscribeAll.complete();

        if (this._tagsPanelOverlayRef) {
            this._tagsPanelOverlayRef.dispose();
        }
    }
}
