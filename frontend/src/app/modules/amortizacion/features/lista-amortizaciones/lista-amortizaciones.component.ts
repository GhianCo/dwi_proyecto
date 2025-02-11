import { AsyncPipe, KeyValuePipe, NgFor, NgIf } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButton, MatIconButton, MatMiniFabButton } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatOption } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
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
import { LoadingDirective } from '@shared/directives/loading.directive';
import { OnlyNumbersDirective } from '@shared/directives/only-numbers.directive';
import { OnlyPositiveIntegerDirective } from '@shared/directives/only-positive-integer.directive';
import { CurrencyFormatPipe } from '@shared/pipes/currency-formant.pipe';
import { SecurityService } from '@shared/services/security.service';
import { AmortizacionStore } from '../../data-access/amortizacion.store';
import { COMPROBANTES, PARAM } from '@shared/constants/app.const';
import { DateUtilityService } from '@shared/services/date-utility.service';
import { ModalVentaComponent } from '../modals/moda-venta/modal-venta.component';
import { ModalVentaCuotasComponent } from '../modals/modal-ventacuotas/modal-ventacuotas.component';
import { ModalPagarCuotaComponent } from '../modals/modal-pagarcuota/modal-pagarcuota.component';

@Component({
  selector: 'app-name',
  templateUrl: './lista-amortizaciones.component.html',
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
export class ListaAmortizacionesComponent implements OnInit {

  public amortizacionStore = inject(AmortizacionStore);
  public simboloMoneda = this.securityService.getSimboloMoneda();
  public COMPROBANTES = COMPROBANTES;

  public formAmortizaciones: FormGroup;
  public estadoVentasAmortizacion = [
    { "id": PARAM.UNDEFINED, "value": "Todos" },
    { "id": "1", "value": "Canceladas" },
    { "id": "0", "value": "Por cobrar" }
  ];

  constructor(
    private securityService: SecurityService,
    private dialog: MatDialog,
    private fb: FormBuilder,
  ) { }


  ngOnInit(): void { 
    this.formAmortizaciones = this.fb.group({
      cliente: [null],
      ventaSerie: [null],
      ventaCorrelativo: [null],
      ventaAmortizada: [false],
    });

    this.formAmortizaciones.get('ventaAmortizada').setValue(this.estadoVentasAmortizacion[0].id);

  }

  public buscar() {
    const data = this.formAmortizaciones.getRawValue();
    this.amortizacionStore.updateFilterVentasParaAmortizarToApply(data);
    
    const filterVentaToApply = this.amortizacionStore.filterVentasParaAmortizarToApply;
    this.amortizacionStore.loadSearchVentasParaAmortizar(filterVentaToApply);
    
  }

  public changePagination(event: any) {
    this.amortizacionStore.changePageInObtenerVentasParaAmortizar(event);
  }
7
  public verVenta(venta: any) {
    this.dialog.open(ModalVentaComponent, {
      width: '800px',
      data: {
        ventaId: venta.venta_id
      }
    })
  }


  public abrirModalCuotas(venta: any) {
    if(venta.cuotas && venta.cuotas.length > 0) {
      const cuotaVenta = venta.cuotas[0];
      const dialogRef =  this.dialog.open(ModalPagarCuotaComponent, {
        width: '950px',
        data: {
          cuotaventaId: cuotaVenta.cuotaventa_id
        }
      });

      dialogRef.afterClosed().subscribe((params) => {
        if(params && params.actualizar) {
          this.buscar();
        }

      })


    } else {
      this.dialog.open(ModalVentaCuotasComponent, {
        width: '800px',
        data: {
          ventaId: venta.venta_id
        }
      })
    }

  }
}
