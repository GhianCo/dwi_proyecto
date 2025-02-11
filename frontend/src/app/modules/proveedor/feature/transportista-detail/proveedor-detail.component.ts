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
import { lastValueFrom, of, Subject, takeUntil, withLatestFrom } from 'rxjs';
import { ProveedorStore } from "../../data-access/proveedor.store";
import { MatButton, MatIconButton } from "@angular/material/button";
import { KeyValuePipe, NgFor, NgIf } from "@angular/common";
import { MatTooltip } from "@angular/material/tooltip";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatSlideToggle } from "@angular/material/slide-toggle";
import { MatIcon } from "@angular/material/icon";
import { MatInput } from "@angular/material/input";
import { tap } from 'lodash';
import { MatOption, MatSelect } from '@angular/material/select';
import { ProveedorListComponent } from '../proveedor-list/proveedor-list.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { MatGridListModule } from '@angular/material/grid-list';
import { DepartamentoRemoteReq } from 'app/modules/departamento/data-access/departamento.remote.req';
import { ProvinciaRemoteReq } from 'app/modules/provincia/data-access/provincia.remote.req';
import { DistritoRemoteReq } from 'app/modules/distrito/data-access/distrito.remote.req';
import { PaisRemoteReq } from 'app/modules/pais/data-access/pais.remote.req';
import { LoadingButtonDirective } from '@shared/directives/loading-button.directive';



