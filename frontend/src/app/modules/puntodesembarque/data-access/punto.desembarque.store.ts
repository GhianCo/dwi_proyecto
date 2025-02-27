import {Injectable} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {finalize, Observable, of, throwError} from "rxjs";
import {catchError, map, switchMap, take, tap} from "rxjs/operators";
import {PARAM} from "@shared/constants/app.const";
import {SignalStore} from "@shared/data-access/signal.store";
import {PuntoDesembarqueRemoteReq} from "./punto.desembarque.remote.req";

export type IPuntoDesembarqueState = {
    puntodesembarqueLoading: boolean,
    puntodesembarqueData: any[],
    puntodesembarquePagination: any,
    puntodesembarqueError: any,

    puntodesembarqueSelected: any,

    filterPuntoDesembarqueToApply: any,

    createUpdateStatePuntoDesembarqueLoading: boolean,
    createUpdateStatePuntoDesembarqueFlashMessage: string,
    createUpdateStatePuntoDesembarqueError: any,
}

const initialPuntoDesembarqueState: IPuntoDesembarqueState = {
    puntodesembarqueLoading: false,
    puntodesembarqueData: [],
    puntodesembarquePagination: null,
    puntodesembarqueError: null,

    puntodesembarqueSelected: null,

    filterPuntoDesembarqueToApply: {
        query: PARAM.VACIO,
        page: 1,
        perPage: 10
    },

    createUpdateStatePuntoDesembarqueLoading: false,
    createUpdateStatePuntoDesembarqueFlashMessage: null,
    createUpdateStatePuntoDesembarqueError: null,
};

@Injectable({providedIn: 'root'})
export class PuntoDesembarqueStore extends SignalStore<IPuntoDesembarqueState> {

    public readonly vm = this.selectMany([
        'filterPuntoDesembarqueToApply',

        'puntodesembarqueLoading',
        'puntodesembarqueData',
        'puntodesembarquePagination',
        'puntodesembarqueError',

        'puntodesembarqueSelected',

        'createUpdateStatePuntoDesembarqueLoading',
        'createUpdateStatePuntoDesembarqueFlashMessage',
        'createUpdateStatePuntoDesembarqueError',
    ]);

    constructor(
        private _puntodesembarqueRemoteReq: PuntoDesembarqueRemoteReq,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
    ) {
        super();
        this.initialize(initialPuntoDesembarqueState);
    }

    public get puntodesembarqueSelected() {
        const state = this.vm();
        return state.puntodesembarqueSelected
    };

    public get puntodesembarqueData() {
        const state = this.vm();
        return state.puntodesembarqueData
    };

    public get filterPuntoDesembarqueToApply() {
        const state = this.vm();
        return state.filterPuntoDesembarqueToApply
    };

    public async loadSearchPuntoDesembarque(criteria) {
        this.patch({puntodesembarqueLoading: true, puntodesembarqueError: null});
        this._puntodesembarqueRemoteReq.requestSearchPuntoDesembarqueByCriteria(criteria).pipe(
            tap(async ({data, pagination}) => {
                this.patch({
                    puntodesembarqueData: data,
                    puntodesembarquePagination: pagination,
                })
            }),
            finalize(async () => {
                this.patch({puntodesembarqueLoading: false});
            }),
            catchError((error) => {
                return of(this.patch({
                    puntodesembarqueError: error
                }));
            }),
        ).subscribe();
    };

    public loadAllPuntoDesembarque(): Observable<any> {
        this.loadSearchPuntoDesembarque(this.filterPuntoDesembarqueToApply);
        return of(true);
    };

    public addPuntoDesembarque(): Observable<any> {
        const puntodesembarqueData: any[] = [...this.puntodesembarqueData];

        const puntodesembarqueSelected = {
            id: null,
            nombre: null,
            tipo: null,
            ubigeo: null,
            activo: true
        };

        puntodesembarqueData.unshift(puntodesembarqueSelected);

        this.patch({
            puntodesembarqueData,
            puntodesembarqueSelected
        })
        return of(true);
    };

    public searchPuntoDesembarqueById(puntodesembarqueId): Observable<any> {
        return of(this.vm().puntodesembarqueData).pipe(
            take(1),
            map((puntodesembarque) => {

                const puntodesembarqueSelected = puntodesembarque.find(item => item.id == puntodesembarqueId) || null;

                this.patch({
                    puntodesembarqueSelected
                });

                return puntodesembarqueSelected;
            }),
            switchMap((puntodesembarque) => {

                if (!puntodesembarque) {
                    return throwError('No se encontro el puntodesembarque con el id: ' + puntodesembarqueId + '!');
                }

                return of(puntodesembarque);
            })
        );
    };

