import { CommonModule, JsonPipe, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { COMPROBANTES } from '@shared/constants/app.const';
import { LoadingDirective } from '@shared/directives/loading.directive';
import { CurrencyFormatPipe } from '@shared/pipes/currency-formant.pipe';
import { SecurityService } from '@shared/services/security.service';
import { CompraStore } from 'app/modules/compra/data-access/compra.store';
import { ModalDetallePedidoComponent } from 'app/modules/pedido/features/modals/modal-detalle-pedido.component';

@Component({
  selector: 'app-modal-detalle-compra',
  standalone: true,
  imports: [
    LoadingDirective,
    CommonModule,
    MatIcon,
    MatButton,
    CurrencyFormatPipe,
    JsonPipe,
    NgFor,
    NgIf
  ],
  templateUrl: './modal-detalle-compra.component.html',
  styleUrl: './modal-detalle-compra.component.scss'
})
export class ModalDetalleCompraComponent {
  public compraStore = inject(CompraStore);
  readonly dialogRef = inject(MatDialogRef<ModalDetallePedidoComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  public simboloMoneda = this.securityService.getSimboloMoneda();
  public COMPROBANTES = COMPROBANTES;
  private compra = this.data.compra;


  constructor(
    private securityService: SecurityService
  ) { }

  ngOnInit(): void {
    this.compraStore.loadCompraById(this.compra.compra_id);
  }

}
