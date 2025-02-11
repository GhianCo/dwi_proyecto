import { Injectable } from '@angular/core';
import { HttpService } from '@shared/services/http.service';
import { environment } from '@environments/environment';
import { Observable, map } from 'rxjs';
import { IResponse } from '@shared/interfaces/IResponse';
import { ProvinciaMapper } from './mappers/provincia.mapper';
import { PARAM } from '@shared/constants/app.const';

@Injectable({
  providedIn: 'root'
})
export class ProvinciaRemoteReq {

  private provinciaMapper = new ProvinciaMapper();
  private REMOTE_API_URI = environment.apiRest;

  constructor(
    private http: HttpService
  ) { }

  requestSearchProvinciaByCriteria(criteria): Observable<IResponse> {
    return this.http.post(this.REMOTE_API_URI + 'provincia/searchByParams', criteria)
      .pipe(
        map((response: any) => {
          if (response.data) {
            response.data = this.provinciaMapper.transform(response.data);
          }
          return response;
        })
      );
  }

  // requestCreateCaja(tipoDocumento): Observable<IResponse> {
  //   return this.http.post(this.REMOTE_API_URI + `caja`, tipoDocumento)
  //     .pipe(
  //       map((response: any) => {
  //         if (response.data) {
  //           response.data = this.paisMapper.transform(response.data);
  //         }
  //         return response;
  //       })
  //     );
  // }

  // requestUpdateCaja(caja: any): Observable<IResponse> {
  //   const { caja_id } = caja;
  //   return this.http.put(this.REMOTE_API_URI + 'caja', caja_id, caja)
  //     .pipe(
  //       map((response: any) => {
  //         if (response.data) {
  //           response.data = this.paisMapper.transform(response.data);
  //         }
  //         return response;
  //       })
  //     );
  // }

  obtenerProvinciasActivos(): Observable<IResponse> {
    const payload = {
      active: PARAM.ACTIVO
    }

    return this.http.post(this.REMOTE_API_URI + 'provincia', payload)
      .pipe(
        map((response: any) => {
          if (response.data) {
            response.data = this.provinciaMapper.transform(response.data);
          }
          return response;
        })
      );
  }

}
