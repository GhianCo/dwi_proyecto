import { CommonModule, JsonPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { COMPROBANTES, HTTP_RESPONSE } from '@shared/constants/app.const';
import { LoadingDirective } from '@shared/directives/loading.directive';
import { CurrencyFormatPipe } from '@shared/pipes/currency-formant.pipe';
import { SecurityService } from '@shared/services/security.service';
import { HistorialproductoMapper } from 'app/modules/producto/data-access/mappers/historialproducto.mapper';
import { ProductoRemoteReq } from 'app/modules/producto/data-access/producto.remote.req';
import { finalize, tap } from 'rxjs';

@Component({
  selector: 'app-modal-ver-historial-producto',
  standalone: true,
  imports: [
    LoadingDirective,
    CommonModule,
    MatIcon,
    MatButton,
    CurrencyFormatPipe,
    JsonPipe
  ],
  templateUrl: './modal-ver-historial-producto.component.html',
  styleUrl: './modal-ver-historial-producto.component.scss'
})
export class ModalVerHistorialProductoComponent implements OnInit{
  readonly dialogRef = inject(MatDialogRef<ModalVerHistorialProductoComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  public presentacionproducto = this.data.presentacionproducto;
  public simboloMoneda = this.securityService.getSimboloMoneda();
  public historialProducto: any[] = [];
  public cargando = false;
  private historialproductoMapper = new HistorialproductoMapper();
  public COMPROBANTES = COMPROBANTES;

  constructor(
    private securityService: SecurityService,
    private productoRemoteReq: ProductoRemoteReq
  ) { }


  ngOnInit(): void {
    this.obtenerHistorialProducto();
  }


  public obtenerHistorialProducto() {
    this.cargando = true;
    this.productoRemoteReq.requestObtenerHistorialProducto(this.presentacionproducto.presentacionproducto_id)
      .subscribe({
        next: (response) => {
          if (response.code === HTTP_RESPONSE.HTTP_200_OK) {
            this.historialProducto = this.historialproductoMapper.transform(response.data);
          }
        },
        complete: () => {
          this.cargando = false;
        }
      })
  }

  public onNoClick() {
    this.dialogRef.close();
  }

}
