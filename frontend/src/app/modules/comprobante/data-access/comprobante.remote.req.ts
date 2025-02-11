import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { ComprobanteMapper } from './mappers/comprobante.mapper';
import { map, Observable } from 'rxjs';
import { IResponse } from '@shared/interfaces/IResponse';
import { HttpService } from '@shared/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class ComprobanteRemoteReq {
  private comprobanteMapper = new ComprobanteMapper();
  private REMOTE_API_URI = environment.apiRest;

  constructor(
    private http: HttpService,
  ) { }

  requestObtenerComprobantesPorLocalLogeado(): Observable<IResponse> {
    return this.http.get(this.REMOTE_API_URI + 'comprobante/comprobantesporlocallogeado')
      .pipe(
        map((response: any) => {
          if (response.data) {
            response.data = this.comprobanteMapper.transform(response.data);
          }
          return response;
        })
      );
  }

}
