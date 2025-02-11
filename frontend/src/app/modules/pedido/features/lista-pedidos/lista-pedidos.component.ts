import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PedidoStore } from '../../data-access/pedido.store';
import { NgIf, NgFor, KeyValuePipe, AsyncPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButton, MatIconButton, MatMiniFabButton } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatOption } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
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
import { OnlyNumbersDirective } from '@shared/directives/only-numbers.directive';
import { OnlyPositiveIntegerDirective } from '@shared/directives/only-positive-integer.directive';
import { CurrencyFormatPipe } from '@shared/pipes/currency-formant.pipe';
import { LoadingDirective } from '@shared/directives/loading.directive';
import { SecurityService } from '@shared/services/security.service';
import { PARAM } from '@shared/constants/app.const';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ModalDetallePedidoComponent } from '../modals/modal-detalle-pedido.component';

@Component({
  templateUrl: './lista-pedidos.component.html',
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
    MatCheckbox,
    LoadingDirective,
    MatMiniFabButton,
    MatPaginator
  ]
})
export class ListaPedidos implements OnInit {
 
  public formSearchPedido: FormGroup;
  public simboloMoneda = this.securiryService.getSimboloMoneda();

  public pedidoStore = inject(PedidoStore);

  public estadoPendientePedidos = [
    { "id": PARAM.UNDEFINED, "value": "Todos" },
    { "id": "1", "value": "Pendiente" },
    { "id": "0", "value": "No pendiente" }
  ]

  constructor(
    private fb: FormBuilder,
    private securiryService: SecurityService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void { 
    this.formSearchPedido = this.fb.group({
      "cliente": [null],
      "pedidoCodigo": [null],
      "pedidoPendiente": [null]
    });

    this.formSearchPedido.get('pedidoPendiente').setValue(this.estadoPendientePedidos[0].id);

  }


  public buscar() {
    const data = this.formSearchPedido.getRawValue();
    this.pedidoStore.updateFilterPedidoToApply(data);
    
    const filterPedidoToApply = this.pedidoStore.filterPedidoToApply;
    this.pedidoStore.loadSearchPedidos(filterPedidoToApply);
    
  }

  public changePagination(event: any) {
    this.pedidoStore.changePageInPedido(event);
  }

  public verPedido(pedido: any) {
    this.dialog.open(ModalDetallePedidoComponent, {
      width: '800px',
      data: {
        pedidoId: pedido.pedido_id
      }
    })
  }
}
