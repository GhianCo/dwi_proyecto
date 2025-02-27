import { Injectable } from '@angular/core';
import { map } from "rxjs/operators";
import { environment } from "@environments/environment";
import { Observable } from "rxjs";
import { IResponse } from '@shared/interfaces/IResponse';
import {HttpService} from "@shared/services/http.service";
import {PuntoDesembarque} from "./mappers/punto.desembarque";

@Injectable({
    providedIn: 'root'
})

export class PuntoDesembarqueRemoteReq {

    private puntodesembarqueMapper = new PuntoDesembarque();

    private REMOTE_API_URI = environment.apiRest;

    constructor(
        private http: HttpService,
    ) {
    }

    requestSearchPuntoDesembarqueByCriteria(criteria): Observable<IResponse> {
        const {query, page, perPage} = criteria;
        return this.http.get(this.REMOTE_API_URI + 'punto-desembarque/getAll?query=' + query + '&page=' + page + '&perPage=' + perPage)
            .pipe(
                map((response: any) => {
                    if (response.data) {
                        response.data = this.puntodesembarqueMapper.transform(response.data);
                    }
                    return response;
                })
            );
    }

    requestCreatePuntoDesembarque(puntodesembarque): Observable<IResponse> {
        return this.http.post(this.REMOTE_API_URI + 'punto-desembarque', puntodesembarque)
            .pipe(
                map((response: any) => {
                    if (response.data) {
                        response.data = this.puntodesembarqueMapper.transform(response.data);
                    }
                    return response;
                })
            );
    }

    requestUpdatePuntoDesembarque(puntodesembarque): Observable<IResponse> {
        const { id } = puntodesembarque;
        return this.http.post(this.REMOTE_API_URI + 'punto-desembarque/' +  id, puntodesembarque)
            .pipe(
                map((response: any) => {
                    if (response.data) {
                        response.data = this.puntodesembarqueMapper.transform(response.data);
                    }
                    return response;
                })
            );
    }

}
