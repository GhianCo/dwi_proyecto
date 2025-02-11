import { Injectable } from '@angular/core';
import { HttpService } from '@shared/services/http.service';
import { environment } from '@environments/environment';
import { Observable, map } from 'rxjs';
import { IResponse } from '@shared/interfaces/IResponse';
import { PARAM } from '@shared/constants/app.const';
import { DiascreditoMapper } from './mappers/departamento.mapper';

@Injectable({
  providedIn: 'root'
})
export class DiasCreditoRemoteReq {

  private diascreditoMapper = new DiascreditoMapper();
  private REMOTE_API_URI = environment.apiRest;

  constructor(
    private http: HttpService
  ) { }

  requestSearchDiasCreditoByCriteria(criteria): Observable<IResponse> {
    return this.http.post(this.REMOTE_API_URI + 'diascredito/searchByParams', criteria)
      .pipe(
        map((response: any) => {
          if (response.data) {
            response.data = this.diascreditoMapper.transform(response.data);
          }
          return response;
        })
      );
  }
}
