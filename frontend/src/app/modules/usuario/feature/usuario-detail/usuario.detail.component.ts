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
        KeyValuePipe,
        MatGridListModule,
        MatCheckboxModule,
        CustomFilterPipe,
        JsonPipe,
        LoadingDirective,
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
    public permisosList: any[] = this._persistenceService.get(PKEY.PERMISOS_LIST);
    // public permisosUsuario: any[] = this._persistenceService.get(PKEY.PERMISOS_USER);
    public permisosUsuario: any[] = [];

    public tiposComisiones = TIPOS_COMISIONES;

    public comisionPorVenta = COMISION_POR_VENTA;
    public comisionPorCobranza = COMISION_POR_COBRANZA;
    
    public diasCreditoList = [];
    public cargandoDiasCreditoList = false;

    public comisionEmpty = this._formBuilder.group({
        comision_tipo: [null, [Validators.required]],
        comision_porcentaje: [null, [Validators.required]],
        diascredito_id: [null, []],
        comision_activo: [true, [Validators.required]],
        eliminar: [false, []],
    });

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

        this.obtenerDiasCreditoActivos();

        this._usuarioListResolver.matDrawer.open();

        this.form = this._formBuilder.group({
            usuario_id: [''],
            usuario_nombres: ['', [Validators.required]],
            usuario_apellidos: [],
            usuario_correo: ["", [Validators.required]],
            usuario_telefono: [""],
            usuario_usuario: ["", [Validators.required]],
            usuario_activo: [true],
            usuario_clave: ["", [Validators.required]],
            tipodocumento_id: ["", [Validators.required]],
            usuario_documento: ["", [Validators.required]],
            permisos: this._formBuilder.array([]),
            comisiones:  this._formBuilder.array([]),
            usuario_cargo: [null, []],
            usuario_celularpersonal: [null, []],
            usuario_celularcorporativo: [null, []],
            usuario_direccion: [null, []],
            usuario_fechanacimiento: [null, []],
        });


        this.permisosAgrupados = this.agruparPermisos(this.permisosList);
        // console.log(this.permisosAgrupados);

        of(this.usuarioStore.vm().usuarioSelected)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((usuarioSelected: any) => {
                this._usuarioListResolver.matDrawer.open();
                if (usuarioSelected?.usuario_id > 0) {
                    this.permisosUsuario = usuarioSelected.permisos;

                    /** Cuando el usuario no tiene comisiones configurada
                     * le creo una comision vacia
                     */
                    if(usuarioSelected.comisiones.length === 0) {
                        const nuevaComisionGroup = this._formBuilder.group({
                            comision_tipo: [null, [Validators.required]],
                            comision_porcentaje: [null, [Validators.required]],
                            diascredito_id: [null, []],
                            comision_activo: [true, [Validators.required]],
                            eliminar: [false, []],
                        });

                        this.comisiones.push(nuevaComisionGroup);
                    } else {
                        this.cargarComisionesUsuario(usuarioSelected.comisiones);
                    }
                    this._changeDetectorRef.detectChanges();
                    this.toggleEditMode(false);
                } else {
                    /* Si no estoy actualizando creo una
                        comision vacia
                    */
                    this.comisiones.push(this.comisionEmpty);
                    this.toggleEditMode(true);
                }
                this.form.patchValue(usuarioSelected);
                this._changeDetectorRef.markForCheck();
            });

        // this._activatedRoute.params
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe((params) => {
        //         if (params.id) {
        //             this.usuarioStore.searchUsuarioById(params.id);
        //             const usuarioSelected = this.usuarioStore.usuarioSelected;
        //             this.form.patchValue(usuarioSelected);
        //         }
        //     });


        this.addCheckboxes();
        

    }   

    public get comisiones() {
        return this.form.get('comisiones') as FormArray;
    }

    public addCheckboxes() {
        const permisosArray = this.form.get('permisos') as FormArray;
        // permisosArray.clear(); // Limpia controles existentes
    
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


        // console.log(usuario);
        // console.log(permisos);
        if (usuario.usuario_id) {
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

    agruparPermisos(permisos: any[]) {
        return permisos.reduce((acc, permiso) => {
            if (!acc[permiso.permiso_grupo]) {
                acc[permiso.permiso_grupo] = [];
            }
            acc[permiso.permiso_grupo].push(permiso);
            return acc;
        }, {});
    }

    getSelectedPermissions() {
        const selectedPermisos: any[] = this.form.value.permisos
            .map((checked: boolean, i: number) => (checked ? this.permisosList[i].permiso_id : null))
            .filter((v: number | null) => v !== null);
        return selectedPermisos;
    }

    getIndexPermiso(permiso_id: number) {
        return this.permisosUsuario.findIndex(permiso => permiso.permiso_id === permiso_id);
    }


    public nuevaComision() {
        const nuevaComisionGroup = this._formBuilder.group({
            comision_tipo: [null, [Validators.required]],
            comision_porcentaje: [null, [Validators.required]],
            diascredito_id: [null, []],
            comision_activo: [true, [Validators.required]],
            eliminar: [false, []],
        });

        this.comisiones.push(nuevaComisionGroup); 
    }

    public changeTipocomision(event: any, index: number) {
        const comisionTipo = event.value;

        if(comisionTipo == COMISION_POR_VENTA) {
            this.comisiones.controls[index].get('diascredito_id').clearValidators();
            this.comisiones.controls[index].get('diascredito_id').updateValueAndValidity();    
        } 

        if(comisionTipo == COMISION_POR_COBRANZA) {
            this.comisiones.controls[index].get('diascredito_id').setValidators([Validators.required]);
        }
    }   

    public eliminarComision(index: number) {
        const controlComision = this.comisiones.controls.at(index);
        controlComision.get('eliminar').setValue(true);

        /** Quita los validators.required */
        controlComision.get('comision_tipo').clearValidators();
        controlComision.get('comision_tipo').updateValueAndValidity();
        controlComision.get('comision_porcentaje').clearValidators();
        controlComision.get('comision_porcentaje').updateValueAndValidity();
        controlComision.get('diascredito_id').clearValidators();
        controlComision.get('diascredito_id').updateValueAndValidity();
        controlComision.get('comision_activo').clearValidators();
        controlComision.get('comision_activo').updateValueAndValidity();
        controlComision.get('eliminar').clearValidators();
        controlComision.get('eliminar').updateValueAndValidity();
        

        this._changeDetectorRef.detectChanges();
    }

    public filterComisiones(comision: any) {
        return !comision.get('eliminar') || !comision.get('eliminar').value
    }
        

    public cargarComisionesUsuario(comisionesArray: any[]) {
        this.comisiones.clear();

        comisionesArray.forEach(comision => {
            const comisionGroup = this._formBuilder.group({
                comision_id: [comision.comision_id],
                comision_tipo: [comision.comision_tipo, [Validators.required]],
                comision_porcentaje: [comision.comision_porcentaje, [Validators.required]],
                diascredito_id: [comision.diascredito_id, []],
                comision_activo: [comision.comision_activo, [Validators.required]],
                eliminar: [false, []],
            });

            if(comision.comision_tipo == COMISION_POR_COBRANZA) {
                comisionGroup.get('diascredito_id').setValidators([Validators.required]);
            }

            this.comisiones.push(comisionGroup);

        });
        
        this.comisiones.updateValueAndValidity();
        this._changeDetectorRef.detectChanges();
    }

    public obtenerDiasCreditoActivos() {
        this.cargandoDiasCreditoList = true;
    
        const params = { 
          active: true 
        };
    
        this.diasCreditoRemoteReq.requestSearchDiasCreditoByCriteria(params)
          .pipe(
            map((response) =>{
              this.cargandoDiasCreditoList = false;
              if(response.data && Array.isArray(response.data) && response.data.length > 0) {
                this.diasCreditoList = response.data;
              }
            }),
            catchError((error) => {
              this.cargandoDiasCreditoList = false;
              this.diasCreditoList = [];
              this._changeDetectorRef.detectChanges();
              return [];
            })
          ).subscribe();
    
      }


}
