import { Injectable } from '@angular/core';
import { HttpService } from '@shared/services/http.service';
import { environment } from '@environments/environment';
import { Observable, map } from 'rxjs';
import { IResponse } from '@shared/interfaces/IResponse';
import { AmortizacionMapper } from './mappers/amortizacion.mapper';
import { DateUtilityService } from '@shared/services/date-utility.service';

@Injectable({
  providedIn: 'root'
})
export class AmorizacionRemoteReq {

  private amortizacionMapper = new AmortizacionMapper();
  private REMOTE_API_URI = environment.apiRest;

  constructor(
    private http: HttpService
  ) { }

  requestObtenerVentasParaAmortizar(criteria): Observable<IResponse> {
    return this.http.post(this.REMOTE_API_URI + 'amortizacion/ObtenerVentasParaAmortizar', criteria)
      .pipe(
        map((response: any) => {
          if (response.data) {
            response.data = this.amortizacionMapper.transform(response.data);
          }
          return response;
        })
      );
  }
  requestObtenerCuotasDeVenta(venta_id): Observable<IResponse> {
    return this.http.get(this.REMOTE_API_URI + `amortizacion/ObtenerCuotasDeVenta/${venta_id}`)
      .pipe(
        map((response: any) => {
          if (response.data) {
            // response.data = this.amortizacionMapper.transform(response.data);
          }
          return response;
        })
      );
  
  }

  requestObtenerCuotaParaAmortizar(cuotaventa_id): Observable<IResponse> {
    return this.http.get(this.REMOTE_API_URI + `amortizacion/ObtenerCuotaParaAmortizar/${cuotaventa_id}`)
      .pipe(
        map((response: any) => {
          if (response.data) {
            // response.data = this.amortizacionMapper.transform(response.data);
            if(response.data.venta) {
              response.data.venta.venta_fechaFormateada = DateUtilityService.formatearFecha(response.data.venta.venta_fecha);
            }
          }
          return response;
        })
      );
  }

  requestPagarCuotaVenta(criteria): Observable<IResponse> {
    return this.http.post(this.REMOTE_API_URI + `amortizacion/PagarCuotaVenta`, criteria)
      .pipe(
        map((response: any) => {
          if (response.data) {
            
          }
          return response;
        })
      );
  }



  
}
