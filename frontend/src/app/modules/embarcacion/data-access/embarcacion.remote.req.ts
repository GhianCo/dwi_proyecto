import { Injectable } from '@angular/core';
import { map } from "rxjs/operators";
import { environment } from "@environments/environment";
import { Observable } from "rxjs";
import { IResponse } from '@shared/interfaces/IResponse';
import {HttpService} from "@shared/services/http.service";
import {Embarcacion} from "./mappers/embarcacion";

@Injectable({
    providedIn: 'root'
})

export class EmbarcacionRemoteReq {

    private embarcacionMapper = new Embarcacion();

    private REMOTE_API_URI = environment.apiRest;

    constructor(
        private http: HttpService,
    ) {
    }

    requestSearchEmbarcacionByCriteria(criteria): Observable<IResponse> {
        const {query, page, perPage} = criteria;
        return this.http.get(this.REMOTE_API_URI + 'embarcacion/getAll?query=' + query + '&page=' + page + '&perPage=' + perPage)
            .pipe(
                map((response: any) => {
                    if (response.data) {
                        response.data = this.embarcacionMapper.transform(response.data);
                    }
                    return response;
                })
            );
    }

    requestCreateEmbarcacion(embarcacion): Observable<IResponse> {
        return this.http.post(this.REMOTE_API_URI + 'embarcacion', embarcacion)
            .pipe(
                map((response: any) => {
                    if (response.data) {
                        response.data = this.embarcacionMapper.transform(response.data);
                    }
                    return response;
                })
            );
    }

    requestUpdateEmbarcacion(embarcacion): Observable<IResponse> {
        const { id } = embarcacion;
        return this.http.post(this.REMOTE_API_URI + 'embarcacion/' +  id, embarcacion)
            .pipe(
                map((response: any) => {
                    if (response.data) {
                        response.data = this.embarcacionMapper.transform(response.data);
                    }
                    return response;
                })
            );
    }

}
