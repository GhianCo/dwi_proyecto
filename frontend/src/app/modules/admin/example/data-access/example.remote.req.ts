import {inject, Injectable} from '@angular/core';
import {environment} from "@environments/environment";
import {Observable} from "rxjs";
import {IResponse} from "@shared/interfaces/IResponse";
import {HttpService} from "@shared/services/http.service";

@Injectable({
    providedIn: 'root'
})

export class ExampleRemoteReq {

    private http = inject(HttpService)

    private REMOTE_API_REST = environment.apiRest;

    constructor() {
    }

    requestTest(): Observable<IResponse> {
        return this.http.get(this.REMOTE_API_REST + 'cliente');
    }

}
