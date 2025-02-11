import { Injectable } from '@angular/core';
import { map } from "rxjs/operators";
import { environment } from "@environments/environment";
import { Observable } from "rxjs";
import { IResponse } from '@shared/interfaces/IResponse';
import { HttpService } from "@shared/services/http.service";
import { UnidadmedidaMapper } from './mappers/unidadmedida.mapper';

@Injectable({
    providedIn: 'root'
})

export class UnidadmedidaRemoteReq {

    private undiadmedidaMapper = new UnidadmedidaMapper();
    private REMOTE_API_URI = environment.apiRest;

    constructor(
        private http: HttpService,
    ) {
    }

    requestSearchUnidadmedidaByCriteria(criteria): Observable<IResponse> {
        return this.http.post(this.REMOTE_API_URI + 'unidadmedida/searchByParams', criteria)
            .pipe(
                map((response: any) => {
                    if (response.data) {
                        response.data = this.undiadmedidaMapper.transform(response.data);
                    }
                    return response;
                })
            );
    }

    requestCreateUnidadmedida(unidadmedida): Observable<IResponse> {
        return this.http.post(this.REMOTE_API_URI + `unidadmedida`, unidadmedida)
            .pipe(
                map((response: any) => {
                    if (response.data) {
                        response.data = this.undiadmedidaMapper.transform(response.data);
                    }
                    return response;
                })
            );
    }

    requestUpdateUnidadmedida(unidadmedida: any): Observable<IResponse> {
        const { unidadmedida_id } = unidadmedida;
        return this.http.put(this.REMOTE_API_URI + 'unidadmedida', unidadmedida_id, unidadmedida)
            .pipe(
                map((response: any) => {
                    if (response.data) {
                        response.data = this.undiadmedidaMapper.transform(response.data);
                    }
                    return response;
                })
            );
    }

}
