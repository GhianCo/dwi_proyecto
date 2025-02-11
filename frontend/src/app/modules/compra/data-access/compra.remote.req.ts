import { Injectable } from '@angular/core';
import { map } from "rxjs/operators";
import { environment } from "@environments/environment";
import { Observable } from "rxjs";
import { IResponse } from '@shared/interfaces/IResponse';
import { HttpService } from "@shared/services/http.service";
import { CompraMapper } from './mappers/compra.mapper';

@Injectable({
  providedIn: 'root'
})

export class CompraRemoteReq {

  private compraMapper = new CompraMapper();
  private REMOTE_API_URI = environment.apiRest;

  constructor(
    private http: HttpService,
  ) {
  }

  requestSearchCompraByCriteria(criteria): Observable<IResponse> {
    return this.http.post(this.REMOTE_API_URI + 'compra/searchByParams', criteria)
      .pipe(
        map((response: any) => {
          if (response.data) {
            response.data = this.compraMapper.transform(response.data);
          }
          return response;
        })
      );
  }


  requestGetCompraById(compraId): Observable<IResponse> {
    return this.http.get(this.REMOTE_API_URI + 'compra/' + compraId)
    .pipe(
      map((response: any) => {
        if (response.data) {
          response.data = this.compraMapper.transform(response.data);
        }
        return response;
      })
    );  
  }

  requestRegistrarCompra(criteria) {
    return this.http.post(this.REMOTE_API_URI + 'compra/registrarCompra', criteria)
    .pipe(
      map((response: any) => {
        if (response.data) {
          response.data = this.compraMapper.transform(response.data);
        }
        return response;
      })
    );
  }
  requestActualizarCompra(criteria) {
    return this.http.put(this.REMOTE_API_URI + 'compra/actualizarOrdencompra', criteria.ordencompra_id, criteria)
    .pipe(
      map((response: any) => {
        if (response.data) {
          response.data = this.compraMapper.transform(response.data);
        }
        return response;
      })
    );
  }



}
