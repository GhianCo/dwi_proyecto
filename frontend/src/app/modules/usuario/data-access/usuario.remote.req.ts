import {Injectable} from '@angular/core';
import {map} from "rxjs/operators";
import {environment} from "@environments/environment";
import {Observable} from "rxjs";
import {IResponse} from '@shared/interfaces/IResponse';
import {HttpService} from "@shared/services/http.service";
import {UsuarioMapper as UsuarioMapper} from './mappers/usuario.mapper';

@Injectable({
    providedIn: 'root'
})

export class UsuarioRemoteReq {

    private usuarioMapper = new UsuarioMapper();
    private REMOTE_API_URI = environment.apiRest;

    constructor(
        private http: HttpService,
    ) {
    }

    requestSearchUsuarioByCriteria(criteria): Observable<IResponse> {
        const {query, page, perPage} = criteria;
        return this.http.get(this.REMOTE_API_URI + 'usuario/getAll?query=' + query + '&page=' + page + '&perPage=' + perPage)
            .pipe(
                map((response: any) => {
                    if (response.data) {
                        response.data = this.usuarioMapper.transform(response.data);
                    }
                    return response;
                })
            );
    }

    requestCreateUsuario(tipoDocumento): Observable<IResponse> {
        return this.http.post(this.REMOTE_API_URI + `usuario`, tipoDocumento)
            .pipe(
                map((response: any) => {
                    if (response.data) {
                        response.data = this.usuarioMapper.transform(response.data);
                    }
                    return response;
                })
            );
    }

    requestUpdateUsuario(usuario: any): Observable<IResponse> {
        const {id} = usuario;
        return this.http.post(this.REMOTE_API_URI + 'usuario/' + id, usuario)
            .pipe(
                map((response: any) => {
                    if (response.data) {
                        response.data = this.usuarioMapper.transform(response.data);
                    }
                    return response;
                })
            );
    }

}
