import {ChangeDetectorRef, DestroyRef, inject, Injectable} from "@angular/core";
import {SignalStore} from "@shared/data-access/signal.store";
import {AppRemoteReq} from "./app.remote.req";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {catchError, finalize, of, tap} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../core/auth/auth.service";
import { PersistenceService } from "@shared/services/persistence.service";
import { PKEY } from "@shared/constants/persistence.const";

export type IAppCoreState = {
    loginLoading: boolean,
    dataSession: any,
    loginError: any,

    signInForm: UntypedFormGroup,

}

const initialAppCoreState: IAppCoreState = {
    loginLoading: false,
    dataSession: null,
    loginError: null,

    signInForm: null
};

@Injectable({providedIn: 'root'})
export class AppStore extends SignalStore<IAppCoreState> {

    public readonly vm = this.selectMany([
        'loginLoading',
        'dataSession',
        'loginError',

        'signInForm'
    ]);

    destroyRef = inject(DestroyRef);
    appRemoteReq = inject(AppRemoteReq);
    _activatedRoute = inject(ActivatedRoute);
    _router = inject(Router);
    _formBuilder = inject(UntypedFormBuilder);
    _authService = inject(AuthService);
    _persistencia = inject(PersistenceService);
    _changeDetectorRef: ChangeDetectorRef
    constructor() {
        super();
        initialAppCoreState.signInForm = this._formBuilder.group({
            usuario: ['admin'],
            clave: ['admin', Validators.required]
        });
        this.initialize(initialAppCoreState);
    };

    public obtenerPermisosUsuario() {
        return this._persistencia.get(PKEY.PERMISOS_USER) ?? [];
    };

    public async signIn(login: any) {
        this.patch({loginLoading: true, loginError: null});
        this.appRemoteReq.requestLogin(login).pipe(
            takeUntilDestroyed(this.destroyRef),
            tap(async ({data}: any) => {
                this.patch({
                    dataSession: data,
                });

                // Store the access token in the local storage
                this._authService.accessToken = data;

                const redirectURL =
                    this._activatedRoute.snapshot.queryParamMap.get(
                        'redirectURL'
                    ) || '/signed-in-redirect';

                // Navigate to the redirect url
                this._router.navigateByUrl(redirectURL);
            }),
            finalize(async () => {
                this.patch({
                    loginLoading: false
                });
                this.vm().signInForm.enable();
            }),
            catchError(async ({error}) => {
                this.patch({
                    loginError: error,
                    loginLoading: false
                  });
                return of(null);
            })
        ).subscribe();
    };

}
