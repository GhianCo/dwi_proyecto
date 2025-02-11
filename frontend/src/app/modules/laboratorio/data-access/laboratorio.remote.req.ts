import { Injectable } from '@angular/core';
import { map } from "rxjs/operators";
import { environment } from "@environments/environment";
import { Observable } from "rxjs";
import { IResponse } from '@shared/interfaces/IResponse';
import {HttpService} from "@shared/services/http.service";
import {LaboratorioMapper} from "./mappers/laboratorio.mapper";

@Injectable({
    providedIn: 'root'
})

export class LaboratorioRemoteReq {

    private laboratorioMapper = new LaboratorioMapper();
    private REMOTE_API_URI = environment.apiRest;

    constructor(
        private http: HttpService,
    ) {};

    public requestSearchLaboratorioByCriteria(criteria : any): Observable<IResponse> {
        return this.http.post(this.REMOTE_API_URI + 'laboratorio/searchByParams', criteria)
            .pipe(
                map((response: any) => {
                    if (response.data) {
                        response.data = this.laboratorioMapper.transform(response.data);
                    }
                    return response;
                })
            );
    };

    public requestCreateLaboratorio(laboratorio : any): Observable<IResponse> {
        return this.http.post(this.REMOTE_API_URI + 'laboratorio', laboratorio)
            .pipe(
                map((response: any) => {
                    if (response.data) {
                        response.data = this.laboratorioMapper.transform(response.data);
                    }
                    return response;
                })
            );
    };

    public requestUpdateLaboratorio(laboratorio : any): Observable<IResponse> {
        const { laboratorio_id } = laboratorio;
        return this.http.put(this.REMOTE_API_URI + 'laboratorio',  laboratorio_id, laboratorio)
            .pipe(
                map((response: any) => {
                    if (response.data) {
                        response.data = this.laboratorioMapper.transform(response.data);
                    }
                    return response;
                })
            );
    };

};
