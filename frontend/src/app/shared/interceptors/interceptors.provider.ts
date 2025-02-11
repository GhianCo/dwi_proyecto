import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
    ENVIRONMENT_INITIALIZER,
    EnvironmentProviders,
    Provider,
    inject,
} from '@angular/core';
import {RequestInterceptor} from "@shared/interceptors/request.interceptor";
import {ToastrService} from "ngx-toastr";

export const provideInterceptor = (): Array<Provider | EnvironmentProviders> => {
    return [
        provideHttpClient(withInterceptors([RequestInterceptor])),
        {
            provide: ENVIRONMENT_INITIALIZER,
            useValue: () => inject(ToastrService),
            multi: true,
        },
    ];
};
