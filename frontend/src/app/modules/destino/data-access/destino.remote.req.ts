import { Injectable } from '@angular/core';
import { map } from "rxjs/operators";
import { environment } from "@environments/environment";
import { Observable } from "rxjs";
import { IResponse } from '@shared/interfaces/IResponse';
import {HttpService} from "@shared/services/http.service";
import {Destino} from "./mappers/destino";

@Injectable({
    providedIn: 'root'
})

export class DestinoRemoteReq {

    private destinoMapper = new Destino();

    private REMOTE_API_URI = environment.apiRest;

    constructor(
        private http: HttpService,
    ) {
    }

    requestSearchDestinoByCriteria(criteria): Observable<IResponse> {
        const {query, page, perPage} = criteria;
        return this.http.get(this.REMOTE_API_URI + 'destino/getAll?query=' + query + '&page=' + page + '&perPage=' + perPage)
            .pipe(
                map((response: any) => {
                    if (response.data) {
                        response.data = this.destinoMapper.transform(response.data);
                    }
                    return response;
                })
            );
    }

    requestCreateDestino(destino): Observable<IResponse> {
        return this.http.post(this.REMOTE_API_URI + 'destino', destino)
            .pipe(
                map((response: any) => {
                    if (response.data) {
                        response.data = this.destinoMapper.transform(response.data);
                    }
                    return response;
                })
            );
    }

    requestUpdateDestino(destino): Observable<IResponse> {
        const { id } = destino;
        return this.http.post(this.REMOTE_API_URI + 'destino/' +  id, destino)
            .pipe(
                map((response: any) => {
                    if (response.data) {
                        response.data = this.destinoMapper.transform(response.data);
                    }
                    return response;
                })
            );
    }

}
