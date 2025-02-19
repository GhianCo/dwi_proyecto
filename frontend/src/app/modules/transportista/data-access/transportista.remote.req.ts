import { Injectable } from '@angular/core';
import { map } from "rxjs/operators";
import { environment } from "@environments/environment";
import { Observable } from "rxjs";
import { IResponse } from '@shared/interfaces/IResponse';
import { HttpService } from "@shared/services/http.service";
import { TransportistaMapper } from './mappers/transportista.mapper';

@Injectable({
    providedIn: 'root'
})

export class TransportistaRemoteReq {

    private transportistaMapper = new TransportistaMapper();
    private REMOTE_API_URI = environment.apiRest;

    constructor(
        private http: HttpService,
    ) {
    }

    requestSearchTransportistaByCriteria(criteria): Observable<IResponse> {
        return this.http.post(this.REMOTE_API_URI + 'transportista/searchByParams', criteria)
            .pipe(
                map((response: any) => {
                    if (response.data) {
                        response.data = this.transportistaMapper.transform(response.data);
                    }
                    return response;
                })
            );
    }

    requestCreateTransportista(tipoDocumento): Observable<IResponse> {
        return this.http.post(this.REMOTE_API_URI + `transportista`, tipoDocumento)
            .pipe(
                map((response: any) => {
                    if (response.data) {
                        response.data = this.transportistaMapper.transform(response.data);
                    }
                    return response;
                })
            );
    }

    requestUpdateTransportista(transportista: any): Observable<IResponse> {
        const { transportista_id } = transportista;
        return this.http.put(this.REMOTE_API_URI + 'transportista', transportista_id, transportista)
            .pipe(
                map((response: any) => {
                    if (response.data) {
                        response.data = this.transportistaMapper.transform(response.data);
                    }
                    return response;
                })
            );
    }

}
