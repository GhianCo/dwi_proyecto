import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SecurityService } from '@shared/services/security.service';
import { ModalDetallePedidoComponent } from 'app/modules/pedido/features/modals/modal-detalle-pedido.component';
import { OrdencompraStore } from '../../data-access/ordencompra.store';
import { LoadingDirective } from '@shared/directives/loading.directive';
import { CommonModule, JsonPipe, NgFor, NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { CurrencyFormatPipe } from '@shared/pipes/currency-formant.pipe';

@Component({
  selector: 'app-modal-detalle-orden-compra',
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
  templateUrl: './modal-detalle-orden-compra.component.html',
  styleUrl: './modal-detalle-orden-compra.component.scss'
})
export class ModalDetalleOrdenCompraComponent implements OnInit{

  public ordencCompraStore = inject(OrdencompraStore);
  readonly dialogRef = inject(MatDialogRef<ModalDetallePedidoComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  private ordencompra = this.data.ordencompra;
  public simboloMoneda = this.securityService.getSimboloMoneda();
  public ordencompraStore = inject(OrdencompraStore);


  constructor(
    private securityService: SecurityService
  ) { }

  ngOnInit(): void {
    this.ordencCompraStore.loadOrdencompraById(this.ordencompra.ordencompra_id);
  }


}
