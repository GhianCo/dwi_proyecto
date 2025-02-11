import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { finalize, Observable, of, throwError } from "rxjs";
import { catchError, map, switchMap, take, tap } from "rxjs/operators";
import { PARAM } from "@shared/constants/app.const";
import { SignalStore } from "@shared/data-access/signal.store";
import { PermisoRemoteReq } from "./permiso.remote.req";
import { PersistenceService } from "@shared/services/persistence.service";
import { PKEY } from "@shared/constants/persistence.const";

export type IPermisoState = {
    permisoLoading: boolean,
    permisoData: any[],
    permisoError?: any,
}

const initialPermisoState: IPermisoState = {
    permisoLoading: false,
    permisoData: [],
    permisoError: null,
};

@Injectable({ providedIn: 'root' })
export class PermisoStore extends SignalStore<IPermisoState> {

    public readonly vm = this.selectMany([
        "permisoData",
        "permisoLoading",
    ]);

    constructor(
        private _permisoRemoteReq: PermisoRemoteReq,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _persistenceService: PersistenceService,
    ) {
        super();
        this.initialize(initialPermisoState);
    };

    // Obtener permiso desde el store
    public get permisoData() {
        const state = this.vm();
        return state.permisoData;
    };

    // Obtener permiso desde el local store
    public get permisoLocalData() {
        return this._persistenceService.get(PKEY.PERMISOS_LIST) ?? [];
    };

    public async loadAllPermisos() {
        this.patch({ permisoLoading: true, permisoError: null });
        this._permisoRemoteReq.requestGetAllPermisos().pipe(
            tap(async ({data}) => {
                this.patch({ permisoData: data });
                // Guardamos en ls
                this._persistenceService.set(PKEY.PERMISOS_LIST, data);
            }),
            finalize(async () => {
                this.patch({ permisoLoading: false });
            }),
            catchError((error) => {
                return of(this.patch({
                    permisoError: error
                }));
            }),
        ).subscribe();
    };
    
};
