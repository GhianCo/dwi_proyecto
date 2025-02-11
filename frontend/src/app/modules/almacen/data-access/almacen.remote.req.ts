import { Injectable } from '@angular/core';
import { HttpService } from '@shared/services/http.service';
import { environment } from '@environments/environment';
import { Observable, map } from 'rxjs';
import { IResponse } from '@shared/interfaces/IResponse';
import { AlmacenMapper } from './mappers/almacen.mapper';
import { PARAM } from '@shared/constants/app.const';

@Injectable({
  providedIn: 'root'
})
export class AlmacenRemoteReq {

  private almacenMapper = new AlmacenMapper();
  private REMOTE_API_URI = environment.apiRest;

  constructor(
    private http: HttpService
  ) { }

  requestSearchAlmacenByCriteria(criteria): Observable<IResponse> {
    return this.http.post(this.REMOTE_API_URI + 'almacen/searchByParams', criteria)
      .pipe(
        map((response: any) => {
          if (response.data) {
            response.data = this.almacenMapper.transform(response.data);
          }
          return response;
        })
      );
  }

  requestCreateAlmacen(tipoDocumento): Observable<IResponse> {
    return this.http.post(this.REMOTE_API_URI + `almacen`, tipoDocumento)
      .pipe(
        map((response: any) => {
          if (response.data) {
            response.data = this.almacenMapper.transform(response.data);
          }
          return response;
        })
      );
  }

  requestUpdateAlmacen(almacen: any): Observable<IResponse> {
    const { almacen_id } = almacen;
    return this.http.put(this.REMOTE_API_URI + 'almacen', almacen_id, almacen)
      .pipe(
        map((response: any) => {
          if (response.data) {
            response.data = this.almacenMapper.transform(response.data);
          }
          return response;
        })
      );
  }

  requestAlmacenById(almacen_id: number): Observable<IResponse> {
    return this.http.get(this.REMOTE_API_URI + 'almacen/' + almacen_id)
      .pipe(
        map((response: any) => {
          if (response.data) {
            response.data = this.almacenMapper.transform(response.data);
          }
          return response;
        })
      );
  }
  requestObtenerAlmacenesByLocal(local_id: number): Observable<IResponse> {
    return this.http.get(this.REMOTE_API_URI + 'almacen/obtenerAlmacenesByLocal/' + local_id)
      .pipe(
        map((response: any) => {
          if (response.data) {
            response.data = this.almacenMapper.transform(response.data);
          }
          return response;
        })
      );
  }
}
