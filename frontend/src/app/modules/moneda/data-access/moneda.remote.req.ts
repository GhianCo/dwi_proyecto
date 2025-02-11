import { Injectable } from '@angular/core';
import { map } from "rxjs/operators";
import { environment } from "@environments/environment";
import { Observable } from "rxjs";
import { IResponse } from '@shared/interfaces/IResponse';
import { HttpService } from "@shared/services/http.service";
import { MonedaMapper } from './mappers/moneda.mapper';

@Injectable({
    providedIn: 'root'
})

export class MonedaRemoteReq {

    private monedaMapper = new MonedaMapper();
    private REMOTE_API_URI = environment.apiRest;

    constructor(
        private http: HttpService,
    ) {
    }

    requestSearchMonedaByCriteria(criteria): Observable<IResponse> {
        return this.http.post(this.REMOTE_API_URI + 'moneda/searchByParams', criteria)
            .pipe(
                map((response: any) => {
                    if (response.data) {
                        response.data = this.monedaMapper.transform(response.data);
                    }
                    return response;
                })
            );
    }

    requestCreateMoneda(moneda): Observable<IResponse> {
        return this.http.post(this.REMOTE_API_URI + `moneda`, moneda)
            .pipe(
                map((response: any) => {
                    if (response.data) {
                        response.data = this.monedaMapper.transform(response.data);
                    }
                    return response;
                })
            );
    }

    requestUpdateCategoria(moneda: any): Observable<IResponse> {
        const { moneda_id } = moneda;
        return this.http.put(this.REMOTE_API_URI + 'moneda', moneda_id, moneda)
            .pipe(
                map((response: any) => {
                    if (response.data) {
                        response.data = this.monedaMapper.transform(response.data);
                    }
                    return response;
                })
            );
    }

}
