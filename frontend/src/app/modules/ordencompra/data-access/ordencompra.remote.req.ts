import { Injectable } from '@angular/core';
import { map } from "rxjs/operators";
import { environment } from "@environments/environment";
import { Observable } from "rxjs";
import { IResponse } from '@shared/interfaces/IResponse';
import { HttpService } from "@shared/services/http.service";
import { OrdencompraMapper } from './mappers/ordencompra.mapper';

@Injectable({
  providedIn: 'root'
})

export class OrdencompraRemoteReq {

  private ordencompraMapper = new OrdencompraMapper();
  private REMOTE_API_URI = environment.apiRest;

  constructor(
    private http: HttpService,
  ) {
  }

  requestSearchOrdencompraByCriteria(criteria): Observable<IResponse> {
    return this.http.post(this.REMOTE_API_URI + 'ordencompra/searchByParams', criteria)
      .pipe(
        map((response: any) => {
          if (response.data) {
            response.data = this.ordencompraMapper.transform(response.data);
          }
          return response;
        })
      );
  }


  requestGetOrdenCompraById(ordencompraId): Observable<IResponse> {
    return this.http.get(this.REMOTE_API_URI + 'ordencompra/' + ordencompraId)
    .pipe(
      map((response: any) => {
        if (response.data) {
          response.data = this.ordencompraMapper.transform(response.data);
        }
        return response;
      })
    );  
  }

  requestRegistrarOrdecompra(criteria) {
    return this.http.post(this.REMOTE_API_URI + 'ordencompra/registrarOrdencompra', criteria)
    .pipe(
      map((response: any) => {
        if (response.data) {
          response.data = this.ordencompraMapper.transform(response.data);
        }
        return response;
      })
    );
  }
  requestActualizarOrdecompra(criteria) {
    return this.http.put(this.REMOTE_API_URI + 'ordencompra/actualizarOrdencompra', criteria.ordencompra_id, criteria)
    .pipe(
      map((response: any) => {
        if (response.data) {
          response.data = this.ordencompraMapper.transform(response.data);
        }
        return response;
      })
    );
  }



}
