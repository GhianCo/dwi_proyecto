import { Injectable } from '@angular/core';
import { map } from "rxjs/operators";
import { environment } from "@environments/environment";
import { Observable } from "rxjs";
import { IResponse } from '@shared/interfaces/IResponse';
import { HttpService } from "@shared/services/http.service";
import { VentaMapper } from './mappers/venta.mapper';

@Injectable({
    providedIn: 'root'
})

export class VentaRemoteReq {

    private ventaMapper = new VentaMapper();
    private REMOTE_API_URI = environment.apiRest;

    constructor(
        private http: HttpService,
    ) {
    }

    requestSearchVentaByCriteria(criteria): Observable<IResponse> {
        return this.http.post(this.REMOTE_API_URI + 'venta/searchByParams', criteria)
            .pipe(
                map((response: any) => {
                    if (response.data) {
                        response.data = this.ventaMapper.transform(response.data);
                    }
                    return response;
                })
            );
    }

    requestNuevaVenta(venta): Observable<IResponse> {
        return this.http.post(this.REMOTE_API_URI + `venta`, venta)
            .pipe(
                map((response: any) => {
                    if (response.data) {
                        response.data = this.ventaMapper.transform(response.data);
                    }
                    return response;
                })
            );
    }


    requestGetVentaById(ventaId): Observable<IResponse> {
        return this.http.get(this.REMOTE_API_URI + `venta/${ventaId}`)
            .pipe(
                map((response: any) => {
                    if (response.data) {
                        response.data = this.ventaMapper.transform(response.data);
                    }
                    return response;
                })
            );
    }

    requestAnularVenta(ventaId): Observable<IResponse> {
        return this.http.post(this.REMOTE_API_URI + `venta/anular/${ventaId}`)
            .pipe(
                map((response: any) => {
                    if (response.data) {
                        response.data = this.ventaMapper.transform(response.data);
                    }
                    return response;
                })
            );
    }

}