@Component({
    standalone: true,
    templateUrl: './proveedor-detail.component.html',
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
        MatExpansionModule,
        MatTabsModule,
        MatGridListModule,
        MatLabel,
        KeyValuePipe,
        LoadingButtonDirective
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProveeodrDetailComponent implements OnInit, OnDestroy {
    public paisesDataArray: any = [];
    public departamentosDataArray: any[] = [];
    public provinciasDataArray: any[] = [];
    public distritosDataArray: any[] = [];

    public editMode: boolean = false;
    public proveedorForm: FormGroup;

    private _tagsPanelOverlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    public proveedorStore = inject(ProveedorStore);

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _proveedorListComponent: ProveedorListComponent,
        private _formBuilder: FormBuilder,
        private _activatedRoute: ActivatedRoute,
        private _departamentoRemoteReq: DepartamentoRemoteReq,
        private _provinciaRemoteReq: ProvinciaRemoteReq,
        private _distritoRemoteReq: DistritoRemoteReq,
        private _paisRemoteReq: PaisRemoteReq,
    ) {
    }

    ngOnInit(): void {
        this._proveedorListComponent.matDrawer.open();

        this.proveedorForm = this._formBuilder.group({
            proveedor_id: [''],
            tipodocumento_id: [null, [Validators.required]],
            proveedor_numero: [null, []],
            proveedor_nombre: [null, [Validators.required]],
            proveedor_diascredito: [null, []],
            proveedor_nombrecomercial: [null, []],
            proveedor_activo: [true, []],
            direcciones: this._formBuilder.array([]),
            proveedor_codigointerno: [null, []],
            proveedor_telefono: [null, []],
            proveedor_correo: [null, []],
            cliente_telefonoprincipal: [null, []],
            cliente_codigointerno: [null, []],
        });

        of(this.proveedorStore.vm().proveedorSelected)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((proveedorSelected: any) => {
                this._proveedorListComponent.matDrawer.open();
                if (proveedorSelected?.proveedor_id > 0) {
                    this.toggleEditMode(false);
                } else {
                    this.toggleEditMode(true);
                }

                if (proveedorSelected && proveedorSelected.direcciones && proveedorSelected.direcciones.length > 0) {
                    proveedorSelected.direcciones.forEach((direccion: any, index: number) => {
                        this.setearDireccion(direccion, index);
                    });
                } else {
                    const index = 0;
                    this.addDireccion();
                }


                this.proveedorForm.patchValue(proveedorSelected);
                this._changeDetectorRef.markForCheck();
            });

        this._activatedRoute.params
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((params) => {
                if (params.id) {
                    this.proveedorStore.searchProveedorById(params.id);
                    const zonaData = this.proveedorStore.proveedorSelected;
                    this.proveedorForm.patchValue(zonaData);
                }
            });

    }

    public async setearDireccion(direccion: any, index: number) {
        const responsePaises = await lastValueFrom(this._paisRemoteReq.obtenerPaisesActivos());

        if (responsePaises.data) {
            this.paisesDataArray[index] = responsePaises.data;
        }

        const direccionGroup = this._formBuilder.group({
            direccion_id: [direccion.direccion_id || ''],
            departamento_id: [direccion.departamento_id || '', [Validators.required]],
            provincia_id: [direccion.provincia_id || '', [Validators.required]],
            distrito_id: [direccion.distrito_id || '', [Validators.required]],
            direccion_nombre: [direccion.direccion_nombre || '', []],
            direccion_telefono: [direccion.direccion_telefono || '', []],
            direccion_correo: [direccion.direccion_correo || ''],
            pais_id: [direccion.pais_id || '', [Validators.required]]
        });

        // this.form.push(direccionGroup
        const direcciones = this.proveedorForm.get('direcciones') as FormArray;
        direcciones.push(direccionGroup);


        this.onPaisChange(index);
        this.onDepartamentoChange(index);
        this.onProvinciaChange(index);
        this.onDistritoChange(index);

    }

    public onDepartamentoChange(index: any): void {
        const departamentoId = this.direcciones.controls[index].get('departamento_id').value;

        if (departamentoId) {
            const payload = {
                departamentoId: departamentoId
            }

            this._provinciaRemoteReq.requestSearchProvinciaByCriteria(payload)
                .subscribe((response) => {
                    if(response && response.data){
                        this.provinciasDataArray[index] = response.data;
                    }

                });
        }
    }

    public onProvinciaChange(index: any): void {
        const provinciaId = this.direcciones.controls[index].get('provincia_id').value;

        if (provinciaId) {
            const payload = {
                provinciaId: provinciaId
            }

            this._distritoRemoteReq.requestSearchDistritoByCriteria(payload)
                .subscribe((response) => {
                    if(response && response.data) {
                        this.distritosDataArray[index] = response.data;
                    }
                });
        }
    }

    public onDistritoChange(index: any): void {
        const distritoId = this.direcciones.controls[index].get('distrito_id').value;

        if (distritoId) {
            const payload = {
                distritoId: distritoId
            }

            this._distritoRemoteReq.requestSearchDistritoByCriteria(payload)
                .subscribe((response) => {
                    if(response && response.data) {
                        this.distritosDataArray[index] = response.data;
                    }
                });
        }
    
    }


    public async addDireccion() {
        const direccionGroup = this._formBuilder.group({
            departamento_id: ['', [Validators.required]],
            provincia_id: ['', [Validators.required]],
            distrito_id: ['', [Validators.required]],
            direccion_nombre: ['', []],
            direccion_telefono: ['', []],
            direccion_correo: [''],
            pais_id: ['', [Validators.required]],
        });

        // this.form.push(direccionGroup
        const direcciones = this.proveedorForm.get('direcciones') as FormArray;
        direcciones.push(direccionGroup);

        const responsePaises = await lastValueFrom(this._paisRemoteReq.obtenerPaisesActivos());
        this.paisesDataArray[direcciones.controls.length - 1] = responsePaises.data;

    }

    public removeDireccion(index: number): void {
        const direcciones = this.proveedorForm.get('direcciones') as FormArray;
        direcciones.removeAt(index);
    }

    get direcciones(): FormArray {
        return this.proveedorForm.get('direcciones') as FormArray;
    }

    closeDrawer(): Promise<MatDrawerToggleResult> {
        return this._proveedorListComponent.matDrawer.close();
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
        if (this.proveedorForm.invalid) {
            return;
        }
        const proveedor = this.proveedorForm.getRawValue();
        if (proveedor.proveedor_id) {
            this.proveedorStore.loadUpdateProveedor(proveedor);
        } else {
            this.proveedorStore.loadCreateProveedor(proveedor);
        }
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(true);
        this._unsubscribeAll.complete();

        if (this._tagsPanelOverlayRef) {
            this._tagsPanelOverlayRef.dispose();
        }
    }
    public onPaisChange(index: any): void {
        const paisId = this.direcciones.controls[index].get('pais_id').value;

        if (paisId) {
            const payload = {
                paisId: paisId
            }

            this._departamentoRemoteReq.requestSearchDepartamentoByCriteria(payload)
                .subscribe((response: any) => {
                    if(response && response.data){
                        this.departamentosDataArray[index] = response.data;
                    }

                });
        }
    }


    public getPaisesData(index: any): any[] {
        const paisesData = this.paisesDataArray[index];
        return Array.isArray(paisesData) ? paisesData : [];
    }
    
    public getDepartamentosData(index: any): any[] {
        const departamentosData = this.departamentosDataArray[index];
        return Array.isArray(departamentosData) ? departamentosData : [];
    }
    
    public getProvinciasData(index: any): any[] {
        const provinciasData = this.provinciasDataArray[index];
        return Array.isArray(provinciasData) ? provinciasData : [];
    }
    
    public getDistritosData(index: any): any[] {
        const distritosData = this.distritosDataArray[index];
        return Array.isArray(distritosData) ? distritosData : [];
    }

}

