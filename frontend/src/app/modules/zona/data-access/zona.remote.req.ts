import { Injectable } from '@angular/core';
import { map } from "rxjs/operators";
import { environment } from "@environments/environment";
import { Observable } from "rxjs";
import { IResponse } from '@shared/interfaces/IResponse';
import { HttpService } from "@shared/services/http.service";
import { ZonaMapper } from './mappers/zona.mapper';

@Injectable({
    providedIn: 'root'
})

export class ZonaRemoteReq {

    private zonaMapper = new ZonaMapper();
    private REMOTE_API_URI = environment.apiRest;

    constructor(
        private http: HttpService,
    ) {
    }

    requestSearchZonaByCriteria(criteria): Observable<IResponse> {
        return this.http.post(this.REMOTE_API_URI + 'zona/searchByParams', criteria)
            .pipe(
                map((response: any) => {
                    if (response.data) {
                        response.data = this.zonaMapper.transform(response.data);
                    }
                    return response;
                })
            );
    }

    requestCreateZona(tipoDocumento): Observable<IResponse> {
        return this.http.post(this.REMOTE_API_URI + `zona`, tipoDocumento)
            .pipe(
                map((response: any) => {
                    if (response.data) {
                        response.data = this.zonaMapper.transform(response.data);
                    }
                    return response;
                })
            );
    }

    requestUpdateZona(zona: any): Observable<IResponse> {
        const { zona_id } = zona;
        return this.http.put(this.REMOTE_API_URI + 'zona', zona_id, zona)
            .pipe(
                map((response: any) => {
                    if (response.data) {
                        response.data = this.zonaMapper.transform(response.data);
                    }
                    return response;
                })
            );
    }

}
