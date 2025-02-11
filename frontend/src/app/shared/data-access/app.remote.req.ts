import {inject, Injectable} from '@angular/core';
import {environment} from "@environments/environment";
import {Observable} from "rxjs";
import {IResponse} from "@shared/interfaces/IResponse";
import {HttpService} from "@shared/services/http.service";

@Injectable({
    providedIn: 'root'
})

export class AppRemoteReq {

    private http = inject(HttpService)

    constructor() {
    }

    requestLogin(login: any): Observable<IResponse> {
        return this.http.post(environment.endpoints.auth.signIn, login);
    }

}