    public changeQueryInPuntoDesembarque(searchValue) {
        const filterPuntoDesembarqueToApply = this.vm().filterPuntoDesembarqueToApply;
        filterPuntoDesembarqueToApply.query = searchValue;
        if (!searchValue.length) {
            filterPuntoDesembarqueToApply.query = PARAM.VACIO;
        }
        filterPuntoDesembarqueToApply.page = 1;
        this.loadSearchPuntoDesembarque(filterPuntoDesembarqueToApply);
        this.patch({filterPuntoDesembarqueToApply});
    };

    public async loadCreatePuntoDesembarque(formData) {
        this.patch({createUpdateStatePuntoDesembarqueLoading: true, createUpdateStatePuntoDesembarqueError: null});
        delete formData.id;
        formData.activo = formData.activo ? PARAM.ACTIVO : PARAM.INACTIVO;
        this._puntodesembarqueRemoteReq.requestCreatePuntoDesembarque(formData).pipe(
            tap(async ({data, message}) => {
                this.updatePuntoDesembarqueInList(data);
                this.patch({
                    puntodesembarqueSelected: data,
                    createUpdateStatePuntoDesembarqueFlashMessage: message,
                    createUpdateStatePuntoDesembarqueError: null
                });

                this._router.navigate(['gestion/puntodesembarque', data.id], {relativeTo: this._activatedRoute});

                setTimeout(_ => {
                    this.patch({
                        createUpdateStatePuntoDesembarqueFlashMessage: null
                    });
                }, 3000);
            }),
            finalize(async () => {
                this.patch({createUpdateStatePuntoDesembarqueLoading: false});
            }),
            catchError((error) => {
                return of(this.patch({
                    createUpdateStatePuntoDesembarqueError: error
                }));
            }),
        ).subscribe();
    };

    public discardFromListPuntoDesembarqueToCreate() {
        const puntodesembarqueDataStored = this.vm().puntodesembarqueData;
        const puntodesembarqueData = puntodesembarqueDataStored.filter(puntodesembarque => puntodesembarque.id > 0);
        this.patch({
            puntodesembarqueData,
            puntodesembarqueSelected: null
        });
    }

    public updatePuntoDesembarqueInList(puntodesembarqueToUpdate) {
        const puntodesembarqueData = this.vm().puntodesembarqueData;
        const puntodesembarqueIndex = puntodesembarqueData.findIndex(puntodesembarque => !puntodesembarque.id || puntodesembarque.id == puntodesembarqueToUpdate.id);

        if (puntodesembarqueIndex >= 0) {
            puntodesembarqueData[puntodesembarqueIndex] = puntodesembarqueToUpdate;
        }
        this.patch({
            puntodesembarqueData,
        });
    }

    public async loadUpdatePuntoDesembarque(formData) {
        this.patch({createUpdateStatePuntoDesembarqueLoading: true, createUpdateStatePuntoDesembarqueError: null});
        formData.activo = formData.activo ? PARAM.ACTIVO : PARAM.INACTIVO;
        this._puntodesembarqueRemoteReq.requestUpdatePuntoDesembarque(formData).pipe(
            tap(async ({data, message}) => {
                this.updatePuntoDesembarqueInList(data);
                this.patch({
                    puntodesembarqueSelected: data,
                    createUpdateStatePuntoDesembarqueFlashMessage: message,
                });
                setTimeout(_ => {
                    this.patch({
                        createUpdateStatePuntoDesembarqueFlashMessage: null
                    });
                }, 3000);
            }),
            finalize(async () => {
                this.patch({createUpdateStatePuntoDesembarqueLoading: false});
            }),
            catchError((error) => {
                return of(this.patch({
                    createUpdateStatePuntoDesembarqueError: error
                }));
            }),
        ).subscribe();
    };

    public changePageInPuntoDesembarque(pagination: any) {
        const filterPuntoDesembarqueToApply = this.vm().filterPuntoDesembarqueToApply;
        filterPuntoDesembarqueToApply.page = pagination.pageIndex + 1;
        filterPuntoDesembarqueToApply.perPage = pagination.pageSize;
        this.loadSearchPuntoDesembarque(filterPuntoDesembarqueToApply);
        this.patch({filterPuntoDesembarqueToApply});
    };
}
