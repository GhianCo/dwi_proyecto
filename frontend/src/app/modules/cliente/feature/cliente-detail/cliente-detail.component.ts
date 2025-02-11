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
import { lastValueFrom, map, Observable, of, startWith, Subject, takeUntil, withLatestFrom } from 'rxjs';
import { MatButton, MatIconButton } from "@angular/material/button";
import { AsyncPipe, KeyValuePipe, NgFor, NgIf } from "@angular/common";
import { MatTooltip } from "@angular/material/tooltip";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatSlideToggle } from "@angular/material/slide-toggle";
import { MatIcon } from "@angular/material/icon";
import { MatInput } from "@angular/material/input";
import { tap } from 'lodash';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { MatGridListModule } from '@angular/material/grid-list';
import { DepartamentoRemoteReq } from 'app/modules/departamento/data-access/departamento.remote.req';
import { ProvinciaRemoteReq } from 'app/modules/provincia/data-access/provincia.remote.req';
import { DistritoRemoteReq } from 'app/modules/distrito/data-access/distrito.remote.req';
import { PaisRemoteReq } from 'app/modules/pais/data-access/pais.remote.req';
import { ClienteListComponent } from '../cliente-list/cliente-list.component';
import { ClienteStore } from '../../data-access/cliente.store';
import { LoadingButtonDirective } from '@shared/directives/loading-button.directive';
import { UsuarioRemoteReq } from 'app/modules/usuario/data-access/usuario.remote.req';
import { CARGO_VENDEDOR } from '@shared/constants/app.const';
import { MatAutocompleteModule } from '@angular/material/autocomplete';



