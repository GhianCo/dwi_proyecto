import { Injectable } from '@angular/core';
import { map } from "rxjs/operators";
import { environment } from "@environments/environment";
import { Observable } from "rxjs";
import { IResponse } from '@shared/interfaces/IResponse';
import { HttpService } from "@shared/services/http.service";
import { ClienteMapper } from './mappers/cliente.mapper';

@Injectable({
    providedIn: 'root'
})

export class ClienteRemoteReq {

    private clienteMapper = new ClienteMapper();
    private REMOTE_API_URI = environment.apiRest;

    constructor(
        private http: HttpService,
    ) {
    }

    requestSearchClienteByCriteria(criteria): Observable<IResponse> {
        return this.http.post(this.REMOTE_API_URI + 'cliente/searchByParams', criteria)
            .pipe(
                map((response: any) => {
                    if (response.data) {
                        response.data = this.clienteMapper.transform(response.data);
                    }
                    return response;
                })
            );
    }

    requestCreateCliente(tipoDocumento): Observable<IResponse> {
        return this.http.post(this.REMOTE_API_URI + `cliente`, tipoDocumento)
            .pipe(
                map((response: any) => {
                    if (response.data) {
                        response.data = this.clienteMapper.transform(response.data);
                    }
                    return response;
                })
            );
    }

    requestUpdateCliente(cliente: any): Observable<IResponse> {
        const { cliente_id } = cliente;
        return this.http.put(this.REMOTE_API_URI + 'cliente', cliente_id, cliente)
            .pipe(
                map((response: any) => {
                    if (response.data) {
                        response.data = this.clienteMapper.transform(response.data);
                    }
                    return response;
                })
            );
    }

}
