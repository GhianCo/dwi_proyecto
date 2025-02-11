import { Injectable } from '@angular/core';
import { map } from "rxjs/operators";
import { environment } from "@environments/environment";
import { Observable } from "rxjs";
import { IResponse } from '@shared/interfaces/IResponse';
import { HttpService } from "@shared/services/http.service";
import { CategoriaMapper } from './mappers/categoria.mapper';

@Injectable({
    providedIn: 'root'
})

export class CategoriaRemoteReq {

    private categoriateMapper = new CategoriaMapper();
    private REMOTE_API_URI = environment.apiRest;

    constructor(
        private http: HttpService,
    ) {
    }

    requestSearchCategoriaByCriteria(criteria): Observable<IResponse> {
        return this.http.post(this.REMOTE_API_URI + 'categoria/searchByParams', criteria)
            .pipe(
                map((response: any) => {
                    if (response.data) {
                        response.data = this.categoriateMapper.transform(response.data);
                    }
                    return response;
                })
            );
    }

    requestCreateCategoria(tipoDocumento): Observable<IResponse> {
        return this.http.post(this.REMOTE_API_URI + `categoria`, tipoDocumento)
            .pipe(
                map((response: any) => {
                    if (response.data) {
                        response.data = this.categoriateMapper.transform(response.data);
                    }
                    return response;
                })
            );
    }

    requestUpdateCategoria(cliente: any): Observable<IResponse> {
        const { cliente_id } = cliente;
        return this.http.put(this.REMOTE_API_URI + 'categoria', cliente_id, cliente)
            .pipe(
                map((response: any) => {
                    if (response.data) {
                        response.data = this.categoriateMapper.transform(response.data);
                    }
                    return response;
                })
            );
    }

}
