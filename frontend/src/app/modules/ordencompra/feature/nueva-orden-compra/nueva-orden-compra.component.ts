import { Component, effect, inject, OnInit, ViewChild } from '@angular/core';
import { OrdencompraStore } from '../../data-access/ordencompra.store';
import { AsyncPipe, JsonPipe, KeyValuePipe, NgFor, NgForOf, NgIf } from '@angular/common';
import { debounceTime, distinctUntilChanged, lastValueFrom, map, Observable, of, Subject, switchMap, tap } from 'rxjs';
import { FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckbox } from '@angular/material/checkbox';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatOption } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIcon } from '@angular/material/icon';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterOutlet, RouterLink, ActivatedRoute, Router } from '@angular/router';
import { LoadingDirective } from '@shared/directives/loading.directive';
import { OnlyNumbersDirective } from '@shared/directives/only-numbers.directive';
import { OnlyPositiveIntegerDirective } from '@shared/directives/only-positive-integer.directive';
import { CurrencyFormatPipe } from '@shared/pipes/currency-formant.pipe';
import { PreoveedorRemoteReq } from 'app/modules/proveedor/data-access/proveedor.remote.req';
import { CommonService } from '@shared/services/common.sevice';
import { AlmacenRemoteReq } from 'app/modules/almacen/data-access/almacen.remote.req';
import { PersistenceService } from '@shared/services/persistence.service';
import { PKEY } from '@shared/constants/persistence.const';
import { SecurityService } from '@shared/services/security.service';
import { ToastrService } from 'ngx-toastr';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatMenuModule } from '@angular/material/menu';
import { OrdencompraRemoteReq } from '../../data-access/ordencompra.remote.req';
import { PARAM } from '@shared/constants/app.const';
import { is } from 'date-fns/locale';
import { TextFieldModule } from '@angular/cdk/text-field';
import { OnlyPositiveDecimalDirective } from '@shared/directives/only-positive-decimal.directive';

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
  selector: 'app-nueva-orden-compra',
  standalone: true,
  imports: [
    MatButton,
    NgIf,
    MatIconButton,
    RouterLink,
    ReactiveFormsModule,
    MatFormField,
    MatIcon,
    MatInput,
    MatOption,
    NgFor,
    MatExpansionModule,
    MatTabsModule,
    MatGridListModule,
    MatLabel,
    MatDividerModule,
    MatButtonToggleModule,
    MatInputModule,
    AsyncPipe,
    MatAutocompleteModule,
    MatCheckbox,
    CurrencyFormatPipe,
    OnlyPositiveIntegerDirective,
    MatDatepickerModule,
    OnlyNumbersDirective,
    LoadingDirective,
    MatMenuModule,
    TextFieldModule,
    MatFormFieldModule,
    OnlyPositiveDecimalDirective
  ],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
  templateUrl: './nueva-orden-compra.component.html',
  styleUrl: './nueva-orden-compra.component.scss'
})
export class NuevaOrdenCompraComponent implements OnInit {
  @ViewChild(FormGroupDirective) 
  public formDirective: FormGroupDirective;

  public proveedoresList: Observable<any[]> = new Observable()
  public ordencompraStore = inject(OrdencompraStore);
  public searchTextProveedor$ = new Subject();
  public searchTextProducto$ = new Subject();
  public proveedorSeleccionado = null;
  public controlProveedor = new FormControl();
  public controlProducto = new FormControl();
  public productosList: Observable<any[]> = new Observable()
  public almacenSeleccionado = null;
  public form: FormGroup;
  public simboloMoneda = this.securityService.getSimboloMoneda();
  public cargandoOrdencompra = false;
  public canjearOrdencompra = false;
  public ordencompraId = null;

  constructor(
    private proveedorRemoteReq: PreoveedorRemoteReq,
    private commonService: CommonService,
    private almacenRemoteReq: AlmacenRemoteReq,
    private persistenceService: PersistenceService,
    private fb: FormBuilder,
    private securityService: SecurityService,
    private toastrService: ToastrService,
    private activatedRoute: ActivatedRoute,
    private ordencompraRemoteReq: OrdencompraRemoteReq,
    private router: Router
  ) { 

    effect(() => {
      console.log(this.ordencompraStore.state().ordenCompraCreated)
      console.log(this.ordencompraStore.vm())

      if (this.ordencompraStore.state().ordenCompraCreated) {
        this.ordencompraStore.setOrdenCompraCreated(false);
        if(this.ordencompraId) {
          this.obtenerOrdencompraParaEditar(this.ordencompraId);
        }
      }

  }, { allowSignalWrites : true });

  }

