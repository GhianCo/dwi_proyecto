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
import { PedidoStore } from '../../data-access/pedido.store';

@Component({
  selector: 'app-name',
  standalone: true,
  templateUrl: './modal-detalle-pedido.component.html',
  imports: [
    LoadingDirective,
    CommonModule,
    MatIcon,
    MatButton,
    CurrencyFormatPipe,
    JsonPipe
  ]
})
export class ModalDetallePedidoComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<ModalDetallePedidoComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  readonly pedidoId = this.data.pedidoId;

  public pedidoStore = inject(PedidoStore);
  public simboloMoneda = this.securityService.getSimboloMoneda();

  constructor(
    private securityService: SecurityService
  ) { }

  ngOnInit(): void { 
    this.pedidoStore.loadPedidoById(this.pedidoId);
  }

  onNoClick(): void {
    this.dialogRef.close();
    this.pedidoStore.clearPedidoSelected();
  }

  public async anularVenta () {

  } 



}
  