import { NgIf, NgFor, KeyValuePipe, AsyncPipe } from '@angular/common';
import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
import { MatPaginator } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterOutlet, RouterLink } from '@angular/router';
import { ORDENCOMPRA_ESTADO, PARAM } from '@shared/constants/app.const';
import { LoadingDirective } from '@shared/directives/loading.directive';
import { OnlyNumbersDirective } from '@shared/directives/only-numbers.directive';
import { OnlyPositiveIntegerDirective } from '@shared/directives/only-positive-integer.directive';
import { CurrencyFormatPipe } from '@shared/pipes/currency-formant.pipe';
import { SecurityService } from '@shared/services/security.service';
import { OrdencompraStore } from '../../data-access/ordencompra.store';
import { MatDialog } from '@angular/material/dialog';
import { ModalDetalleOrdenCompraComponent } from '../modal-detalle-orden-compra/modal-detalle-orden-compra.component';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  templateUrl: 'lista-orden-compra.component.html',
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
    MatPaginator,
    MatMenuModule
  ]
})
export class ListaOrdencompraComponent implements OnInit {

  public ordencompraStore = inject(OrdencompraStore);
  public simboloMoneda = this.securityService.getSimboloMoneda();
  public estadoOrdenCompra = [
      { "id": PARAM.UNDEFINED, "value": "TODOS" },
      { "id": "1", "value": "PENDIENTES" },
      { "id": "2", "value": "PROCESADOS" }
    ];
  public ORDENCOMPRA_ESTADO = ORDENCOMPRA_ESTADO;

  public form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private securityService: SecurityService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void { 
    this.form = this.fb.group({
      ordencompra_estado: [null, []],
      codigo: [null, []]
    })
    
    this.form.get("ordencompra_estado").setValue(this.estadoOrdenCompra[0].id);
  }

  public changePagination(event: any) {
    this.ordencompraStore.changePageInOrdencompra(event); 
  }

  public buscar() {
    const params = this.form.getRawValue();
    this.ordencompraStore.updateFilterOrdencompraToApply(params);

    const filterOrdencompra = this.ordencompraStore.filterOrdencompraToApply;
    this.ordencompraStore.loadSearchOrdencompras(filterOrdencompra);
  }

  public abrirModalDetalleOrdencompra(ordencompra: any) {
    this.dialog.open(ModalDetalleOrdenCompraComponent, {
      width: '900px',
      data: {
        ordencompra        
      }
    })
  }


}
