import { CommonModule, JsonPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { COMPROBANTES } from '@shared/constants/app.const';
import { LoadingDirective } from '@shared/directives/loading.directive';
import { CurrencyFormatPipe } from '@shared/pipes/currency-formant.pipe';
import { SecurityService } from '@shared/services/security.service';
import { UtilityService } from '@shared/services/utility.service';
import { VentaStore } from 'app/modules/venta/data-access/venta.store';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-name',
  standalone: true,
  templateUrl: './modal-venta.component.html',
  imports: [
    LoadingDirective,
    CommonModule,
    MatIcon,
    MatButton,
    CurrencyFormatPipe,
    JsonPipe
  ]
})
export class ModalVentaComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<ModalVentaComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  readonly ventaId = this.data.ventaId;

  public ventaStore = inject(VentaStore);
  public COMPROBANTES = COMPROBANTES
  public simboloMoneda = this.securityService.getSimboloMoneda();

  constructor(
    private securityService: SecurityService
  ) { }

  ngOnInit(): void { 
    this.ventaStore.loadVentaById(this.ventaId);
  }

  onNoClick(): void {
    this.dialogRef.close();
    this.ventaStore.clearVentaSelected();
  }

  // public async anularVenta () {
  //   const result = await Swal.fire({
  //     title: "¿Estas seguro que deseas anular esta venta?",
  //     showCancelButton: true,
  //     confirmButtonText: "Si, anular",
  //     cancelButtonText: "Cancelar"

  //   })

  //   if(result.isConfirmed) {
  //     this.ventaStore.anularVenta();
  //   }

  // } 



}
