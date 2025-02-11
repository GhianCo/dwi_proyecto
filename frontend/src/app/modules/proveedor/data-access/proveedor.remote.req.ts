import { Injectable } from '@angular/core';
import { map } from "rxjs/operators";
import { environment } from "@environments/environment";
import { Observable } from "rxjs";
import { IResponse } from '@shared/interfaces/IResponse';
import { HttpService } from "@shared/services/http.service";
import { ProveedorMapper } from './mappers/proveedor.mapper';

@Injectable({
    providedIn: 'root'
})

export class PreoveedorRemoteReq {

    private proveedorMapper = new ProveedorMapper();
    private REMOTE_API_URI = environment.apiRest;

    constructor(
        private http: HttpService,
    ) {
    }

    requestSearchProveedorByCriteria(criteria): Observable<IResponse> {
        return this.http.post(this.REMOTE_API_URI + 'proveedor/searchByParams', criteria)
            .pipe(
                map((response: any) => {
                    if (response.data) {
                        response.data = this.proveedorMapper.transform(response.data);
                    }
                    return response;
                })
            );
    }

    requestCreateProveedor(tipoDocumento): Observable<IResponse> {
        return this.http.post(this.REMOTE_API_URI + `proveedor`, tipoDocumento)
            .pipe(
                map((response: any) => {
                    if (response.data) {
                        response.data = this.proveedorMapper.transform(response.data);
                    }
                    return response;
                })
            );
    }

    requestUpdateProveedor(proveedor: any): Observable<IResponse> {
        const { proveedor_id } = proveedor;
        return this.http.put(this.REMOTE_API_URI + 'proveedor', proveedor_id, proveedor)
            .pipe(
                map((response: any) => {
                    if (response.data) {
                        response.data = this.proveedorMapper.transform(response.data);
                    }
                    return response;
                })
            );
    }
    requestProveedorById(proveedorId: any): Observable<IResponse> {
        return this.http.get(this.REMOTE_API_URI + 'proveedor/'+ proveedorId)
            .pipe(
                map((response: any) => {
                    if (response.data) {
                        response.data = this.proveedorMapper.transform(response.data);
                    }
                    return response;
                })
            );
    }

}