@Component({
    standalone: true,
    templateUrl: './cliente-detail.component.html',
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
        LoadingButtonDirective,
        MatAutocompleteModule,
        AsyncPipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ClienteDetailComponent implements OnInit, OnDestroy {
    public paisesDataArray: any = [];
    public departamentosDataArray: any[] = [];
    public provinciasDataArray: any[] = [];
    public distritosDataArray: any[] = [];

    public editMode: boolean = false;
    public clienteForm: FormGroup;

    private _tagsPanelOverlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    public diasCreditoCliente: string[] = ["10", "30", "60"];

    public clienteStore = inject(ClienteStore);
    
    public vendedores: [];
    public oldVendedores: any[] = [];
    public filteredOptionsVendedores: Observable<any[]>;


    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _clienteListComponent: ClienteListComponent,
        private _formBuilder: FormBuilder,
        private _activatedRoute: ActivatedRoute,
        private _departamentoRemoteReq: DepartamentoRemoteReq,
        private _provinciaRemoteReq: ProvinciaRemoteReq,
        private _distritoRemoteReq: DistritoRemoteReq,
        private _paisRemoteReq: PaisRemoteReq,
        private usuarioRemoteReq: UsuarioRemoteReq,
    ) {
    }

    async ngOnInit() {
        this._clienteListComponent.matDrawer.open();

        this.clienteForm = this._formBuilder.group({
            cliente_id: [''],
            tipodocumento_id: [null, [Validators.required]],
            cliente_nombres: [null, [Validators.required]],
            cliente_apellidos: [null, [Validators.required]],
            cliente_documento: [null, [Validators.required]],
            cliente_nombrecomercial: [null, []],
            cliente_diascredito: [null, []],
            cliente_activo: [true, []],
            cliente_contactonombres: [null, []],
            cliente_contacotelefono: [null, []],
            cliente_contactoweb: [null, []],
            cliente_contactoobservaciones: [null, []],
            direcciones: this._formBuilder.array([]),
            zona_id: [null, []],
            cliente_correo: [null, []],
            vendedor_id: [null, []],
            cliente_lineacredito: [null, []],
            cliente_telefonoprincipal: [null, []],
            cliente_codigointerno: [null, []],
            usuario_id: [null, []],

            busquedaVendedor: ["", []],
            aplicarGanacia: [false, []],

        });

        await this.cargarVendedores();

        of(this.clienteStore.vm().clienteSelected)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((clienteSelected: any) => {
                this._clienteListComponent.matDrawer.open();
                if (clienteSelected?.cliente_id > 0) {
                    this.toggleEditMode(false);
                } else {
                    this.toggleEditMode(true);
                }

                if (clienteSelected && clienteSelected.direcciones && clienteSelected.direcciones.length > 0) {
                    clienteSelected.direcciones.forEach((direccion: any, index: number) => {
                        this.setearDireccion(direccion, index);
                    });
                } else {
                    this.addDireccion();
                }

                this.clienteForm.patchValue(clienteSelected);
                this._changeDetectorRef.markForCheck();
            });

        this._activatedRoute.params
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((params) => {
                if (params.id) {
                    this.clienteStore.searchClienteById(params.id);
                    const clienteData = this.clienteStore.clientetSelected;
                    this.clienteForm.patchValue(clienteData);
                }
            });

            this.filteredOptionsVendedores = this.clienteForm.get('busquedaVendedor').valueChanges.pipe(
                startWith(''),
                map(value => {
                  const name = typeof value === 'string' ? value : null;
                  return name ? this.filterVendedores(name as string) : this.vendedores.slice();
                }),
              );
            this.seleccionarVendedorUsario();

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
            direccioncliente_direccion: [direccion.direccioncliente_direccion || '', []],
            direccioncliente_telefono: [direccion.direccioncliente_telefono || '', []],
            direccioncliente_correo: [direccion.direccioncliente_correo || ''],
            pais_id: [direccion.pais_id || '', [Validators.required]],
            vendedor_id: [direccion.vendedor_id || '', []],
            zona_id: [direccion.zona_id || '', []],
        });

        // this.form.push(direccionGroup
        const direcciones = this.clienteForm.get('direcciones') as FormArray;
        direcciones.push(direccionGroup);

        
        this.onPaisChange(index);
        this.onDepartamentoChange(index);
        this.onProvinciaChange(index);
        this.onDistritoChange(index);

    }


    closeDrawer(): Promise<MatDrawerToggleResult> {
        return this._clienteListComponent.matDrawer.close();
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
        if (this.clienteForm.invalid) {
            return;
        }
        const cliente = this.clienteForm.getRawValue();
        if (cliente.cliente_id) {
            this.clienteStore.loadUpdateCliente(cliente);
        } else {
            this.clienteStore.loadCreateCliente(cliente);
        }
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(true);
        this._unsubscribeAll.complete();

        if (this._tagsPanelOverlayRef) {
            this._tagsPanelOverlayRef.dispose();
        }
    }

    get direcciones(): FormArray {
        const direcciones = this.clienteForm.get('direcciones') as FormArray
        return direcciones;
    }
    public onPaisChange(index: any): void {
        const paisId = this.direcciones.controls[index].get('pais_id').value;

        if (paisId) {
            const payload = {
                paisId: paisId
            }

            this._departamentoRemoteReq.requestSearchDepartamentoByCriteria(payload)
                .subscribe((response: any) => {
                    if (response && response.data) {
                        this.departamentosDataArray[index] = response.data;
                    }

                });
        }
    }

    public onDepartamentoChange(index: any): void {
        const departamentoId = this.direcciones.controls[index].get('departamento_id').value;

        if (departamentoId) {
            const payload = {
                departamentoId: departamentoId
            }

            this._provinciaRemoteReq.requestSearchProvinciaByCriteria(payload)
                .subscribe((response) => {
                    if (response && response.data) {
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
                    if (response && response.data) {
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
                    if (response && response.data) {
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
            direccioncliente_direccion: ['', []],
            direccioncliente_telefono: ['', []],
            pais_id: [null, [Validators.required]],
        });

        
        const direcciones = this.clienteForm.get('direcciones') as FormArray;
        
        const responsePaises = await lastValueFrom(this._paisRemoteReq.obtenerPaisesActivos());
        
        if(responsePaises.data.length > 0){
            direccionGroup.get('pais_id').setValue(responsePaises.data[0].pais_id);
        }

        direcciones.push(direccionGroup);        
        this.onPaisChange(direcciones.controls.length - 1);

        this.paisesDataArray[direcciones.controls.length - 1] = responsePaises.data;

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

    public removeDireccion(index: number): void {
        const direcciones = this.clienteForm.get('direcciones') as FormArray;
        direcciones.removeAt(index);
    }

    public async cargarVendedores() {
        try {
            const payload = {
                usuarioCargo: CARGO_VENDEDOR
            }
            const response = await lastValueFrom(this.usuarioRemoteReq.requestSearchUsuarioByCriteria(payload));
            
            if(response.data) {
                this.vendedores = response.data;
                this.oldVendedores = response.data;
            }
            
        } catch (error) {
            
        }

    }

    filterVendedores(name: string): any[] {
        const filterValue = name.toLowerCase();
        return this.vendedores.filter((vendedor: any) =>
          (`${vendedor.usuario_nombres} ${vendedor.usuario_apellidos}`).toLowerCase().includes(filterValue)
        );
    }

    displayFn(vendedor: any): string {
        return vendedor ? `${vendedor.usuario_nombres} ${vendedor.usuario_apellidos}` : '';
    }

    public selectVendedor(vendedor: any) {
        if(vendedor) {
            this.clienteForm.get('usuario_id')!.setValue(vendedor.usuario_id);
        }

    }

    public onSearchVendedor(value: string) {
        this.clienteForm.get('busquedaVendedor')!.setValue(value);
    }

    public seleccionarVendedorUsario() {
        of(this.clienteStore.vm().clienteSelected)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((clienteSelected: any) => {
                if(clienteSelected.usuario_id) {
                    const vendedor = this.vendedores.find((vendedor: any) => vendedor.usuario_id === clienteSelected.usuario_id);
                    this.clienteForm.get('busquedaVendedor')!.setValue(vendedor);
                }
            });
    }

}

