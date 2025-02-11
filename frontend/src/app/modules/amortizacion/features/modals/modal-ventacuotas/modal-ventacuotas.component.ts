import { CommonModule, JsonPipe } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { LoadingDirective } from '@shared/directives/loading.directive';
import { CurrencyFormatPipe } from '@shared/pipes/currency-formant.pipe';
import { ModalVentaComponent } from '../moda-venta/modal-venta.component';
import { SecurityService } from '@shared/services/security.service';
import { AmorizacionRemoteReq } from 'app/modules/amortizacion/data-access/amortizacion.remote.req';
import { ModalPagarCuotaComponent } from '../modal-pagarcuota/modal-pagarcuota.component';

@Component({
  selector: 'app-name',
  standalone: true,
  templateUrl: './modal-ventacuotas.component.html',
  imports: [
    LoadingDirective,
    CommonModule,
    MatIcon,
    MatButton,
    CurrencyFormatPipe,
    JsonPipe
  ]
})
export class ModalVentaCuotasComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<ModalVentaComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  readonly cuotaId = this.data.cuotaId;
  
  public cuotas = [];
  public cargandoCuotas = false;


  public simboloMoneda = this.securityService.getSimboloMoneda();

  constructor(
    private securityService: SecurityService,
    private amorizacionRemoteReq: AmorizacionRemoteReq,
    private _changeDetectorRef: ChangeDetectorRef,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void { 
    this.cargandoCuotas = true;

    this.amorizacionRemoteReq.requestObtenerCuotasDeVenta(this.cuotaId)
      .subscribe({
        next: (response) => {

          if(response.data && Array.isArray(response.data)) {
            this.cuotas = response.data;
          }

          this.cargandoCuotas = false;

          this._changeDetectorRef.detectChanges();
        },
        error: (error) => {
          this.cargandoCuotas = false;

          this._changeDetectorRef.detectChanges();
        }
      });
    

  }


  public onNoClick(): void {
    this.dialogRef.close();
  }

  public pagarCuota (cuota: any) { 
    this.dialog.open(ModalPagarCuotaComponent, {
      width: '900px', 
      data: {
        cuotaventaId: cuota.cuotaventa_id
      }
    })
  }

}
