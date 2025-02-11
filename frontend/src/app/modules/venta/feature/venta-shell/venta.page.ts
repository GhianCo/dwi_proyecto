import { NgIf, NgFor, KeyValuePipe, AsyncPipe, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, ElementRef, inject, OnInit, signal, ViewChild, ViewEncapsulation, WritableSignal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatOption, provideNativeDateAdapter } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIcon } from '@angular/material/icon';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { COMPROBANTES, CONDICION_PAGO_CONTADO, CONDICION_PAGO_CREDITO, CONDICIONES_PAGO, SI, TIPO_PAGO_EFECTIVO, TIPOS_PAGO } from '@shared/constants/app.const';
import { ComprobantelocalRemoteReq } from 'app/modules/comprobantelocal/data-access/comprobantelocal.remote.req';
import { ComprobanteRemoteReq } from 'app/modules/comprobante/data-access/comprobante.remote.req';
import { ProductoRemoteReq } from 'app/modules/producto/data-access/producto.remote.req';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { catchError, debounceTime, distinctUntilChanged, map, Observable, Subject, switchMap, tap } from 'rxjs';
import { ClienteRemoteReq } from 'app/modules/cliente/data-access/cliente.remote.req';
import { MatCheckbox } from '@angular/material/checkbox';
import { SecurityService } from '@shared/services/security.service';
import { CurrencyFormatPipe } from '@shared/pipes/currency-formant.pipe';
import { OnlyPositiveIntegerDirective } from '@shared/directives/only-positive-integer.directive';
import { ToastrService } from 'ngx-toastr';
import { OnlyNumbersDirective } from '@shared/directives/only-numbers.directive';
import { VentaStore } from '../../data-access/venta.store';
import { VentaRemoteReq } from '../../data-access/venta.remote.req';
import { DateUtilityService } from '@shared/services/date-utility.service';
import { PedidoRemoteReq } from 'app/modules/pedido/data-access/pedido.remote.req';
import { LoadingDirective } from '@shared/directives/loading.directive';
import { DiasCreditoRemoteReq } from 'app/modules/diascredito/data-access/diascredito.remote.req';
import { MomentDateModule, MomentDateAdapter } from '@angular/material-moment-adapter';
import { CommonService } from '@shared/services/common.sevice';


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
  templateUrl: './venta.page.html',
  encapsulation: ViewEncapsulation.None,
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
    JsonPipe
  ],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    VentaStore
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ["./venta.page.scss"]
})
export class VentaPage implements OnInit {

  @ViewChild(FormGroupDirective) 
  formDirective: FormGroupDirective;

  public tiposPago = TIPOS_PAGO; 
  public comprobantesList: Observable<any[]> = new Observable();
  
  public productosList: Observable<any[]> = new Observable();
  public searchTextProducto$ = new Subject();
  public productoSeleccionado: any = null; 
 
  public searchTextCliente$ = new Subject();
  public clienteSeleccionado: any = null; 
  public clientesList: Observable<any[]> = new Observable()

  // public controlProducto = new FormControl('', [Validators.required]);
  // public controlCantidad = new FormControl(null, [Validators.required]);
  public controlCliente = new FormControl('');

  public otraDireccion = new FormControl(false);

  /** Formulario para venta */
  public formVenta: FormGroup;
  public simboloMoneda = this.securityService.getSimboloMoneda();

  public ventaStore = inject(VentaStore);

  public controlBuscarPedido = new FormControl(false);
  public searchTextPedidoCodigo$ = new Subject();
  public pedidosParaVentaList: Observable<any[]> = new Observable();
  public controlPedidoParaVenta = new FormControl();
  public buscandoPedidoParaVenta = false;

  public generandoVenta = false;


  public condicionesPagoList = CONDICIONES_PAGO;
  public condicionPagoContado = CONDICION_PAGO_CONTADO;
  public condicionPagoCredito = CONDICION_PAGO_CREDITO;

