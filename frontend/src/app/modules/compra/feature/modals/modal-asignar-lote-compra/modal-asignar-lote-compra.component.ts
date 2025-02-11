import { AsyncPipe, CommonModule, JsonPipe, KeyValuePipe, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatOption } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIcon } from '@angular/material/icon';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
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
import { ModalNuevoLoteComponent } from '../modal-nuevo-lote/modal-nuevo-lote.component';

@Component({
  selector: 'app-modal-asignar-lote-compra',
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
    LoadingDirective,
    MatMenuModule
  ],
  templateUrl: './modal-asignar-lote-compra.component.html',
  styleUrl: './modal-asignar-lote-compra.component.scss'
})
export class ModalAsignarLoteCompraComponent {

  readonly dialogRef = inject(MatDialogRef<ModalAsignarLoteCompraComponent>);
  constructor(
    private securityService: SecurityService,
    private dialog: MatDialog
  ) { }

  public nuevoLote() {
    this.dialog.open(ModalNuevoLoteComponent, {
      width: '500px',
      data: {}
    });
  }

  public onNoClick() {
    this.dialogRef.close();
  }

}
