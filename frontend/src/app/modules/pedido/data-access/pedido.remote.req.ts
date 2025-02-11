import { Injectable } from '@angular/core';
import { map } from "rxjs/operators";
import { environment } from "@environments/environment";
import { Observable } from "rxjs";
import { IResponse } from '@shared/interfaces/IResponse';
import { HttpService } from "@shared/services/http.service";
import { PedidoMapper } from './mappers/pedido.mapper';

@Injectable({
    providedIn: 'root'
})

export class PedidoRemoteReq {

    private pedidoMapper = new PedidoMapper();
    private REMOTE_API_URI = environment.apiRest;

    constructor(
        private http: HttpService,
    ) {
    }

    requestSearchVentaByCriteria(criteria): Observable<IResponse> {
        return this.http.post(this.REMOTE_API_URI + 'pedido/searchByParams', criteria)
            .pipe(
                map((response: any) => {
                    if (response.data) {
                        response.data = this.pedidoMapper.transform(response.data);
                    }
                    return response;
                })
            );
    }

    requestNuevoPedido(venta): Observable<IResponse> {
        return this.http.post(this.REMOTE_API_URI + `pedido`, venta)
            .pipe(
                map((response: any) => {
                    if (response.data) {
                        response.data = this.pedidoMapper.transform(response.data);
                    }
                    return response;
                })
            );
    }


    requestGetPedidoById(pedidoId): Observable<IResponse> {
        return this.http.get(this.REMOTE_API_URI + `pedido/${pedidoId}`)
            .pipe(
                map((response: any) => {
                    if (response.data) {
                        response.data = this.pedidoMapper.transform(response.data);
                    }
                    return response;
                })
            );
    }
    requestBuscarPedioParaVentar(body: any): Observable<IResponse> {
        return this.http.post(this.REMOTE_API_URI + `pedido/buscarPedidoParaVenta`, body)
            .pipe(
                map((response: any) => {
                    return response;
                })
            );
    }
    requestobtenerPedidoParaVenta(pedidoId: any): Observable<IResponse> {
        return this.http.get(this.REMOTE_API_URI + `pedido/obtenerPedidoParaVenta/${pedidoId}`)
            .pipe(
                map((response: any) => {
                    return response;
                })
            );
    }

}
