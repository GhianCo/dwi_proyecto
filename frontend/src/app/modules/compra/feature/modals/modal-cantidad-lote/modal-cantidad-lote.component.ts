import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { OnlyNumbersDirective } from '@shared/directives/only-numbers.directive';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal-cantidad-lote',
  standalone: true,
  imports: [
    MatFormFieldModule,
    CommonModule,
    FormsModule,
    MatButton,
    OnlyNumbersDirective,
    MatInput
  ],
  templateUrl: './modal-cantidad-lote.component.html',
  styleUrl: './modal-cantidad-lote.component.scss'
})
export class ModalCantidadLoteComponent implements OnInit {
  public cantidad = 0;
  readonly dialogRef = inject(MatDialogRef<ModalCantidadLoteComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  public compraCantidad = this.data.compraCantidad;

  constructor(
    private dialog: MatDialog,
    private toastService: ToastrService
  ) { }

  ngOnInit(): void {
    if(this.compraCantidad && this.compraCantidad > 0) {
      this.cantidad = this.compraCantidad;
    }
  }

  public guardar() {
    if (this.cantidad <= 0) {
      this.toastService.warning('La cantidad debe ser mayor a 0');
      return;
    }
    this.dialogRef.close({
      cantidad: this.cantidad
    })


  }

}
