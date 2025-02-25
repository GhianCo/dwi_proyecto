import {Injectable} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {finalize, Observable, of, throwError} from "rxjs";
import {catchError, map, switchMap, take, tap} from "rxjs/operators";
import {PARAM} from "@shared/constants/app.const";
import {SignalStore} from "@shared/data-access/signal.store";
import {PresentacionRemoteReq} from "./presentacion.remote.req";

export type IPresentacionState = {
    presentacionLoading: boolean,
    presentacionData: any[],
    presentacionPagination: any,
    presentacionError: any,

    presentacionSelected: any,

    filterPresentacionToApply: any,

    createUpdateStatePresentacionLoading: boolean,
    createUpdateStatePresentacionFlashMessage: string,
    createUpdateStatePresentacionError: any,
}

const initialPresentacionState: IPresentacionState = {
    presentacionLoading: false,
    presentacionData: [],
    presentacionPagination: null,
    presentacionError: null,

    presentacionSelected: null,

    filterPresentacionToApply: {
        query: PARAM.VACIO,
        page: 1,
        perPage: 10
    },

    createUpdateStatePresentacionLoading: false,
    createUpdateStatePresentacionFlashMessage: null,
    createUpdateStatePresentacionError: null,
};

@Injectable({providedIn: 'root'})
export class PresentacionStore extends SignalStore<IPresentacionState> {

    public readonly vm = this.selectMany([
        'filterPresentacionToApply',

        'presentacionLoading',
        'presentacionData',
        'presentacionPagination',
        'presentacionError',

        'presentacionSelected',

        'createUpdateStatePresentacionLoading',
        'createUpdateStatePresentacionFlashMessage',
        'createUpdateStatePresentacionError',
    ]);

    constructor(
        private _presentacionRemoteReq: PresentacionRemoteReq,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
    ) {
        super();
        this.initialize(initialPresentacionState);
    }

    public get presentacionSelected() {
        const state = this.vm();
        return state.presentacionSelected
    };

    public get presentacionData() {
        const state = this.vm();
        return state.presentacionData
    };

    public get filterPresentacionToApply() {
        const state = this.vm();
        return state.filterPresentacionToApply
    };

    public async loadSearchPresentacion(criteria) {
        this.patch({presentacionLoading: true, presentacionError: null});
        this._presentacionRemoteReq.requestSearchPresentacionByCriteria(criteria).pipe(
            tap(async ({data, pagination}) => {
                this.patch({
                    presentacionData: data,
                    presentacionPagination: pagination,
                })
            }),
            finalize(async () => {
                this.patch({presentacionLoading: false});
            }),
            catchError((error) => {
                return of(this.patch({
                    presentacionError: error
                }));
            }),
        ).subscribe();
    };

    public loadAllPresentacion(): Observable<any> {
        this.loadSearchPresentacion(this.filterPresentacionToApply);
        return of(true);
    };

    public addPresentacion(): Observable<any> {
        const presentacionData: any[] = [...this.presentacionData];

        const presentacionSelected = {
            id: null,
            nombre: null,
            peso_promedio: null,
            activa: true
        };

        presentacionData.unshift(presentacionSelected);

        this.patch({
            presentacionData,
            presentacionSelected
        })
        return of(true);
    };

    public searchPresentacionById(presentacionId): Observable<any> {
        return of(this.vm().presentacionData).pipe(
            take(1),
            map((presentacion) => {

                const presentacionSelected = presentacion.find(item => item.id == presentacionId) || null;

                this.patch({
                    presentacionSelected
                });

                return presentacionSelected;
            }),
            switchMap((presentacion) => {

                if (!presentacion) {
                    return throwError('No se encontro el presentacion con el id: ' + presentacionId + '!');
                }

                return of(presentacion);
            })
        );
    };

    public changeQueryInPresentacion(searchValue) {
        const filterPresentacionToApply = this.vm().filterPresentacionToApply;
        filterPresentacionToApply.query = searchValue;
        if (!searchValue.length) {
            filterPresentacionToApply.query = PARAM.UNDEFINED;
        }
        filterPresentacionToApply.page = 1;
        this.loadSearchPresentacion(filterPresentacionToApply);
        this.patch({filterPresentacionToApply});
    };

    public async loadCreatePresentacion(formData) {
        this.patch({createUpdateStatePresentacionLoading: true, createUpdateStatePresentacionError: null});
        delete formData.id;
        formData.activa = formData.activa ? PARAM.ACTIVO : PARAM.INACTIVO;
        this._presentacionRemoteReq.requestCreatePresentacion(formData).pipe(
            tap(async ({data, message}) => {
                this.updatePresentacionInList(data);
                this.patch({
                    presentacionSelected: data,
                    createUpdateStatePresentacionFlashMessage: message,
                    createUpdateStatePresentacionError: null
                });

                this._router.navigate(['gestion/presentacion', data.id], {relativeTo: this._activatedRoute});

                setTimeout(_ => {
                    this.patch({
                        createUpdateStatePresentacionFlashMessage: null
                    });
                }, 3000);
            }),
            finalize(async () => {
                this.patch({createUpdateStatePresentacionLoading: false});
            }),
            catchError((error) => {
                return of(this.patch({
                    createUpdateStatePresentacionError: error
                }));
            }),
        ).subscribe();
    };

    public discardFromListPresentacionToCreate() {
        const presentacionDataStored = this.vm().presentacionData;
        const presentacionData = presentacionDataStored.filter(presentacion => presentacion.id > 0);
        this.patch({
            presentacionData,
            presentacionSelected: null
        });
    }

    public updatePresentacionInList(presentacionToUpdate) {
        const presentacionData = this.vm().presentacionData;
        const presentacionIndex = presentacionData.findIndex(presentacion => !presentacion.id || presentacion.id == presentacionToUpdate.id);

        if (presentacionIndex >= 0) {
            presentacionData[presentacionIndex] = presentacionToUpdate;
        }
        this.patch({
            presentacionData,
        });
    }

    public async loadUpdatePresentacion(formData) {
        this.patch({createUpdateStatePresentacionLoading: true, createUpdateStatePresentacionError: null});
        formData.activa = formData.activa ? PARAM.ACTIVO : PARAM.INACTIVO;
        this._presentacionRemoteReq.requestUpdatePresentacion(formData).pipe(
            tap(async ({data, message}) => {
                this.updatePresentacionInList(data);
                this.patch({
                    presentacionSelected: data,
                    createUpdateStatePresentacionFlashMessage: message,
                });
                setTimeout(_ => {
                    this.patch({
                        createUpdateStatePresentacionFlashMessage: null
                    });
                }, 3000);
            }),
            finalize(async () => {
                this.patch({createUpdateStatePresentacionLoading: false});
            }),
            catchError((error) => {
                return of(this.patch({
                    createUpdateStatePresentacionError: error
                }));
            }),
        ).subscribe();
    };

    public changePageInPresentacion(pagination: any) {
        const filterPresentacionToApply = this.vm().filterPresentacionToApply;
        filterPresentacionToApply.page = pagination.pageIndex + 1;
        filterPresentacionToApply.perPage = pagination.pageSize;
        this.loadSearchPresentacion(filterPresentacionToApply);
        this.patch({filterPresentacionToApply});
    };
}
