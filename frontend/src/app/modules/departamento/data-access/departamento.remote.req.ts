import { Injectable } from '@angular/core';
import { HttpService } from '@shared/services/http.service';
import { environment } from '@environments/environment';
import { Observable, map } from 'rxjs';
import { IResponse } from '@shared/interfaces/IResponse';
import { DepartamentoMapper } from './mappers/departamento.mapper';
import { PARAM } from '@shared/constants/app.const';

@Injectable({
  providedIn: 'root'
})
export class DepartamentoRemoteReq {

  private departamentoMapper = new DepartamentoMapper();
  private REMOTE_API_URI = environment.apiRest;

  constructor(
    private http: HttpService
  ) { }

  requestSearchDepartamentoByCriteria(criteria): Observable<IResponse> {
    return this.http.post(this.REMOTE_API_URI + 'departamento/searchByParams', criteria)
      .pipe(
        map((response: any) => {
          if (response.data) {
            response.data = this.departamentoMapper.transform(response.data);
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

  obtenerDepartamentosActivos(): Observable<IResponse> {
    const payload = {
      active: PARAM.ACTIVO
    }

    return this.http.post(this.REMOTE_API_URI + 'departamento', payload)
      .pipe(
        map((response: any) => {
          if (response.data) {
            response.data = this.departamentoMapper.transform(response.data);
          }
          return response;
        })
      );
  }

}
