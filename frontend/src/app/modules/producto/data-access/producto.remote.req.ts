import { Injectable } from '@angular/core';
import { map } from "rxjs/operators";
import { environment } from "@environments/environment";
import { Observable } from "rxjs";
import { IResponse } from '@shared/interfaces/IResponse';
import { HttpService } from "@shared/services/http.service";
import { PresentacionproductoMapper } from './mappers/Presentacionproducto.mapper';
import { ProductoMapper } from './mappers/producto.mapper';

@Injectable({
    providedIn: 'root'
})

export class ProductoRemoteReq {

    private presentacionproductoMapper = new PresentacionproductoMapper();
    private productoMapper = new ProductoMapper();
    private REMOTE_API_URI = environment.apiRest;

    constructor(
        private http: HttpService,
    ) {
    }

    requestSearchProductoByCriteria(criteria): Observable<IResponse> {
        return this.http.post(this.REMOTE_API_URI + 'producto/searchByParams', criteria)
            .pipe(
                map((response: any) => {
                    if (response.data) {
                        response.data = this.presentacionproductoMapper.transform(response.data);
                    }
                    return response;
                })
            );
    }

    requestCreateProducto(tipoDocumento): Observable<IResponse> {
        return this.http.post(this.REMOTE_API_URI + `producto`, tipoDocumento)
            .pipe(
                map((response: any) => {
                    if (response.data) {
                        response.data = this.presentacionproductoMapper.transform(response.data);
                    }
                    return response;
                })
            );
    }

    requestUpdateProducto(producto: any): Observable<IResponse> {
        const { producto_id } = producto;
        return this.http.put(this.REMOTE_API_URI + 'producto', producto_id, producto)
            .pipe(
                map((response: any) => {
                    if (response.data) {
                        response.data = this.presentacionproductoMapper.transform(response.data);
                    }
                    return response;
                })
            );
    }

    requestObtenerProductosPorBusqueda(criteria: any): Observable<IResponse> {
        return this.http.post(this.REMOTE_API_URI + 'producto/obtenerproductosporbusqueda', criteria)
            .pipe(
                map((response: any) => {
                    return response;
                })
            );
    }
    requestGetProductoById(producto_id: any): Observable<IResponse> {
        return this.http.get(this.REMOTE_API_URI + `producto/${producto_id}`)
            .pipe(
                map((response: any) => {
                    return response;
                })
            );
    }

    requestObtenerHistorialProducto(presentacionproducto_id: any): Observable<IResponse> {
        return this.http.get(this.REMOTE_API_URI + `producto/obtenerHistorialProducto/${presentacionproducto_id}`)
        .pipe(
            map((response: any) => {
                return response;
            })
        ); 
    }


}