  ngOnInit(): void {
    this.ordencompraStore.setOrdencompraParaCanjear(null);


    this.form = this.fb.group({
      ordencompra_id: [null],
      ordencompra_fechavecimiento: [null],
      proveedor_id: [null, [Validators.required]],
      ordencompra_fecharegistro: [],
      ordencompra_idusuariocrea: [],
      ordencompra_fechamodifica: [],
      ordencompra_idusuariomodifica: [],
      ordencompra_pedientecanjear: [],
      ordencompra_total: [],
      ordencompra_activo: [],
      ordencompra_estado: [],
      ordencompra_observacion: [],
      local_id: [],
      detalleordencompra: this.fb.array([]),
      detalleseliminados: this.fb.array([]),
    })

    this.proveedoresList = this.searchTextProveedor$
      .pipe(
        tap(() => {
          this.proveedorSeleccionado = null;
        }),
        debounceTime(300),
        distinctUntilChanged(),
        tap((value) => console.log(`Search: ${value}`)),
        switchMap((value) => {
          const params = {
            query: value,
            active: true,
            perPage: 10,
            page: 1
          };

          return this.proveedorRemoteReq.requestSearchProveedorByCriteria(params)
            .pipe(
              map((response) => response?.data ?? [])
            );
        })
      );

      this.productosList = this.searchTextProducto$
      .pipe(
        tap(() => {
          // this.controlProducto.setValue(null);
        }),
        debounceTime(300),
        distinctUntilChanged(),
        tap((value) => console.log(`Search: ${value}`)),
        switchMap((value) => {
          const params = {
            busqueda: value,
          };

          return this.commonService.busquedaSensitiva(params)
            .pipe(
              map((response) => response?.data ?? [])
            );
        })
      );

      this.detalleordencompraArray.valueChanges.subscribe((detalleordencompraArray: any[]) => {
          detalleordencompraArray.forEach((detalleordencompra, index) => {
            const ordencompraGroup = this.detalleordencompraArray.at(index);
            const nuevoTotal =  Number(detalleordencompra.item_precio) * Number(detalleordencompra.item_cantidad);
            const currentSubtotalControl = ordencompraGroup.get('item_subtotal');
            const currentTotalControl = ordencompraGroup.get('item_total');

            if (currentSubtotalControl?.value !== nuevoTotal) {
              currentSubtotalControl?.setValue(nuevoTotal, { emitEvent: false });
            }

            if (currentTotalControl?.value !== nuevoTotal) {
              currentTotalControl?.setValue(nuevoTotal, { emitEvent: false });
            }
          })
      });

      this.ordencompraId = this.activatedRoute.snapshot.paramMap.get('id');
      

      if(!this.ordencompraId) {
        this.obtenerAlmacenesByLocal();
      } else {
        this.obtenerOrdencompraParaEditar(this.ordencompraId);
      }

      const canjearOrdenParam: string = this.activatedRoute.snapshot.queryParamMap.get("canjearOrden");
      
      if(canjearOrdenParam == PARAM.SI) {
        this.canjearOrdencompra = true;
      }


  }

  public selectProveedor(proveedor) {
    if(proveedor) {
      this.proveedorSeleccionado = proveedor;
      this.form.get('proveedor_id').setValue(proveedor.proveedor_id);
    }
  }

  public displayFnProveedor(proveedor: any) {
    if (!proveedor) {
      return '';
    }

    if (proveedor && proveedor !== '' && typeof proveedor === 'string') {
      return proveedor;
    }

    // const clienteNombre = proveedor.proveedor_nombre + ' ' + proveedor.cliente_apellidos;
    const proveedorNombre = proveedor.proveedor_nombre;
    return proveedorNombre;

  }

  public onInputProveedor(event: any): void {
    const value = event.target.value;
    this.searchTextProveedor$.next(value);
  }

  public onInputProducto(event) {
    const value = event.target.value;
    this.searchTextProducto$.next(value);
  }

  public selectProducto(value: any) {
    const existeProducto = this.detalleordencompraArray.controls.find((detallecompra) => {
      return detallecompra.get('item_id').value === value.item_id;
    });

    if(existeProducto) {
      this.toastrService.error('Ya existe el producto agregado a la lista.');
      this.controlProducto.setValue(null);
      return;
    }


    let detallecompraObj = this.fb.group({
      detalleordencompra_pendientecanjear: [true],
      item_descripcioncompleta: [value.item_descripcioncompleta],
      item_cantidad: [1],
      item_precio: [value.item_precio],
      item_subtotal: [value.item_precio * 1],
      item_impuestos: [0],
      item_total: [value.item_precio * 1],
      item_id: [value.item_id],
      almacen_id: [this.almacenSeleccionado.almacen_id],
    })

    this.detalleordencompraArray.push(detallecompraObj);

    this.controlProducto.setValue(null);
  }

  public obtenerAlmacenesByLocal() {
    const localLogeado = this.persistenceService.get(PKEY.LOCAL_LOGEADO);

    this.almacenRemoteReq.requestObtenerAlmacenesByLocal(localLogeado.local_id)
      .subscribe({
        next: (response) => {
          if(response.data && Array.isArray(response.data) && response.data.length > 0) {
            this.almacenSeleccionado = response.data[0];
          } else {
            this.toastrService.error('No se encontró almacén asociado al local');
          }
        }
      })
  }

