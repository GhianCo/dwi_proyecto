import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    effect,
    inject,
    OnDestroy,
    OnInit,
    signal,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OverlayRef } from '@angular/cdk/overlay';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { lastValueFrom, of, Subject, takeUntil, tap } from 'rxjs';
import { ProductoStore } from "../../data-access/producto.store";
import { MatButton, MatIconButton } from "@angular/material/button";
import { JsonPipe, KeyValuePipe, NgFor, NgIf } from "@angular/common";
import { MatTooltip } from "@angular/material/tooltip";
import { ActivatedRoute, Router, RouterLink, RouterModule } from "@angular/router";
import { MatFormField, MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatSlideToggle } from "@angular/material/slide-toggle";
import { MatIcon } from "@angular/material/icon";
import { MatInput, MatInputModule } from "@angular/material/input";
import { ProductoPageListComponent } from '../producto-list/producto-list.component';
import { MatOption, provideNativeDateAdapter } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelect } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CategoriaRemoteReq } from 'app/modules/categoria/data-access/categoria.remote.req';
import { LaboratorioRemoteReq } from 'app/modules/laboratorio/data-access/laboratorio.remote.req';
import { UbicacionRemoteReq } from 'app/modules/ubicacion/data-access/ubicacion.remote.req';
import { MonedaRemoteReq } from 'app/modules/moneda/data-access/moneda.remote.req';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AlmacenRemoteReq } from 'app/modules/almacen/data-access/almacen.remote.req';
import { UnidadmedidaRemoteReq } from 'app/modules/unidadmedida/data-access/unidadmedida.remote.req';
import { DateService } from '@shared/services/date.service';
import { CommonService } from '@shared/services/common.sevice';
import { UtilityService } from '@shared/services/utility.service';
import { LoadingButtonDirective } from '@shared/directives/loading-button.directive';
import { DynamicTableService } from '@shared/services/dynamic-table.service';
import { LoadingDirective } from '@shared/directives/loading.directive';


