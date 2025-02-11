import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SecurityService } from '@shared/services/security.service';
import { CompraStore } from '../../data-access/compra.store';
import { NgIf, NgFor, KeyValuePipe, AsyncPipe, JsonPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckbox } from '@angular/material/checkbox';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatOption } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIcon } from '@angular/material/icon';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelect } from '@angular/material/select';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterOutlet, RouterLink, ActivatedRoute, Router } from '@angular/router';
import { LoadingDirective } from '@shared/directives/loading.directive';
import { OnlyNumbersDirective } from '@shared/directives/only-numbers.directive';
import { OnlyPositiveIntegerDirective } from '@shared/directives/only-positive-integer.directive';
import { CurrencyFormatPipe } from '@shared/pipes/currency-formant.pipe';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { OrdencompraStore } from 'app/modules/ordencompra/data-access/ordencompra.store';
import { ComprobanteRemoteReq } from 'app/modules/comprobante/data-access/comprobante.remote.req';
import { COMPROBANTES, HTTP_RESPONSE } from '@shared/constants/app.const';
import { debounceTime, distinctUntilChanged, lastValueFrom, map, Observable, Subject, switchMap, tap } from 'rxjs';
import { PreoveedorRemoteReq } from 'app/modules/proveedor/data-access/proveedor.remote.req';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '@shared/services/common.sevice';
import { AlmacenRemoteReq } from 'app/modules/almacen/data-access/almacen.remote.req';
import { PersistenceService } from '@shared/services/persistence.service';
import { PKEY } from '@shared/constants/persistence.const';
import { MatDialog } from '@angular/material/dialog';
import { ModalAsignarLoteCompraComponent } from '../modals/modal-asignar-lote-compra/modal-asignar-lote-compra.component';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { ModalCantidadLoteComponent } from '../modals/modal-cantidad-lote/modal-cantidad-lote.component';
import { ModalNuevoLoteComponent } from '../modals/modal-nuevo-lote/modal-nuevo-lote.component';
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
  selector: 'app-nueva-compra',
  standalone: true,
  imports: [
    RouterOutlet,
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
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
    JsonPipe,
    OnlyPositiveDecimalDirective
  ],
  templateUrl: './nueva-compra.component.html',
  styleUrl: './nueva-compra.component.scss',
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class NuevaCompraComponent implements OnInit {

  public simboloMoneda = this.securityService.getSimboloMoneda();
  public compraStore = inject(CompraStore);
  public ordenComprastore = inject(OrdencompraStore);
  public cargandoCompra = false;
  public form: FormGroup;
  public comprobantesList = [];
  public cargandoComprobantes = false;
  public proveedoresList$: Observable<any[]> = new Observable();
  public productosList$: Observable<any[]> = new Observable();
  public searchTextProveedor$ = new Subject();
  public searchTextProducto$ = new Subject();
  public proveedorSeleccionado = null;
  public controlProducto = new FormControl();
  public controlProveedor = new FormControl();
  public almacenSeleccionado = null;
  public cargandoAlmacenes = false;
  public ordencompraStore = inject(OrdencompraStore);
  public ordencompraId = null;
  public vista: number = 1;
  public lotes = [];
  public productosACanjear = [];



  constructor(
    private securityService: SecurityService,
    private fb: FormBuilder,
    private comprobanteRemoteReq: ComprobanteRemoteReq,
    private proveedorRemoteReq: PreoveedorRemoteReq,
    private toastrService: ToastrService,
    private commonService: CommonService,
    private almacenRemoteReq: AlmacenRemoteReq,
    private persistenceService: PersistenceService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    this.cargarAlmacenes();

    this.form = this.fb.group({
      compra_id: [null, []],
      compra_fecha: [null, []],
      compra_idusuariocrea: [null, []],
      compra_fecharegistro: [null, []],
      compra_idusuariomodifica: [null, []],
      proveedor_id: [null, []],
      compra_fechamodifica: [null, []],
      comprobante_id: [null, []],
      compra_serie: [null, []],
      compra_correlativo: [null, []],
      compra_total: [null, []],
      compra_subtotal: [null, []],
      compra_igv: [null, []],
      local_id: [null, []],
      compra_observacion: [null, []],
      ordencompra: [null, []],
      detallecompra: this.fb.array([]),
      ordencompra_id: [null, []],
    })

    this.cargarComprobantes();

    this.form.get("comprobante_id").setValue(COMPROBANTES.BOLETA);
    this.form.get("compra_fecha").setValue(new Date());

    this.proveedoresList$ = this.searchTextProveedor$
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

    this.productosList$ = this.searchTextProducto$
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

    this.ordencompraId = this.activatedRoute.snapshot.params.ordenCompraId;
    if (this.ordencompraId) {
      this.parsearCanjearOrdencompra();
    }


    this.form.get('detallecompra').valueChanges.subscribe(detallecompra => {
      let compraTotal = 0;
      let comprasubtotal = 0;
      let compraImpuestos = 0;

      detallecompra.forEach((item, index) => {
        const nuevoTotal = Number(item.detallecompra_cantidad) * Number(item.detallecompra_precio);

        const detalleCompraFormGroup = this.detallecompraArray.at(index) as FormGroup;
        const currentDetallecompraTotal = detalleCompraFormGroup.get('detallecompra_total').value;


        if (currentDetallecompraTotal !== nuevoTotal) {
          detalleCompraFormGroup.get('detallecompra_total').setValue(nuevoTotal);
        }

        compraTotal += nuevoTotal;
        // comprasubtotal += item.detallecompra_subtotal;
        // compraImpuestos += item.detallecompra_impuestos;          

      })

      this.form.get('compra_total').setValue(compraTotal);
      // this.form.get('compra_subtotal').setValue(comprasubtotal);
      // this.form.get('compra').setValue(compraImpuestos);
    })

  }


  public guardarCompra() {
    if (!this.form.get("compra_id").value) {
      this.registrarCompra();
    }
  }

  public registrarCompra() {

    const { error, mensajeErrores  } = this.validarLotes();
    
    if(error) {
      CommonService.mostrarAlerta({
        tipo: "error",
        titulo: "Upss, error",
        mensaje: mensajeErrores
      });

      return;
    }

    const data = this.form.getRawValue();
    data.lotes = this.lotes;
    this.compraStore.loadCreateCompra(data);

  }

  public parsearOrdencompraAVenta() {

  }

  public get detallecompraArray() {
    return this.form.get('detallecompra') as FormArray;
  }

  public cargarComprobantes() {
    this.cargandoComprobantes = true;
    this.comprobanteRemoteReq.requestObtenerComprobantesPorLocalLogeado()
      .subscribe({
        next: (response) => {
          if (response && response.data) {
            this.comprobantesList = response.data;
          }
        },
        complete: () => {
          this.cargandoComprobantes = false;
        }
      })
  }

  public selectProveedor(proveedor) {
    if (proveedor) {
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

  public onInputProveedor(event: any) {
    const value = event.target.value;
    this.searchTextProveedor$.next(value);
  }

  public onInputProducto(event: any) {
    const value = event.target.value;
    this.searchTextProducto$.next(value);
  }

  public selectProducto(value: any) {
    const existeProducto = this.detallecompraArray.controls.find((detallecompra) => {
      return detallecompra.get('presentacionproducto_id').value === value.item_id;
    });

    if (existeProducto) {
      this.toastrService.error('Ya existe el producto agregado a la lista.');
      this.controlProducto.setValue(null);
      return;
    }

    const detallecompraGroup = this.fb.group({
      presentacionproducto_id: [value.item_id, []],
      detallecompra_descripcion: [value.item_descripcioncompleta, []],
      detallecompra_cantidad: [1, []],
      detallecompra_precio: [value.item_precio, []],
      almacen_id: [this.almacenSeleccionado.almacen_id, []],
      detallecompra_subtotal: [Number(value.item_precio), []],
      detallecompra_total: [Number(value.item_precio), []],
      detallecompra_descuento: [0, []],
      detallecompra_impuestos: [0, []],
    })

    this.detallecompraArray.push(detallecompraGroup);
    this.controlProducto.setValue(null);
  }

  public cargarAlmacenes() {
    const localLogeado = this.persistenceService.get(PKEY.LOCAL_LOGEADO);

    this.almacenRemoteReq.requestObtenerAlmacenesByLocal(localLogeado.local_id)
      .subscribe({
        next: (response) => {
          if (response && Array.isArray(response.data) && response.data.length > 0) {
            this.almacenSeleccionado = response.data[0];
          } else {
            this.toastrService.error('No se encontraron almacenes para el local logeado.');
          }
        }
      })
  }

  public get totalVenta() {
    return this.form.get('compra_total').value;
  }

  public async parsearCanjearOrdencompra() {
    const ordencompraSelected = this.ordencompraStore.getOrdencompraParaCanjear;
    if (!ordencompraSelected) {
      // this.toastrService.error('Upss, No se pudo obtener la orden de compra para canjear.');
      // return;
      this.router.navigateByUrl(`/compras/ordenes-de-compra/editar/${this.ordencompraId}?canjearOrden=1`);
    }

    const ordencompra = ordencompraSelected.ordencompra;
    const detalleordencompra = ordencompraSelected.detalleordencompra ?? [];

    this.form.get("ordencompra_id").setValue(ordencompra.ordencompra_id);
    this.form.get("compra_observacion").setValue(ordencompra.ordencompra_observacion);

    /** Recupero el proveedor y lo seteo */
    const responsePoveedor = await lastValueFrom(this.proveedorRemoteReq.requestProveedorById(ordencompra.proveedor_id));
    if (responsePoveedor && responsePoveedor.code === HTTP_RESPONSE.HTTP_200_OK) {
      this.selectProveedor(responsePoveedor.data);
      this.controlProveedor.setValue(responsePoveedor.data);
    }

    detalleordencompra.forEach((detalle) => {
      const detallecompraGroup = this.fb.group({
        detalleordencompra_id: [detalle.detalleordencompra_id, []],
        presentacionproducto_id: [detalle.item_id, []],
        detallecompra_descripcion: [detalle.item_descripcioncompleta, []],
        detallecompra_cantidad: [detalle.item_cantidad, []],
        detallecompra_precio: [Number(detalle.item_precio), []],
        almacen_id: [detalle.almacen_id, []],
        detallecompra_subtotal: [Number(detalle.item_subtotal), []],
        detallecompra_total: [Number(detalle.item_total), []],
        detallecompra_descuento: [0, []],
        detallecompra_impuestos: [0, []],
      })

      this.detallecompraArray.push(detallecompraGroup);
    })

  }

  public asignarLote(compra) {
    this.dialog.open(ModalAsignarLoteCompraComponent, {
      width: '968px',
      data: {
      }
    })
  }

  public continuarAsginarLotes() {
    if (!this.form.get("proveedor_id")) {
      this.toastrService.error('Debe seleccionar un proveedor.');
      return;
    }

    if (!this.form.get("comprobante_id").value) {
      this.toastrService.error('Debe seleccionar un comprobante.');
      return;
    }

    if (!this.form.get("compra_serie").value) {
      this.toastrService.error('Debe ingresar la serie del comprobante.');
      return;
    }

    if (!this.form.get("compra_correlativo").value) {
      this.toastrService.error('Debe ingresar el correlativo del comprobante.');
      return;
    }

    if (!this.detallecompraArray.value.length) {
      this.toastrService.error('Debe agregar al menos un producto a la compra.');
      return;
    }

    this.vista = 2;

    console.log(this.detallecompraArray.value);
    this.productosACanjear = structuredClone(this.detallecompraArray.value);

  }

  public async onDrop(event: CdkDragDrop<string[]>, lote: any) {
    const detallecompra = event.item.data;

    const dialogRef = this.dialog.open(ModalCantidadLoteComponent, {
      width: "400px",
      data: {
        compraCantidad: detallecompra.detallecompra_cantidad 
      }
    })


    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.cantidad) {
        const cantidad = Number(result.cantidad);
        if(cantidad > detallecompra.detallecompra_cantidad) {
          this.toastrService.error('La cantidad a canjear no puede ser mayor a la cantidad en la compra.');
          return;
        }

        const nuevoProducto = {
          ...detallecompra,
          cantidad
        };

        // Modificar el array directamente
        lote.productos.push(nuevoProducto);
        this.changeDetectorRef.markForCheck();

        /** Ahora actualiza el estado del producto */
        const nuevosProductos = this.productosACanjear.map((item: any) => {
          if (item.presentacionproducto_id === detallecompra.presentacionproducto_id) {
            item.detallecompra_cantidad = item.detallecompra_cantidad - cantidad;

            /** Si la cantidad es 0 ya no se debe mostrar */
            if (item.detallecompra_cantidad === 0) {
              item.ocultar = true;
            }

          }
          return item;
        });

        this.productosACanjear = nuevosProductos;

      }
    })

  }

  public nuevoLote() {
    const modalRef = this.dialog.open(ModalNuevoLoteComponent, {
      width: '600px'
    });

    modalRef.afterClosed().subscribe((result) => {
      if (result && result.lote) {
        const lote = result.lote;
        const existeCodigoLote = this.lotes.find((item) => item.lote_codigo === lote.lote_codigo);
        if (existeCodigoLote) {
          this.toastrService.error('El código de lote ya existe.');
          return;
        }
        
        lote.productos = [];

        this.lotes.push(lote);

      }
    });

  }

  public validarLotes() {
    let error = false;
    let mensajeErrores = [];

    const detallecompraArray: any [] = structuredClone(this.detallecompraArray.value);

    /** - Primera validacion - */

    if(this.lotes.length === 0) {
      return {
        error: true,
        mensajeErrores: ['Debe agregar al menos un lote.']
      }
    }

    /** Los lotes deben de tener productos */
    this.lotes.forEach((lote) => {
      if (!lote.productos.length) {
        error = true;
        let mensajeError = `El lote ${lote.lote_codigo} no tiene productos asignados.`;

        mensajeErrores.push(mensajeError);
      }
    })


    /** - Segunda validacion - */
    /** Todos los productos deben tener asignado su total a unos lotes */
    detallecompraArray.forEach((detallecompra) => {
      const cantidadTotal = Number(detallecompra.detallecompra_cantidad);
      let cantidadAsignada = 0;

      this.lotes.forEach((lote) => {
        const productos = lote.productos.filter((producto) => producto.presentacionproducto_id === detallecompra.presentacionproducto_id);
        productos.forEach((producto) => {
          cantidadAsignada += producto.cantidad;
        })
      })

      if (cantidadTotal !== cantidadAsignada) {
        error = true;
        let mensajeError = `El producto ${detallecompra.detallecompra_descripcion} no tiene la cantidad completa asignada de la compra.`;

        mensajeErrores.push(mensajeError);
      }

    })

    return {
      error,
      mensajeErrores
    }
  }

  public cambiarVista(vista: number) {
    this.vista = vista;
  }



}