  public get detalleordencompraArray(): FormArray {
    return this.form.get('detalleordencompra') as FormArray;
  }

  public guardarOrdenCompra() {
    if(!this.form.get("ordencompra_id").value) {
      this.registrarOrdencompra();
    } else {
      this.actualizarOrdencompra();
    }
  } 

  public registrarOrdencompra() {
    if(!this.form.get("proveedor_id").value) {
      this.toastrService.error('Seleccione un proveedor');
      return;
    }

    if(this.detalleordencompraArray.length === 0) {
      this.toastrService.error('Agregue al menos un producto');
      return;
    }

    const data = this.form.getRawValue();
    this.ordencompraStore.loadCreateOrdencompra(data);

  }

  public get totalOrdenCompra() {
    let total = 0;
    this.detalleordencompraArray.controls.forEach((detalleordencompra) => {
      total += Number(detalleordencompra.get('item_total').value);
    });

    return total;
  }

  public obtenerOrdencompraParaEditar(ordencompraId: number | string) {    
    this.cargandoOrdencompra = true;
    this.ordencompraRemoteReq.requestGetOrdenCompraById(ordencompraId)
      .subscribe({
        next: async (response) => {
          const data = response.data;
          const detalleordencompra: any[] = data.detalleordencompra ?? [];

          // this.form.get('ordencompra_id').setValue(data.ordencompra_id);
          this.form.patchValue(data);

          if(data.proveedor) {
            this.selectProveedor(data.proveedor);
            this.controlProveedor.setValue(data.proveedor);
          }
          
          if(detalleordencompra && detalleordencompra.length > 0) {
            const primerDetalleOrdencompra = detalleordencompra[0];
            
            const almacenResponse = await lastValueFrom(this.almacenRemoteReq.requestAlmacenById(primerDetalleOrdencompra.almacen_id));
            if(almacenResponse && almacenResponse.data) {
              const almacen = almacenResponse.data;
              this.almacenSeleccionado = almacen;
            }
            
          } else {
            this.obtenerAlmacenesByLocal();
          }
          
          this.detalleordencompraArray.clear();


          detalleordencompra.forEach(detalle => {
            const detallecompraEstaSeleccionado = detalle.detalleordencompra_pendientecanjear === 0 ? true : false;
            let detallecompraObj = this.fb.group({
              detalleordencompra_seleccionado: [{ value: detallecompraEstaSeleccionado, disabled: detalle.detalleordencompra_pendientecanjear === 0 }],
              detalleordencompra_id: [detalle.detalleordencompra_id],
              item_descripcioncompleta: [detalle.detalleordencompra_descripcioncompleta],
              item_cantidad: [{ value: detalle.detalleordencompra_cantidad, disabled: false }],
              item_precio: [detalle.detalleordencompra_precio],
              item_subtotal: [detalle.item_subtotal],
              item_impuestos: [detalle.item_impuestos],
              detalleordencompra_pendientecanjear: [detalle.detalleordencompra_pendientecanjear],
              item_total: [detalle.detalleordencompra_importe],
              item_id: [detalle.presentacionproducto_id],
              almacen_id: [detalle.almacen_id],
            });

            this.detalleordencompraArray.push(detallecompraObj);
          })

          if(this.canjearOrdencompra) {
            this.controlProveedor.disable();
            this.form.get('ordencompra_fechavecimiento').disable();
          }

          this.cargandoOrdencompra = false;

        }
      })
  }

  public angularOrdenCompra() {

  }

  public eliminarDetalleOrdencompra(index: number) {
    const detalleordencompra = this.detalleordencompraArray.at(index);
    this.detallesEliminadosOrdencompra.push(detalleordencompra);
    this.detalleordencompraArray.removeAt(index);
  }

  public get detallesEliminadosOrdencompra(): FormArray {
    return this.form.get("detalleseliminados") as FormArray
  }

  public actualizarOrdencompra() {
    const data = this.form.getRawValue();
    this.ordencompraStore.loadUpdateOrdencompra(data);

  }

  public conjearOrdencompra() {
    const ordencompra = this.form.getRawValue();
    delete ordencompra?.detalleordencompra; 

    const detalleordencompra = this.detalleordencompraArray.value.filter((detalleordencompra) => {
      return detalleordencompra.detalleordencompra_seleccionado;
    });

    if(detalleordencompra.length === 0) {
      this.toastrService.error('Debe seleccionar al menos un item para canjear');
      return;
    }

    let ordecompraParaCanjear = {
      ordencompra,
      detalleordencompra
    }

    console.log("ordecompraParaCanjear");
    console.log(ordecompraParaCanjear);

    this.ordencompraStore.setOrdencompraParaCanjear(ordecompraParaCanjear);
    this.router.navigateByUrl(`/compras/compras/canjeOrdenCompra/${ordencompra.ordencompra_id}`);

  }

}
