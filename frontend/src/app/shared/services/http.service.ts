import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from "@angular/core";
import {map, Observable, throwError} from "rxjs";
import {environment} from "@environments/environment";
import {ParseDataResponseMapper} from "@shared/mappers/parse.data.response.mapper";

export function SerializeQuery(obj: any, prefix?: string): string {
    const str = [];
    for (const p in obj) {
        if (obj.hasOwnProperty(p)) {
            const k = prefix ? prefix + '[' + p + ']' : p;
            const v = Array.isArray(obj[p]) ? obj[p].length ? obj[p] : '' : obj[p];
            if (undefined !== v) {
                str.push((v !== null && typeof v === 'object') ? SerializeQuery(v, k) : encodeURIComponent(k) + '=' + encodeURIComponent(v));
            }
        }
    }
    return str.join('&');
}

export function httpServiceCreator(http: HttpClient) {
    return new HttpService(http);
}

export class HttpRequestOptions {
    body?: any;
    params?: HttpParams | { [param: string]: any };
    headers?: { [param: string]: string };
    method?: HttpMethods | string;
    url?: string;
}

export type HttpMethodOptions = Omit<HttpRequestOptions, 'method'>;

export enum HttpMethods {
    GET, POST, PUT, PATCH, DELETE, OPTIONS
}

@Injectable()
export class HttpService {
    API_URL = environment.api;
    private parseDataResponseMapper = new ParseDataResponseMapper();

    constructor(private readonly service: HttpClient) {
    }

    request(endpoint: string, options?: HttpRequestOptions): Observable<any> {
        if (!endpoint) {
            return throwError('HttpService: The URL was not specified');
        }

        const API_URL = this.API_URL;

        options ||= new HttpRequestOptions();
        options.method = ('string' === typeof options.method ? HttpMethods[options.method as any] : options.method) || HttpMethods.GET;
        options.headers ??= {
            idTransaccion: String(+(new Date())),
            timestamp: (new Date()).toISOString(),
        };


        endpoint = `${API_URL}/${endpoint}`;

        options.headers['message'] = window.btoa(options.headers['message'] ?? '');

        if (options.params && !(options.params instanceof HttpParams)) {
            options.params = new HttpParams({fromString: SerializeQuery(options.params)});
        }

        return this.service
            .request(HttpMethods[options.method as any], endpoint, options)
            .pipe(map(response => this.parseDataResponseMapper.transform(response)));
    }

    /**
     * Obtener un recurso,
     * realiza una solicitud http utilizando el metodo GET
     * @param endpoint Path del recurso
     * @param id Id del recurso
     * @param options Opciones http del recurso
     */
    get(endpoint: string, id: string | number, options?: HttpMethodOptions): Observable<any>;
    get(endpoint: string, options?: HttpMethodOptions): Observable<any>;
    get(endpoint: string, arg1?: string | number | HttpMethodOptions, arg2?: HttpMethodOptions): Observable<any> {
        let options = arg2;

        if (arg1 && 'object' === typeof arg1 && !Array.isArray(arg1)) {
            options = arg1;
        }

        if (['string', 'number'].includes(typeof arg1)) {
            endpoint = this.parsePath(arg1, endpoint);
        }

        return this.request(endpoint, {
            method: HttpMethods.GET,
            ...options
        });
    }

    /**
     * Crear un recurso,
     * realiza una solicitud http utilizando el metodo POST
     * @param endpoint Path del recurso
     * @param id Id del recurso
     * @param data Carga útil para el recurso
     * @param options Opciones http del recurso
     */
    post(endpoint: string, data?: any, options?: HttpMethodOptions) {
        return this.request(endpoint, {
            method: HttpMethods.POST,
            body: data,
            ...options
        });
    }


    /**
     * Actualización total de un recurso,
     * realiza una solicitud http utilizando el metodo PUT
     * @param endpoint Path del recurso
     * @param id Id del recurso
     * @param data Carga útil para el recurso
     * @param options Opciones http del recurso
     */
    put(endpoint: string, id: any, data: any, options?: HttpMethodOptions) {
        return this.request(this.parsePath(id, endpoint), {
            method: HttpMethods.PUT,
            body: data,
            ...options
        });
    }

    /**
     * Eliminación de un recurso,
     * realiza una solicitud http utilizando el metodo DELETE
     * @param endpoint Path del recurso
     * @param id Id del recurso
     * @param options Opciones http del recurso
     */
    public delete(endpoint: string, id: any, options?: HttpMethodOptions): Observable<any> {
        return this.request(
            this.parsePath(id, endpoint),
            {
                method: HttpMethods.DELETE,
                ...options
            }
        );
    }


    /**
     * Modificación de un recurso,
     * realiza una solicitud http utilizando el metodo PATCH
     * @param endpoint Path del recurso
     * @param id Id del recurso
     * @param options Opciones http del recurso
     */
    public patch(endpoint: string, id: any, options?: HttpMethodOptions): Observable<any> {
        return this.request(
            this.parsePath(id, endpoint),
            {
                method: HttpMethods.PATCH,
                ...options
            }
        );
    }


    private parsePath(id: any, endpoint: string) {
        if (endpoint.includes(':id')) {
            endpoint = endpoint.replace(/:id/g, id ?? '');
            return endpoint.split('/').filter(Boolean).join('/');
        }
        return [endpoint, id].filter(Boolean).join('/');
    }
}
