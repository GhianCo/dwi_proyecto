import { NgIf, NgFor, KeyValuePipe, AsyncPipe, JsonPipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckbox } from '@angular/material/checkbox';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MAT_NATIVE_DATE_FORMATS, MatNativeDateModule, MatOption, provideNativeDateAdapter } from '@angular/material/core';
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
import { RouterOutlet, RouterLink } from '@angular/router';
import { OnlyNumbersDirective } from '@shared/directives/only-numbers.directive';
import { OnlyPositiveIntegerDirective } from '@shared/directives/only-positive-integer.directive';
import { CurrencyFormatPipe } from '@shared/pipes/currency-formant.pipe';
import { SecurityService } from '@shared/services/security.service';
import { ClienteRemoteReq } from 'app/modules/cliente/data-access/cliente.remote.req';
import { ProductoRemoteReq } from 'app/modules/producto/data-access/producto.remote.req';
import { ToastrService } from 'ngx-toastr';
import { catchError, debounceTime, distinctUntilChanged, map, Observable, of, Subject, switchMap, tap } from 'rxjs';
import { PedidoRemoteReq } from '../../data-access/pedido.remote.req';
import Swal from 'sweetalert2';
import { LoadingDirective } from '@shared/directives/loading.directive';
import { ComprobanteRemoteReq } from 'app/modules/comprobante/data-access/comprobante.remote.req';
import { DiasCreditoRemoteReq } from 'app/modules/diascredito/data-access/diascredito.remote.req';
import { UtilityService } from '@shared/services/utility.service';
import { DateUtilityService } from '@shared/services/date-utility.service';
import { COMPROBANTES, CONDICION_PAGO_CONTADO, CONDICION_PAGO_CREDITO, CONDICIONES_PAGO, SI } from '@shared/constants/app.const';
import { MomentDateModule, MomentDateAdapter } from '@angular/material-moment-adapter';


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
  templateUrl: 'nuevo-pedido.component.html',
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
    JsonPipe,
    LoadingDirective,
    MatNativeDateModule,
    MatFormFieldModule
  ],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class NuevoPedidoComponent implements OnInit {

  @ViewChild(FormGroupDirective) 
  formDirective: FormGroupDirective;

  public formPedido: FormGroup;

  public searchTextCliente$ = new Subject();
  public clienteSeleccionado: any = {}; 
  public clientesList: Observable<any[]> = new Observable();
  public controlCliente = new FormControl();

  public productosList: Observable<any[]> = new Observable();
  public controlProducto = new FormControl('', Validators.required);
  public searchTextProducto$ = new Subject();
  public productoSeleccionado: any = null; 
  public simboloMoneda = this.securityService.getSimboloMoneda();

  public generandoPedido = false;

  public comprobantesList: Observable<any[]> = new Observable();
  public cargandoComprobantes = false;

  public diasCreditoList = [];
  public cargandoDiasCreditoList: boolean = false;


  public condicionesPagoList = CONDICIONES_PAGO;
  public condicionPagoContado = CONDICION_PAGO_CONTADO;
  public condicionPagoCredito = CONDICION_PAGO_CREDITO;

  public mostrarConfirmacionPedido = false;
  public codigoPedido: string | null = null;


  constructor(
    private clienteRemoteReq: ClienteRemoteReq,
    private productoRemoteReq: ProductoRemoteReq,
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private securityService: SecurityService,
    private pedidoRemoteReq: PedidoRemoteReq,
    private comprobanteRemoteReq: ComprobanteRemoteReq,
    private changeDetectorRef: ChangeDetectorRef,
    private diasCreditoRemoteReq: DiasCreditoRemoteReq
  ) { }

  ngOnInit(): void {
    this.cargarComprobantes();
    this.obtenerDiasCreditoActivos();

    this.formPedido = this.fb.group({
      cliente_id: [null, [Validators.required]],
      pedido_total: [0, [Validators.required]],
      detallepedido: this.fb.array([]),
      comprobante_id: [COMPROBANTES.FACTURA, [Validators.required]],
      pedido_tipo: [CONDICION_PAGO_CONTADO, [Validators.required]],
      diascredito_id: [null, []],
      pedido_diascredito: [null, []],

      pedido_creditofechavecimiento: [{ value: null, disabled: true }, []],
      pedido_clientedireccion: [null, [Validators.required]],
      pedido_clientedireccionid: [null, []],
      pedido_observacion: [null, []],
      pedido_clientenumero: [null, []],
      // pagos: this.fb.array([]),


      // Propiedades para el formulario
      controlCantidad: [null, []],
      controlProducto: [null, []],
      otraDireccion: [false, []],


    });


    this.clientesList = this.searchTextCliente$
      .pipe(
        tap(() => {
          this.clienteSeleccionado = null;
        }),
        debounceTime(300),
        distinctUntilChanged(),
        tap((value) => console.log(`Search: ${value}`)),
        switchMap((value) => {
          const params = { 
            query: value,
            active: true,
            perPage: 10,
            paraVenta: SI
          };

          return this.clienteRemoteReq.requestSearchClienteByCriteria(params)
            .pipe(
              map((response) => response?.data ?? [])
            );
        })
      );


      this.productosList = this.searchTextProducto$
      .pipe(
        tap(() => {
          this.productoSeleccionado = null;
        }),
        debounceTime(300),
        distinctUntilChanged(),
        tap((value) => console.log(`Search: ${value}`)),
        switchMap((value) => {
          const params = { busqueda: value };
          return this.productoRemoteReq.requestObtenerProductosPorBusqueda(params)
            .pipe(
              map((response) => response?.data ?? [])
            );
        })
      );

      this.detallepedido.valueChanges.subscribe((detallepedido) => {
        let totalImporte = 0;

        detallepedido.forEach((pedido, index) => {
          const precio = pedido.detallepedido_precio;
          const cantidad = pedido.detallepedido_cantidad;
          const importe = precio * cantidad;

          const pedidoFormGroup = this.detallepedido.at(index) as FormGroup;
          const currentImporteControl = pedidoFormGroup.get('detallepedido_importe');

           // Solo actualizamos si el valor ha cambiado para evitar bucles infinitos
           if (currentImporteControl?.value !== importe) {
            currentImporteControl?.setValue(importe, { emitEvent: false });
          }

          totalImporte += importe;
        });

        this.formPedido.get('pedido_total').setValue(totalImporte);
      })

  }

  public onInputCliente(event: any): void {
    const value = event.target.value;
    this.searchTextCliente$.next(value);
  }

  public selectCliente(cliente: any): void {
    this.clienteSeleccionado = cliente;
    this.formPedido.get('cliente_id').setValue(cliente.cliente_id);
    this.formPedido.get('pedido_clientenumero').setValue(cliente.cliente_telefonoprincipal);

    console.log('Cliente seleccionado:', this.clienteSeleccionado);
  }

  public displayFnCliente(cliente: any) {
    if(!cliente){
      return '';

    }
    const clienteNombre = cliente.cliente_nombres + ' ' + cliente.cliente_apellidos;
    return clienteNombre;

  }

  public onInputProducto(event: any): void {
    const value = event.target.value;
    this.searchTextProducto$.next(value);
  }

  public selectProducto(producto: any): void {
    this.productoSeleccionado = producto;
    this.controlCantidad.setValue(1);
    console.log('Producto seleccionado:', this.productoSeleccionado);
  }

   // Función para mostrar el nombre del producto en el campo de texto
   public displayFnProducto(producto: any): string {
    return producto ? producto.presentacionproducto_nombre : '';
  }

  public get detallepedido() {
    return this.formPedido.get('detallepedido') as FormArray;
  }

  public agregarProducto() {
    /** Verifica que no existe un mismo item */
    const productoId = this.productoSeleccionado.producto_id;
    const presentacionId = this.productoSeleccionado.presentacionproducto_id;

    const existe = this.detallepedido.value.some((pedido: any) => {
      return pedido.producto_id === productoId && 
             pedido.presentacionproducto_id === presentacionId;
    });

    if(existe) {
      this.toastrService.error('Ya existe el producto agregado a lista.');
      return;
    }

    const cantidad = this.controlCantidad.value;

    if(cantidad <= 0) {
      this.toastrService.error('La cantidad debe ser mayor a 0');
      return;
    }

    const groupFormPedido = this.fb.group({
      producto_id: [this.productoSeleccionado.producto_id, [Validators.required]],
      detallepedido_cantidad: [cantidad, [Validators.required]],
      detallepedido_precio: [this.productoSeleccionado.presentacionproducto_precio, [Validators.required]],
      detallepedido_importe: [this.productoSeleccionado.presentacionproducto_precio * cantidad, [Validators.required]],
      detallepedido_descripcion: [this.productoSeleccionado.presentacionproducto_nombre, [Validators.required]],
      presentacionproducto_id: [this.productoSeleccionado.presentacionproducto_id, [Validators.required]],
      producto: this.productoSeleccionado,
    });

    this.detallepedido.push(groupFormPedido);


    /** Limpiar los inputs */
    this.limpiearAgregarProducto();

  }

  private limpiearAgregarProducto() {
    this.formPedido.get('controlProducto').reset();
    this.formPedido.get('controlCantidad').reset();

  }

  public get totalImporte() {
    return this.formPedido.get('pedido_total').value;
  }

  public eliminarPedido(index: number) {
    this.detallepedido.removeAt(index);
  }

  public realizarPedido() {
    if(this.detallepedido.length === 0) {
      this.toastrService.error('Debe agregar al menos un producto.');
      return;
    }

    if(this.formPedido.invalid) {
      
      if(!this.formPedido.get('cliente_id').value || !this.clienteSeleccionado) {
        this.toastrService.error('Debe seleccionar un cliente.');
        return;
      }

      if(!this.formPedido.get('comprobante_id').value) {
        this.toastrService.error('Debe seleccionar un comprobante.');
        return;
      }


      this.formPedido.markAllAsTouched();
      return;
    }

    if(this.mostrarConfirmacionPedido)  {
      this.mostrarConfirmacionPedido = false;
    }

    if(this.codigoPedido) {
      this.codigoPedido = null;
    }


    let objPedido = this.formPedido.getRawValue();
    
    if(objPedido.pedido_creditofechavecimiento) {
      const fechaVencimiento = DateUtilityService.parsearSoloFecha(objPedido.pedido_creditofechavecimiento) + ' 23:59:59';
      objPedido.pedido_creditofechavecimiento = fechaVencimiento;
    }

    console.log(objPedido);

    this.generandoPedido = true;

    this.pedidoRemoteReq.requestNuevoPedido(objPedido)
    .subscribe({
      next: (response) => {
        const pedidoObj = response.data;
        // Swal.fire({
        //   title: "Pedido registrado",
        //   icon: "success",
        //   text:  `Tu pedido ha sido registrado correctamente con el número de pedido #${pedidoObj.pedido_codigo}`,
        // })
        this.mostrarConfirmacionPedido = true;
        this.codigoPedido = pedidoObj.pedido_codigo;

        this.clearFormPedido();
      },
      error: (error) => {
        this.generandoPedido = false;
      },
      complete: () => {
        this.generandoPedido = false;
      }
    })
  }

  public clearFormPedido() {
    this.formDirective.resetForm(); 

    this.detallepedido.clear();

    this.clienteSeleccionado = null;
    this.controlCliente.reset();

    /** Restablezco sus valores a como estaban */
    this.formPedido.get("pedido_tipo").setValue(CONDICION_PAGO_CONTADO);
    this.formPedido.get("comprobante_id").setValue(COMPROBANTES.FACTURA);
  }

  public get controlCantidad() {
    return this.formPedido.get('controlCantidad');
  }

  public cargarComprobantes() {
    this.cargandoComprobantes = true;
    this.comprobantesList = this.comprobanteRemoteReq.requestObtenerComprobantesPorLocalLogeado()
      .pipe(
        tap(() => {
          this.cargandoComprobantes = false;
          this.changeDetectorRef.detectChanges();
        }), 
        map((response) => response?.data ?? [])
      );

      // this.formPedido.get('comprobante_id').setValue(COMPROBANTES.FACTURA);
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
          this.changeDetectorRef.detectChanges();
          return [];
        })
      ).subscribe();

  }

  public get pagos() {
    return this.formPedido.get('pagos') as FormArray;
  }

  public changeDiasCredito(event: any) {
    const diaCredito = this.diasCreditoList.find((diaCredito) => diaCredito.diascredito_id === event.value);
    const fechaActual = new Date();
    const fechaVencimiento = DateUtilityService.sumarDiasAFecha(fechaActual, Number(diaCredito.diascredito_valor));

    this.formPedido.get('pedido_creditofechavecimiento').setValue(fechaVencimiento);
    this.formPedido.get('pedido_diascredito').setValue(diaCredito.diascredito_valor);
    this.changeDetectorRef.detectChanges();

  }
  
  public changeCondicionPago(event: any) {
    if(event.value === CONDICION_PAGO_CREDITO) {
      this.formPedido.get('diascredito_id').setValidators([Validators.required]);

      this.formPedido.get('pedido_diascredito').setValidators([Validators.required]);
      this.formPedido.get("pedido_creditofechavecimiento").setValidators([Validators.required]);
    }

  }

  public closePedidoConfirmacion() {
    this.mostrarConfirmacionPedido = false;
    this.codigoPedido = null;
  }

  public get otraDireccion() {
    return this.formPedido.get('otraDireccion');
  }

  public changeDireccionCliente(event: any) {
    const value = event.value;
    const direccion = this.clienteSeleccionado.direcciones.find((direccion: any) => direccion.direccioncliente_direccion === value);
    this.formPedido.get('pedido_clientedireccionid').setValue(direccion.direccioncliente_id);
  }

  public changeOtraDireccion() {
    if(!this.otraDireccion.value) {
      this.formPedido.get('pedido_clientedireccionid').setValue(null);
    }
  }


}