  public cargandoDiasCreditoList = false;
  public diasCreditoList = [];
  public mostrarResultadoProductos = false;


  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private productoRemoteReq: ProductoRemoteReq,
    private comprobanteRemoteReq: ComprobanteRemoteReq,
    private clienteRemoteReq: ClienteRemoteReq,
    private fb: FormBuilder,
    private securityService: SecurityService,
    private toastrService: ToastrService,
    private ventaRemoteReq: VentaRemoteReq,
    private pedidoRemoteReq: PedidoRemoteReq,
    private diasCreditoRemoteReq: DiasCreditoRemoteReq
  ) { }

  ngOnInit(): void {
    this.obtenerDiasCreditoActivos();

    this.comprobantesList = this.comprobanteRemoteReq.requestObtenerComprobantesPorLocalLogeado()
      .pipe(
        map((response) => response?.data ?? [])
      );

    this.formVenta = this.fb.group({
      comprobante_id: [null, [Validators.required]],
      venta_fechaemision: [new Date(), [Validators.required]],
      // venta_fechavencimiento: ['', [Validators.required]],
      cliente_id: [null, [Validators.required]],
      venta_clientedireccion: [null, [Validators.required]],
      venta_total: [0, [Validators.required]],
      pedido_id: [null],
      vendedor_id: [null],
      pedidos: this.fb.array([]),
      // pagoventa: this.fb.group({
      //   pagoventa_tipo: [null, [Validators.required]],
      //   pagoventa_pagocon: [null, [Validators.required]],
      //   pagoventa_vuelto: [0, [Validators.required]],
      //   pagoventa_monto: [null, [Validators.required]],

      //   /** Solo para mostrar */
      //   pagoventa_falta: [null],
      //   pagoventa_recibido: [null, [Validators.required]],
      // }),

      venta_tipo: [CONDICION_PAGO_CONTADO, [Validators.required]],
      venta_creditofechavecimiento: [{ value: null, disabled: true }, []],
      venta_diascredito: [null, []],
      diascredito_id: [null, []],
      amortizaciones: this.fb.array([]),

      /** Solo para manejar el formulario */
      controlProducto: [null, []],
      controlCantidad: [null, []],

    });

    /** Despues de seleccionar el tipo de venta contado genero una amortizacion */

    const amortizacionGroup = this.fb.group({
      amortizacion_monto: [{ value: this.totalImporte, disabled: true }, [Validators.required]],
      amortizacion_pagomodalidad: [TIPO_PAGO_EFECTIVO, [Validators.required]],
    });
    
    this.amortizaciones.push(amortizacionGroup);

    /** Selecciona por defecto efectivo */
    // this.formPagoVenta.get('pagoventa_tipo').setValue(this.tiposPago[0].id);

    /** Selecciona factura como comprobante por defecto */
    this.formVenta.get('comprobante_id').setValue(COMPROBANTES.FACTURA);

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

      this.pedidos.valueChanges.subscribe((pedidos) => {
        let totalImporte = 0;
      
        pedidos.forEach((pedido, index) => {
          const precio = pedido.detalleventa_precio || 0; 
          const cantidad = pedido.detalleventa_cantidad || 0;
      
          const importe = cantidad * precio;
      
          // Actualizamos el detalleventa_importe del pedido
          const pedidoFormGroup = this.pedidos.at(index) as FormGroup;
          const currentImporteControl = pedidoFormGroup.get('detalleventa_importe');
      
          // Solo actualizamos si el valor ha cambiado para evitar bucles infinitos
          if (currentImporteControl?.value !== importe) {
            currentImporteControl?.setValue(importe, { emitEvent: false });
          }
      
          // Acumulamos el importe para el total
          totalImporte += importe;
        });
      
        // Actualizamos el totalImporte en el control venta_importe
        const ventaImporteControl = this.formVenta.get('venta_importe');
        if (ventaImporteControl?.value !== totalImporte) {
          ventaImporteControl?.setValue(totalImporte, { emitEvent: false });
        }


        /** Seteo en venta */
        this.formVenta.get('venta_total').setValue(totalImporte);

        /** Segmento para las amortizaciones */
        const tipoPago = this.formVenta.get('venta_tipo').value;

        if(tipoPago === CONDICION_PAGO_CONTADO) {
          const cantidadDeAmortizaciones = this.amortizaciones.length;
          let totalPorAmortizacion = 0;

          if(cantidadDeAmortizaciones > 0) {
            totalPorAmortizacion = totalImporte / cantidadDeAmortizaciones;
          }

          for(let i = 0; i < cantidadDeAmortizaciones; i++) {
            const amortizacionControl = this.amortizaciones.at(i) as FormGroup;
            amortizacionControl.get('amortizacion_monto').setValue(totalPorAmortizacion);
          }
        }


        /** Seteo en pago venta */
        // this.formPagoVenta.get('pagoventa_monto').setValue(totalImporte);
        // this.formPagoVenta.get('pagoventa_falta').setValue(totalImporte);
      });

      // this.formPagoVenta.get('pagoventa_recibido').valueChanges
      //   .subscribe((pagoventaRecibido) => {
      //     this.formPagoVenta.get('pagoventa_pagocon').setValue(pagoventaRecibido);

      //     const total = this.totalImporte;
      //     let falta = 0;
      //     let vuelto = 0;

      //     if(total > 0) {
      //       if(pagoventaRecibido < total) {
      //         falta = Number(total) - Number(pagoventaRecibido);
      //       }
      //     }

      //     if((total > 0) && (pagoventaRecibido > total)) {
      //       vuelto = pagoventaRecibido - total;
      //     }
          
      //     this.formPagoVenta.get('pagoventa_vuelto').setValue(vuelto);
      //     this.formPagoVenta.get('pagoventa_falta').setValue(falta);

      //   });


        this.pedidosParaVentaList = this.searchTextPedidoCodigo$
        .pipe(
          debounceTime(300),
          distinctUntilChanged(),
          switchMap((value) => {
            const params = { 
              pedido_codigo: value,
            };

            return this.pedidoRemoteReq.requestBuscarPedioParaVentar(params)
              .pipe(
                map((response) => response?.data ?? [])
              );
          })
        )
      
  }

  // public get formPagoVenta() {
  //   return this.formVenta.get('pagoventa') as FormGroup;
  // }

  // public get pagoventaMonto() {
  //   return this.formPagoVenta.get('pagoventa_monto').value;
  // }

  // public get pagoventaVuelto() {
  //   return this.formPagoVenta.get('pagoventa_vuelto').value
  // }

  // public get pagoventaRecibido() {
  //   return this.formPagoVenta.get('pagoventa_recibido').value;
  // }

  // public get pagoventaFalta() {
  //   return this.formPagoVenta.get('pagoventa_falta').value;
  // }

  public get totalImporte() {
    return this.formVenta.get('venta_total').value;
  }

  // Función para mostrar el nombre del producto en el campo de texto
  public displayFnProducto(producto: any): string {
    return producto ? producto.presentacionproducto_nombre : '';
  }

  public selectProducto(producto: any): void {
    this.productoSeleccionado = producto;
    this.formVenta.get('controlCantidad').setValue(1);
    this.controlProducto.setValue(producto.presentacionproducto_descripcioncompleta);
    this.mostrarResultadoProductos = false;
  }

  public onInputProducto(event: any): void {
    const value = event.target.value;
    this.searchTextProducto$.next(value);
  }

  public get controlProducto() {
    return this.formVenta.get('controlProducto') as FormControl;
  }
  public get controlCantidad() {
    return this.formVenta.get('controlProducto') as FormControl;
  }

  public agregarProducto() {
    /** Verifica que no existe un mismo item */
    const productoId = this.productoSeleccionado.producto_id;
    const lotedetallecompraId = this.productoSeleccionado.lotedetallecompra.lotedetallecompra_id;
    const cantidadDisponible = this.productoSeleccionado.lotedetallecompra.lotedetallecompra_cantidaddisponible
    const presentacionId = this.productoSeleccionado.presentacionproducto_id;

    const existe = this.pedidos.value.some((pedido: any) => {
      return (pedido.producto_id === productoId && pedido.presentacionproducto_id === presentacionId) && pedido.producto.lotedetallecompra.lotedetallecompra_id === lotedetallecompraId;
    });

    if(existe) {
      this.toastrService.error('Ya existe el producto agregado a lista.');
      return;
    }

    const cantidad = Number(this.formVenta.get('controlCantidad').value);

    if(cantidad <= 0) {
      this.toastrService.error('La cantidad debe ser mayor a 0');
      return;
    }

    if(cantidad > cantidadDisponible) {
      this.toastrService.error('La cantidad no debe ser mayor a la cantidad disponible');
      return;
    }


    const groupFormPedido = this.fb.group({
      producto_id: [this.productoSeleccionado.producto_id, [Validators.required]],
      detalleventa_cantidad: [cantidad, [Validators.required]],
      detalleventa_precio: [this.productoSeleccionado.presentacionproducto_precio, [Validators.required]],
      detalleventa_importe: [this.productoSeleccionado.presentacionproducto_precio * cantidad, [Validators.required]],
      detalleventa_descripcion: [this.productoSeleccionado.presentacionproducto_descripcioncompleta, [Validators.required]],
      presentacionproducto_id: [this.productoSeleccionado.presentacionproducto_id, [Validators.required]],
      producto: this.productoSeleccionado,
      lotedetallecompra_id: [lotedetallecompraId]
    });

    this.pedidos.push(groupFormPedido);


    /** Limpiar los inputs */
    this.limpiearAgregarProducto();
  }

  private limpiearAgregarProducto() {
    this.formVenta.get('controlProducto').setValue(null);
    this.productoSeleccionado = null;

    this.formVenta.get('controlCantidad').setValue(null);

    // /** Limpiear error por si */
    // this.controlProducto.setErrors(null);
    // this.controlCantidad.setErrors(null);

  }

  public get pedidos() {
    return this.formVenta.get('pedidos') as FormArray;
  }

  public onInputCliente(event: any): void {
    const value = event.target.value;
    this.searchTextCliente$.next(value);
  }

  public selectCliente(cliente: any): void {
    if(cliente) {
      this.clienteSeleccionado = cliente;
      this.formVenta.get('cliente_id').setValue(cliente.cliente_id);
  
      console.log('Cliente seleccionado:', this.clienteSeleccionado);
    }
  }

  public displayFnCliente(cliente: any) {
    if(!cliente){
      return '';
    }

    if(cliente && cliente !== '' && typeof cliente === 'string') {
      return cliente;
    }

    const clienteNombre = cliente.cliente_nombres + ' ' + cliente.cliente_apellidos;
    return clienteNombre;

  }

  public onChangeCantidad() {
    this._changeDetectorRef.markForCheck();
  }

  public pagar() {

    if(this.formVenta.get('comprobante_id').value === null) {
      this.toastrService.error('Debe seleccionar un comprobante');
      return;
    }

    if(this.formVenta.invalid) {

      /** Valida que haya al menos un producto */
      if(this.pedidos.length === 0) {
        this.toastrService.error('Debe agregar al menos un producto');
        return;
      }

      /** Valida que haya un cliente selecionado */
      if(!this.formVenta.get('cliente_id').value || !this.clienteSeleccionado) {
        this.toastrService.error('Debe seleccionar un cliente');
        return;
      }

      this.formVenta.markAllAsTouched();
      return;
    }

    const { error, mensajeErrores } = this.validarCantidades();
    
    if(error) {
      CommonService.mostrarAlerta({
        tipo: "error",
        titulo: "Upss, error",
        mensaje: mensajeErrores
      })
      return;

    }

    let objVenta = this.formVenta.getRawValue();
    if(objVenta.venta_creditofechavecimiento) {
      const fechaVencimiento = DateUtilityService.parsearSoloFecha(objVenta.venta_creditofechavecimiento) + ' 23:59:59';
      objVenta.venta_creditofechavecimiento =  fechaVencimiento;
    }


    if(objVenta.venta_fechaemision) {
      objVenta.venta_fechaemision =  DateUtilityService.parseFechaFromServer(objVenta.venta_fechaemision);
    }

    if(objVenta.venta_fechavencimiento) {
      objVenta.venta_fechavencimiento =  DateUtilityService.parseFechaFromServer(objVenta.venta_fechavencimiento);
    } 

    this.generandoVenta = true;
    this.ventaRemoteReq.requestNuevaVenta(objVenta)
      .subscribe({
        next: (response) => {
          this.clearFormVenta();
          this.generandoVenta = false;
          
          this._changeDetectorRef.detectChanges();
        },
        error: (error) => {
          this.generandoVenta = false;
          this._changeDetectorRef.detectChanges();
        }
      })
      

  }

  public validarCantidades() {
    let error = false;
    const mensajeErrores = [];
    
    let objVenta = this.formVenta.getRawValue();
    let pedidos: any[] = objVenta.pedidos;

    pedidos.forEach((pedido) => {
      if(Number(pedido.detalleventa_cantidad > pedido.producto.lotedetallecompra.lotedetallecompra_cantidaddisponible)) {
        error = true;
        mensajeErrores.push(`El producto ${pedido.detalleventa_descripcion} no tiene la cantidad disponible`);
      }

    })

    return {
      error,
      mensajeErrores
    }

  }

  private clearFormVenta() {
    this.formDirective.resetForm();
    
    /** Limpia las validaciones para que no salga error */
    this.controlCliente.reset();
    this.clienteSeleccionado = null;
    this.otraDireccion.setValue(false);
    this.productoSeleccionado = null;
    this.pedidos.clear();

    this.formVenta.get("venta_fechaemision").setValue(new Date());
    this.formVenta.get('comprobante_id').setValue(COMPROBANTES.FACTURA);

    this._changeDetectorRef.detectChanges();  

    // this.formPagoVenta.reset();

    this._changeDetectorRef.detectChanges();

    this.controlBuscarPedido.setValue(false);
    this.controlPedidoParaVenta.reset();

    this.formVenta.get('venta_tipo').setValue(CONDICION_PAGO_CONTADO);


  }


  public eliminarPedido(index: number) {
    this.pedidos.removeAt(index);
  }

  public onInputPedidoCodigo(event: any) {
    const value = event.target.value;
    this.searchTextPedidoCodigo$.next(value);
  }

  public selectPedidoParaVenta(pedido: any) {
    this.buscandoPedidoParaVenta = true;

    this.pedidoRemoteReq.requestobtenerPedidoParaVenta(pedido.pedido_id)
      .subscribe({
        next: (response) => {
          

          if(!response.data) {
            this.toastrService.error('Error al obtener el pedido, intente nuevamente');
          }

          const pedido = response.data;
          this.parsearPedidoParaVenta(pedido);

          this.buscandoPedidoParaVenta = false;
          this._changeDetectorRef.detectChanges();
        },
        error: (error) => {
          this.buscandoPedidoParaVenta = false;
        }
      })
  }

  public displayFnPedidoParaVenta(pedido: any): string {
    return pedido ? pedido.pedido_descripcion : '';
  }

  public parsearPedidoParaVenta(pedido: any) {
    if(pedido && pedido.detallepedido && pedido.detallepedido.length > 0) {
      /** Limpio mis pedidos */
      this.pedidos.clear();

      this.clienteSeleccionado = pedido.cliente;
      this.formVenta.get('cliente_id').setValue(pedido.cliente_id);
      this.formVenta.get('comprobante_id').setValue(pedido.comprobante_id);
      const clienteNombres = `${(pedido.cliente.cliente_nombres).trim()} ${(pedido.cliente.cliente_apellidos).trim()}`.trim();
  
      this.controlCliente.setValue(clienteNombres);
      this._changeDetectorRef.detectChanges();

      this.otraDireccion.setValue(true);
      this.formVenta.get('venta_clientedireccion').setValue(pedido.pedido_clientedireccion);

      pedido.detallepedido.forEach((detalle) => {
        const groupFormPedido = this.fb.group({
          producto_id: [detalle.producto_id, [Validators.required]],
          detalleventa_cantidad: [detalle.detallepedido_cantidad, [Validators.required]],
          detalleventa_precio: [detalle.detallepedido_precio, [Validators.required]],
          detalleventa_importe: [detalle.detallepedido_importe, [Validators.required]],
          detalleventa_descripcion: [detalle.detallepedido_descripcion, [Validators.required]],
          presentacionproducto_id: [detalle.presentacionproducto_id, [Validators.required]],
          producto: detalle.presentacionproducto,
        });

        this.pedidos.push(groupFormPedido);
      });

      this.formVenta.get("pedido_id").setValue(pedido.pedido_id);
      this.formVenta.get("vendedor_id").setValue(pedido.usuario_id);


      if(pedido.pedido_tipo && pedido.pedido_tipo == CONDICION_PAGO_CONTADO) {
        this.formVenta.get('venta_tipo').setValue(CONDICION_PAGO_CONTADO);
      }

      if(pedido.pedido_tipo && pedido.pedido_tipo == CONDICION_PAGO_CREDITO) {
        const fechaVencimiento = new Date(pedido.pedido_creditofechavecimiento);

        this.formVenta.get('venta_tipo').setValue(CONDICION_PAGO_CREDITO);
        this.formVenta.get('diascredito_id').setValue(pedido.diascredito_id);
        this.formVenta.get('venta_creditofechavecimiento').setValue(fechaVencimiento  );
      }

    }

  }

  public changeCondicionPago(event: any) {
    if(event.value === CONDICION_PAGO_CREDITO) {
      this.amortizaciones.clear();

      this.formVenta.get('diascredito_id').setValidators([Validators.required]);
      this.formVenta.get("venta_creditofechavecimiento").setValidators([Validators.required]);
    }
  
    if(event.value === CONDICION_PAGO_CONTADO) {
      this.formVenta.get('diascredito_id').clearValidators();
      this.formVenta.get("venta_creditofechavecimiento").clearValidators();

      this.amortizaciones.clear();

      const amortizacionGroup = this.fb.group({
        amortizacion_monto: [{ value: this.totalImporte, disabled: true }, [Validators.required]],
        amortizacion_pagomodalidad: [TIPO_PAGO_EFECTIVO, [Validators.required]],
      });
      
      this.amortizaciones.push(amortizacionGroup);

    }
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
          this._changeDetectorRef.detectChanges();
        }),
        catchError((error) => {
          this.cargandoDiasCreditoList = false;
          this.diasCreditoList = [];
          this._changeDetectorRef.detectChanges();
          return [];
        })
      ).subscribe();
  }

  public changeDiasCredito(event: any) {
    const diaCredito = this.diasCreditoList.find((diaCredito) => diaCredito.diascredito_id === event.value);
    const fechaActual = new Date();
    const fechaVencimiento = DateUtilityService.sumarDiasAFecha(fechaActual, Number(diaCredito.diascredito_valor));

    this.formVenta.get('venta_creditofechavecimiento').setValue(fechaVencimiento);
    this.formVenta.get('venta_diascredito').setValue(diaCredito.diascredito_valor);
    this._changeDetectorRef.detectChanges();
  }

  public get amortizaciones() {
    return this.formVenta.get('amortizaciones') as FormArray;
  }

  public onBlurProducto() {
    this.mostrarResultadoProductos = false;
    this.controlProducto.setValue('');
  }

  public onFocusProducto() {
    this.mostrarResultadoProductos = true;
  }

  public onDocumentClick(event: any) {
    this.mostrarResultadoProductos = false;
  }

}
