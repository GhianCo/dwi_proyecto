import { Injectable } from '@angular/core';
import { map } from "rxjs/operators";
import { environment } from "@environments/environment";
import { Observable } from "rxjs";
import { IResponse } from '@shared/interfaces/IResponse';
import { HttpService } from "@shared/services/http.service";
import { UbicacionMapper } from './mappers/ubicacion.mapper';

@Injectable({
    providedIn: 'root'
})

export class UbicacionRemoteReq {

    private ubicacionMapper = new UbicacionMapper();
    private REMOTE_API_URI = environment.apiRest;

    constructor(
        private http: HttpService,
    ) {
    }

    requestSearchUbicacionByCriteria(criteria): Observable<IResponse> {
        return this.http.post(this.REMOTE_API_URI + 'ubicacion/searchByParams', criteria)
            .pipe(
                map((response: any) => {
                    if (response.data) {
                        response.data = this.ubicacionMapper.transform(response.data);
                    }
                    return response;
                })
            );
    }

    requestCreateUbicacion(tipoDocumento): Observable<IResponse> {
        return this.http.post(this.REMOTE_API_URI + `ubicacion`, tipoDocumento)
            .pipe(
                map((response: any) => {
                    if (response.data) {
                        response.data = this.ubicacionMapper.transform(response.data);
                    }
                    return response;
                })
            );
    }

    requestUpdateUbicacion(cliente: any): Observable<IResponse> {
        const { cliente_id } = cliente;
        return this.http.put(this.REMOTE_API_URI + 'ubicacion', cliente_id, cliente)
            .pipe(
                map((response: any) => {
                    if (response.data) {
                        response.data = this.ubicacionMapper.transform(response.data);
                    }
                    return response;
                })
            );
    }

}
