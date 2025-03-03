import { Injectable } from '@angular/core';
import { map } from "rxjs/operators";
import { environment } from "@environments/environment";
import { Observable } from "rxjs";
import { IResponse } from '@shared/interfaces/IResponse';
import {HttpService} from "@shared/services/http.service";
import {Conductor} from "./mappers/conductor";

@Injectable({
    providedIn: 'root'
})

export class ConductorRemoteReq {

    private conductorMapper = new Conductor();

    private REMOTE_API_URI = environment.apiRest;

    constructor(
        private http: HttpService,
    ) {
    }

    requestSearchConductorByCriteria(criteria): Observable<IResponse> {
        const {query, page, perPage} = criteria;
        return this.http.get(this.REMOTE_API_URI + 'conductor/getAll?query=' + query + '&page=' + page + '&perPage=' + perPage)
            .pipe(
                map((response: any) => {
                    if (response.data) {
                        response.data = this.conductorMapper.transform(response.data);
                    }
                    return response;
                })
            );
    }

    requestCreateConductor(conductor): Observable<IResponse> {
        return this.http.post(this.REMOTE_API_URI + 'conductor', conductor)
            .pipe(
                map((response: any) => {
                    if (response.data) {
                        response.data = this.conductorMapper.transform(response.data);
                    }
                    return response;
                })
            );
    }

    requestUpdateConductor(conductor): Observable<IResponse> {
        const { id } = conductor;
        return this.http.post(this.REMOTE_API_URI + 'conductor/' +  id, conductor)
            .pipe(
                map((response: any) => {
                    if (response.data) {
                        response.data = this.conductorMapper.transform(response.data);
                    }
                    return response;
                })
            );
    }

}
