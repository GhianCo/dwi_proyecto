import { NgIf, NgFor, KeyValuePipe, AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
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
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterOutlet, RouterLink } from '@angular/router';
import { LoadingDirective } from '@shared/directives/loading.directive';
import { OnlyNumbersDirective } from '@shared/directives/only-numbers.directive';
import { OnlyPositiveIntegerDirective } from '@shared/directives/only-positive-integer.directive';
import { CurrencyFormatPipe } from '@shared/pipes/currency-formant.pipe';
import { CompraStore } from '../../data-access/compra.store';
import { SecurityService } from '@shared/services/security.service';
import { ComprobanteRemoteReq } from 'app/modules/comprobante/data-access/comprobante.remote.req';
import { lastValueFrom } from 'rxjs';
import { COMPROBANTES } from '@shared/constants/app.const';
import { MatDialog } from '@angular/material/dialog';
import { ModalDetalleCompraComponent } from '../modals/modal-detalle-compra/modal-detalle-compra.component';

@Component({
  selector: 'app-lista-compras',
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
  ],
  templateUrl: './lista-compras.component.html',
  styleUrl: './lista-compras.component.scss'
})
export class ListaComprasComponent implements OnInit{
  
  public compraStore = inject(CompraStore);
  public simboloMoneda = this.securityService.getSimboloMoneda();
  public form: FormGroup;

  public comprobantesList: any = [];
  public COMPROBANTES = COMPROBANTES;
  public cargandoComprobantes = true;

  constructor(
    private securityService: SecurityService,
    private fb: FormBuilder,
    private comprobanteRemoteReq: ComprobanteRemoteReq,
    private dialog: MatDialog,
  ) {}

  async ngOnInit() {
    this.form = this.fb.group({
      comprobante: [null, []],
      serie: [null, []],
      correlativo: [null, []],
      active: [null, []],
    });
    await this.cargarComprobantes();

    this.buscar();

  }

  public changePagination(event: any) {
    this.compraStore.changePageInCompra(event); 
  }

  public buscar() {
    const data = this.form.getRawValue();
    this.compraStore.updateFilterOrdencompraToApply(data);

    const filterCompraToApply = this.compraStore.filterCompraToApply;
    this.compraStore.loadSearchCompras(filterCompraToApply);

  }

  public async cargarComprobantes() {
    this.cargandoComprobantes = true;
    const response = await lastValueFrom(this.comprobanteRemoteReq.requestObtenerComprobantesPorLocalLogeado());
    if(response && response.data) {
      this.comprobantesList = response.data ?? [];
      if(this.comprobantesList.length > 0) {
        this.form.get('comprobante').setValue(COMPROBANTES.BOLETA);
      }
    }
    this.cargandoComprobantes = false;
    
  }

  public abrirModalDetalleCompra(compra) {
    this.dialog.open(ModalDetalleCompraComponent, {
      width: '900px',
      data: {
        compra        
      }
    })
  }

}
