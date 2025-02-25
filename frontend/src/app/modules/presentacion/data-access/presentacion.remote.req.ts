import { Injectable } from '@angular/core';
import { map } from "rxjs/operators";
import { environment } from "@environments/environment";
import { Observable } from "rxjs";
import { IResponse } from '@shared/interfaces/IResponse';
import {HttpService} from "@shared/services/http.service";
import {Presentacion} from "./mappers/presentacion";

@Injectable({
    providedIn: 'root'
})

export class PresentacionRemoteReq {

    private presentacionMapper = new Presentacion();

    private REMOTE_API_URI = environment.apiRest;

    constructor(
        private http: HttpService,
    ) {
    }

    requestSearchPresentacionByCriteria(criteria): Observable<IResponse> {
        const {query, page, perPage} = criteria;
        return this.http.get(this.REMOTE_API_URI + 'presentacion/getAll?query=' + query + '&page=' + page + '&perPage=' + perPage)
            .pipe(
                map((response: any) => {
                    if (response.data) {
                        response.data = this.presentacionMapper.transform(response.data);
                    }
                    return response;
                })
            );
    }

    requestCreatePresentacion(presentacion): Observable<IResponse> {
        return this.http.post(this.REMOTE_API_URI + 'presentacion', presentacion)
            .pipe(
                map((response: any) => {
                    if (response.data) {
                        response.data = this.presentacionMapper.transform(response.data);
                    }
                    return response;
                })
            );
    }

    requestUpdatePresentacion(presentacion): Observable<IResponse> {
        const { id } = presentacion;
        return this.http.post(this.REMOTE_API_URI + 'presentacion/' +  id, presentacion)
            .pipe(
                map((response: any) => {
                    if (response.data) {
                        response.data = this.presentacionMapper.transform(response.data);
                    }
                    return response;
                })
            );
    }

}