@Component({
    standalone: true,
    templateUrl: './producto-detail.component.html',
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
        MatGridListModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatInputModule,
        RouterModule,
        LoadingButtonDirective,
        LoadingDirective,
        JsonPipe
    ],
    providers: [provideNativeDateAdapter()],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProductoDetailComponent implements OnInit, OnDestroy {
    
    // tipalo es un input type file
    @ViewChild("file")
    public file: any;

    public editMode: boolean = true;
    public form: FormGroup;

    private _tagsPanelOverlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();


    public productoStore = inject(ProductoStore);
    public categorias = [];
    public laboratorios = [];
    public ubicaciones = [];
    public monedas = [];
    public almacenesList = signal([]);
    public unidadesMedida = [];
    public columns = [];
    public cargandoData: boolean = false;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _productoListComponent: ProductoPageListComponent,
        private _formBuilder: FormBuilder,
        private _activatedRoute: ActivatedRoute,
        private _categoriaRemoteReq: CategoriaRemoteReq,
        private _laboratorioRemoteReq: LaboratorioRemoteReq,
        private _ubicacionRemoteReq: UbicacionRemoteReq,
        private _monedaRemoteReq: MonedaRemoteReq,
        private _almacenRemoteReq: AlmacenRemoteReq,
        private _unidadmedidaRemoteReq: UnidadmedidaRemoteReq,
        private _router: Router,
        private commonService: CommonService,
        private dynamicTableService: DynamicTableService,
    ) {
        
        this.form = this._formBuilder.group({
            producto_id: [''],
            producto_codigo: ["", []],
            producto_descripcion: ["", []],
            producto_nombre: ["", [Validators.required]],
            almacen_id: [null, []],
            producto_concentracion: ["", []],
            // producto_registrosanitario: ["", []],
            moneda_id: [null, [Validators.required]],
            producto_incluyeivg: [true, []],
            producto_manejalite: ["", []],
            producto_stockinicial: [null, []],
            producto_stockminimo: [null, []],
            producto_codigomedicameneto: ["", []],
            producto_principioactivo: ["", []],
            laboratorio_id: [null, [Validators.required]],
            ubicacion_id: [null, []],
            producto_activo: ["", []],
            producto_imagen: [null, []],
            producto_imagenidentificador: [null, []],
            producto_sujetodetraccion: [false, []],
            presentaciones: this._formBuilder.array([]),
            almacenes: this._formBuilder.array([])
        });
        

        effect(async () => {
            const productoSelected = this.productoStore.state().productoSelected;
            if(productoSelected && productoSelected.producto_id > 0) {
                this.toggleEditMode(false);
                this.form.patchValue(productoSelected);
                this.setearPresentaciones(productoSelected.presentaciones);

                const almacenesArray = this.almacenesFormArray;

                almacenesArray.clear();

                this.almacenesList().forEach((almacen) => {
                    const productoSelected = this.productoStore.state().productoSelected;

                    const isChecked = productoSelected?.almacenproductoList?.some((almacenDB) => almacenDB.almacen_id === almacen.almacen_id) ?? false;
                    almacenesArray.push(this._formBuilder.control(isChecked));
                });


            } else {
                /** Agrega un presentacion vacia */
                if(this.presentaciones.length === 0) {
                    this.addPresentacion();
                }
                this.almacenesList().forEach(() => {
                    this.almacenesFormArray.push(this._formBuilder.control(false));
                });

            }
        
        })


        
        

    }


    ngOnInit() {
        this.cargarDataNecesaria();

        // const productoId = this._activatedRoute.snapshot.paramMap.get('id');
        // const presentacionId = this._activatedRoute.snapshot.paramMap.get('presentacionId');
        
        // if(Number(productoId) > 0) {
        //     this.productoStore.updatePresetacionIdSelected(presentacionId);
        //     this.productoStore.searchProductoById(productoId);
        // }

        // this.cargarAlmacenes();
        // this.cargarMonedas();
        // this.cargarCategorias();
        // this.cargarLaboratorios();
        // this.cargarUbicaciones();
        // this.cargarUnidadesdeMedida();


        this._productoListComponent.matDrawer.open();       

        

    }

    get presentaciones(): FormArray {
        const direcciones = this.form.get('presentaciones') as FormArray
        return direcciones;
    }

    public get almacenesFormArray(): FormArray {
        return this.form.get('almacenes') as FormArray;
    }


    public setearPresentaciones(presentacionesArray: any[]) {
        this.presentaciones.clear();
        presentacionesArray.forEach((presentacion) => {
            const presentacionGroup = this._formBuilder.group({
                presentacionproducto_id: [presentacion?.presentacionproducto_id, []],
                presentacionproducto_descripcion: [presentacion?.presentacionproducto_descripcion, [Validators.required]],
                presentacionproducto_precio: [presentacion?.presentacionproducto_precio, [Validators.required]],
                presentacionproducto_codigobarra: [presentacion?.presentacionproducto_codigobarra, []],
                producto_id: [presentacion?.producto_id, [Validators.required]],
                unidadmedida_id: [presentacion?.unidadmedida_id, [Validators.required]],
                presentacionproducto_costounitario: [presentacion?.presentacionproducto_costounitario, []],
                presentacionproducto_porcentajeganacia: [{ value: presentacion?.presentacionproducto_porcentajeganacia, disabled: true }, []],
                presentacionproducto_registrosanitario: [presentacion?.presentacionproducto_registrosanitario, []],
                presentacionproducto_digemid: [presentacion?.presentacionproducto_digemid, []],
                presentacionproducto_codigo: [{ value: presentacion.presentacionproducto_codigo, disabled: true }, []],
                aplicarganacia: [false, []],
            });

            this.presentaciones.push(presentacionGroup);
        });
    }

    public addPresentacion() {
        const presentacionGroup = this._formBuilder.group({
            presentacionproducto_descripcion: ["", [Validators.required]],
            presentacionproducto_precio: [null, [Validators.required]],
            presentacionproducto_codigobarra: [null, []],
            unidadmedida_id: [null, [Validators.required]],
            presentacionproducto_costounitario: [null, []],
            presentacionproducto_registrosanitario: [null, []],
            presentacionproducto_porcentajeganacia: [{ value: 0, disabled: true }, []],
            presentacionproducto_digemid: [null, []],
            aplicarganacia: [false, []],
        });

        this.presentaciones.push(presentacionGroup);
    }


    closeDrawer(): Promise<MatDrawerToggleResult> {
        return this._productoListComponent.matDrawer.close();
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

        const producto = this.form.getRawValue();
        producto.almacenes = this.obtenerAlmacenesSeleccionados();

        if (producto.producto_id) {
            this.productoStore.loadUpdateProducto(producto);
        } else {
            this.productoStore.loadCreateProducto(producto);
        }
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(true);
        this._unsubscribeAll.complete();

        if (this._tagsPanelOverlayRef) {
            this._tagsPanelOverlayRef.dispose();
        }
    }

    public async cargarCategorias() {
        const payload = {
            active: true
        }

        const response = await lastValueFrom(this._categoriaRemoteReq.requestSearchCategoriaByCriteria(payload));
        this.categorias = response.data;    
    }

    public async cargarLaboratorios() {
        const payload = {
            active: true
        }

        // this._laboratorioRemoteReq.requestSearchLaboratorioByCriteria(payload)
        //     .subscribe({
        //         next: (response) => {
        //             this.laboratorios = response.data;
        //         }
        //     });

        const response = await lastValueFrom(this._laboratorioRemoteReq.requestSearchLaboratorioByCriteria(payload));
        this.laboratorios = response.data;

    }

    public async cargarUbicaciones() {
        const payload = {
            active: true
        }

        // this._ubicacionRemoteReq.requestSearchUbicacionByCriteria(payload)
        //     .subscribe({
        //         next: (response) => {
        //             this.ubicaciones = response.data;
        //         }
        //     });

        const response = await lastValueFrom(this._ubicacionRemoteReq.requestSearchUbicacionByCriteria(payload));
        this.ubicaciones = response.data;

    }

    public async cargarMonedas() {
        const payload = {
            active: true
        }

        // this._monedaRemoteReq.requestSearchMonedaByCriteria(payload)
        //     .subscribe({
        //         next: (response) => {
        //             this.monedas = response.data;
        //         }
        //     });

        const response = await lastValueFrom(this._monedaRemoteReq.requestSearchMonedaByCriteria(payload));
        this.monedas = response.data

    }
   public async cargarUnidadesdeMedida() {
        const payload = {
            active: true
        }

        // this._unidadmedidaRemoteReq.requestSearchUnidadmedidaByCriteria(payload)
        //     .subscribe({
        //         next: (response) => {
        //             this.unidadesMedida = response.data;
        //         }
        //     });

        const response = await lastValueFrom(this._unidadmedidaRemoteReq.requestSearchUnidadmedidaByCriteria(payload));
        this.unidadesMedida = response.data;
   }

   public obtenerAlmacenesSeleccionados() {
        const almacenesArray = this.form.get('almacenes') as FormArray;
        const almacenesSeleccionados = this.almacenesList().filter((almacen, index) => almacenesArray.at(index).value);
        return almacenesSeleccionados;

   }

   public subirImagen() {
        this.file.nativeElement.click();
   }

   public onFileSelected(event: any) {
    const file: File = event.target.files[0]; // Recupera el archivo seleccionado

    if (file) {
        this.commonService.upload({ file, folder: 'productos' })
            .subscribe({
                next: (response) => {
                    if(response.data) {
                        this.form.get('producto_imagen').setValue(response.data.filePath);
                        this._changeDetectorRef.markForCheck();
                    }
                }
            })
        
    }
  }

  public get imagenProducto() {
    const productoImagen = this.form.get('producto_imagen').value;

    if(!productoImagen || productoImagen === "") {
        return null;
    }

    const productoImagenURL = UtilityService.parsearUrlImagen(productoImagen);
    return productoImagenURL;
  }

  private async cargarAlmacenes() {
    const payload = {
        active: true
    }
   
    const response = await lastValueFrom(this._almacenRemoteReq.requestSearchAlmacenByCriteria(payload));
    this.almacenesList.set(response.data ?? []);

  }

  private async cargarDataNecesaria() {
    this.cargandoData = true;
    const promises = [
        this.cargarAlmacenes(),
        this.cargarCategorias(),
        this.cargarLaboratorios(),
        this.cargarUbicaciones(),
        this.cargarMonedas(),
        this.cargarUnidadesdeMedida(),
    ]

    await Promise.all(promises);

    this.cargandoData = false;

    this._changeDetectorRef.detectChanges();

  }


  public calcularGanancia(index) {
    const presentacion = this.presentaciones.at(index);
    const costoUnitario = presentacion.get('presentacionproducto_costounitario').value;
    const porcentajeGanancia = presentacion.get('presentacionproducto_porcentajeganacia').value;

    // if(presentacion.get('aplicarganacia').value) {
        // al costo unitario sacarle el porcentaje de ganancia
        const cantidadDeganacia = costoUnitario * (porcentajeGanancia / 100);
        const nuevoPrecio = Number(costoUnitario) + Number(cantidadDeganacia);  
        presentacion.get('presentacionproducto_precio').setValue(nuevoPrecio);

    // }
  }

  public onChangeAplicarGanancia(index) {
    const presentacion = this.presentaciones.at(index);
    const aplicarGanancia = presentacion.get('aplicarganacia').value;

    if(aplicarGanancia) {
        presentacion.get('presentacionproducto_porcentajeganacia').enable();
    } else {
        presentacion.get('presentacionproducto_porcentajeganacia').disable();
    }
  }
}
