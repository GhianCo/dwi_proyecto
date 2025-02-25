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

    requestSearchTipoDocumentoByCriteria(criteria): Observable<IResponse> {
        return this.http.post(this.REMOTE_API_URI + 'tipodocumento/searchByParams', criteria)
            .pipe(
                map((response: any) => {
                    if (response.data) {
                        response.data = this.presentacionMapper.transform(response.data);
                    }
                    return response;
                })
            );
    }

    requestCreateTipoDocumento(presentacion): Observable<IResponse> {
        return this.http.post(this.REMOTE_API_URI + 'tipodocumento', presentacion)
            .pipe(
                map((response: any) => {
                    if (response.data) {
                        response.data = this.presentacionMapper.transform(response.data);
                    }
                    return response;
                })
            );
    }

    requestUpdateTipoDocumento(presentacion): Observable<IResponse> {
        const { tipodocumento_id } = presentacion;
        return this.http.put(this.REMOTE_API_URI + 'tipodocumento',  tipodocumento_id, presentacion)
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
