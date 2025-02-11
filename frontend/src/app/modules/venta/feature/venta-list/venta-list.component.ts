import { NgIf, NgFor, JsonPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButton, MatIconButton, MatMiniFabButton } from '@angular/material/button';
import { MatOption } from '@angular/material/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterOutlet, RouterLink } from '@angular/router';
import { VentaStore } from '../../data-access/venta.store';
import { SecurityService } from '@shared/services/security.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatDrawerContainer } from '@angular/material/sidenav';
import { MatDialog } from '@angular/material/dialog';
import { ModalVentaComponent } from '../modals/moda-venta/modal-venta.component';
import { LoadingDirective } from '@shared/directives/loading.directive';
import { COMPROBANTES, TIPO_PAGO_EFECTIVO, TIPO_PAGO_TARJETA, TIPOS_PAGO } from '@shared/constants/app.const';
import { CustomButtonComponent } from '@shared/ui/custom-button/custom.button.component';
// import { LaddaModule } from 'angular2-ladda';

@Component({
  templateUrl: './venta-list.component.html',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./venta-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    MatLabel,
    MatPaginator,
    MatDrawerContainer,
    LoadingDirective,
    JsonPipe,
    NgClass,
    MatMiniFabButton,
  ]
})
export class VentaListComponent implements OnInit {
  public formVenta: FormGroup;
  public ventaStore = inject(VentaStore);
  public simboloMoneda = this.securiryService.getSimboloMoneda();
  public COMPROBANTES = COMPROBANTES;
  public TIPO_PAGO_TARJETA = TIPO_PAGO_TARJETA;
  public TIPO_PAGOE_FECTIVO = TIPO_PAGO_EFECTIVO;

  constructor(
    private securiryService: SecurityService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void { 
    this.formVenta = this.fb.group({
      cliente: [null],
      ventaSerie: [null],
      ventaCorrelativo: [null],
    });
    

  }

  public buscar() {
    const data = this.formVenta.getRawValue();
    this.ventaStore.updateFilterVentaToApply(data);
    
    const filterVentaToApply = this.ventaStore.filterVentaToApply;
    this.ventaStore.loadSearchVenta(filterVentaToApply);
    
  }


  public changePagination(event: any) {
    this.ventaStore.changePageInVenta(event);
  }

  public verVenta(venta: any) {
    this.dialog.open(ModalVentaComponent, {
      width: '800px',
      data: {
        ventaId: venta.venta_id
      }
    })
  }


}
