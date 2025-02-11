import { AsyncPipe, CommonModule, JsonPipe, KeyValuePipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIcon } from '@angular/material/icon';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterOutlet, RouterLink } from '@angular/router';
import { BANCOS, COMPROBANTES, CONDICIONES_PAGO, TIPO_PAGO_TRANSFERENCIA, TIPOS_PAGO } from '@shared/constants/app.const';
import { LoadingDirective } from '@shared/directives/loading.directive';
import { OnlyNumbersDirective } from '@shared/directives/only-numbers.directive';
import { OnlyPositiveIntegerDirective } from '@shared/directives/only-positive-integer.directive';
import { CurrencyFormatPipe } from '@shared/pipes/currency-formant.pipe';
import { CommonService } from '@shared/services/common.sevice';
import { SecurityService } from '@shared/services/security.service';
import { UtilityService } from '@shared/services/utility.service';
import { AmorizacionRemoteReq } from 'app/modules/amortizacion/data-access/amortizacion.remote.req';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-name',
  templateUrl: './modal-pagarcuota.component.html',
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
    JsonPipe
  ]
})
export class ModalPagarCuotaComponent implements OnInit {

  @ViewChild("file")
  public file: any;

  readonly dialogRef = inject(MatDialogRef<ModalPagarCuotaComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  readonly cuotaventaId = this.data.cuotaventaId;

  public simboloMoneda = this.securityService.getSimboloMoneda();
  public tiposPago = TIPOS_PAGO;

  public formPagarCuota: FormGroup;
  public cargandoCuota = false;
  public cuotaventaObj = null;

  public COMPROBANTES = COMPROBANTES;
  public BANCOS = BANCOS;
  public TIPO_PAGO_TRANSFERENCIA = TIPO_PAGO_TRANSFERENCIA;

  public pagandoCuota = false;

  public notifications = inject(ToastrService);

  constructor(
    private securityService: SecurityService,
    private fb: FormBuilder,
    private amorizacionRemoteReq: AmorizacionRemoteReq,
    private _changeDetectorRef: ChangeDetectorRef,
    private commonService: CommonService
  ) { }

  ngOnInit(): void {
    this.formPagarCuota = this.fb.group({
      amortizacion_monto: [{ value: '' }, [Validators.required]],
      amortizacion_pagomodalidad: [],
      cuotaventa_id: [],
      venta_id: [],
      amortizacion_tipobanco: [],
      amortizacion_numerooperacion: [],
      amortizacion_voucher: [],
    })

    this.formPagarCuota.get('amortizacion_pagomodalidad').setValue(this.tiposPago[0].id);


    this.cargandoCuota = true;

    this.amorizacionRemoteReq.requestObtenerCuotaParaAmortizar(this.cuotaventaId)
      .subscribe({
        next: (response) => {
          if (response && response.data) {
            this.cuotaventaObj = response.data;

            const cuotaObj = response.data.cuota;
            const ventaObj = response.data.venta;

            this.formPagarCuota.get('amortizacion_monto').setValue(cuotaObj.cuotaventa_total);
            this.formPagarCuota.get('cuotaventa_id').setValue(cuotaObj.cuotaventa_id);
            this.formPagarCuota.get('venta_id').setValue(ventaObj.venta_id);

            /** Setea lo que falta pagar */
            // const montoFaltaPagar = cuotaObj.cuotaventa_total - cuotaObj.cuotaventa_pagado;
            this.formPagarCuota.get('amortizacion_monto').setValue(response.data.faltante);

          }
          this.cargandoCuota = false;
          this._changeDetectorRef.detectChanges();
        },
        error: () => {
          this.cargandoCuota = false;
          this._changeDetectorRef.detectChanges();
        }
      });

  }

  public get montoCuota() {
    return this.formPagarCuota.get('amortizacion_monto').value;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public async pagarCuota() {

    if (this.formPagarCuota.invalid) {
      this.formPagarCuota.markAllAsTouched();
      return;
    }

    /** Verifica el monto a pagar sea mayor  0 */
    if (this.montoCuota <= 0) {
      this.notifications.error("El monto a pagar debe ser mayor a 0", "Error");
      return;
    }


    const result = await Swal.fire({
      title: "¿Estás seguro que deseas realizar el pago de esta cuota?",
      showCancelButton: true,
      confirmButtonText: "Si, realizar pago",
      cancelButtonText: "Cancelar",
    })

    if (result.isConfirmed) {
      const data = this.formPagarCuota.getRawValue();

      this.pagandoCuota = true;

      this.amorizacionRemoteReq.requestPagarCuotaVenta(data)
        .subscribe({
          next: (response) => {
            if (response && response.data) {
              this.pagandoCuota = false;

              let params = {
                actualizar: true
              }

              this.dialogRef.close(params);
            }
          },
          error: () => {
            this.pagandoCuota = false;
            this._changeDetectorRef.detectChanges();
          }
        })
    }

  }

  public get amoritzacionPagomodalidad() {
    return this.formPagarCuota.get('amortizacion_pagomodalidad');
  }

  public changeSelectTipoPago(event: any) {
    const value = event.value;
    if (value == this.TIPO_PAGO_TRANSFERENCIA) {
      this.formPagarCuota.get("amortizacion_tipobanco").setValidators([Validators.required]);
      this.formPagarCuota.get("amortizacion_numerooperacion").setValidators([Validators.required]);
      this.formPagarCuota.get("amortizacion_voucher").setValidators([Validators.required]);
      
      this.formPagarCuota.get("amortizacion_voucher").updateValueAndValidity();

      this._changeDetectorRef.detectChanges();
    }else {
      this.formPagarCuota.get("amortizacion_tipobanco").clearValidators();
      this.formPagarCuota.get("amortizacion_tipobanco").updateValueAndValidity();

      this.formPagarCuota.get("amortizacion_numerooperacion").clearValidators();
      this.formPagarCuota.get("amortizacion_numerooperacion").updateValueAndValidity();

      this.formPagarCuota.get("amortizacion_voucher").clearValidators();
      this.formPagarCuota.get("amortizacion_voucher").updateValueAndValidity();

      this._changeDetectorRef.detectChanges();
    }

  }

  public get voucherImg() {
    const amortizacionVoucher = this.formPagarCuota.get('amortizacion_voucher').value;

    if (!amortizacionVoucher || amortizacionVoucher === "") {
      return null;
    }

    const amortizacionImagenURL = UtilityService.parsearUrlImagen(amortizacionVoucher);
    return amortizacionImagenURL;
  }

  public subirImagen() {
    this.file.nativeElement.click();
  }

  public onFileSelected(event: any) {
    const file: File = event.target.files[0]; // Recupera el archivo seleccionado

    if (file) {
      this.commonService.upload({ file, folder: 'vouchers' })
        .subscribe({
          next: (response) => {
            if (response.data) {
              this.formPagarCuota.get('amortizacion_voucher').setValue(response.data.filePath);
              this._changeDetectorRef.markForCheck();
            }
          }
        })

    }
  }

  // public get voucherIsRequired() {
  //   return this.formPagarCuota.get('amortizacion_voucher')?.hasError('required')
  // }

}
