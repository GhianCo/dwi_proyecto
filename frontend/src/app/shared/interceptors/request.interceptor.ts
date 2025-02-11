import {HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse} from '@angular/common/http';
import {inject} from '@angular/core';
import {Observable, tap} from 'rxjs';
import {includes} from "lodash-es";
import {environment} from "@environments/environment";
import {ToastrService} from "ngx-toastr";
import {HTTP_RESPONSE} from "@shared/constants/app.const";

export const RequestInterceptor = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
    const notifications = inject(ToastrService);
    return next(req).pipe(
        tap(
            (event: HttpEvent<any>) => {
                const OPTIONS: { [type: string]: string } = {
                    PUT: 'Actualización',
                    POST: 'Guardado',
                    DELETE: 'Anulado/Eliminado'
                }

                if (req.method === 'GET') {
                    return;
                }

                if (event instanceof HttpResponse && event.ok) {

                    let message = event.body?.message;
                    let typeResponse = event.body?.code;
                    if (message) {
                        if (typeResponse == HTTP_RESPONSE.WARNING) {
                            notifications.warning(message);
                            return;
                        }
                        if (typeResponse == HTTP_RESPONSE.HTTP_200_OK || typeResponse == HTTP_RESPONSE.HTTP_CREATED) {
                            notifications.success(message);
                            return;
                        }
                        if (typeResponse == HTTP_RESPONSE.ERROR) {
                            notifications.error(message, "Ocurrió un error");
                            return;
                        }
                    }

                    message = atob(req.headers.get('message') ?? '');
                    const title = atob(req.headers.get('title') ?? '');
                    let type = title || OPTIONS[req.method];

                    if (req.method === 'DELETE') {
                        notifications.error(message, type);
                        return;
                    }

                    return
                }
            },
            err => {
                if (err instanceof HttpErrorResponse) {
                    if (!includes(err.url, environment.endpoints.auth.signIn)) {
                        const error = err?.error?.message || 'Ocurrió un error';
                        const type = "Ocurrió un error";
                        notifications.error(error, type);
                    }

                }
            })
    );
};
