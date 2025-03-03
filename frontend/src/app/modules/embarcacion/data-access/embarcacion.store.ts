import {Injectable} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {finalize, Observable, of, throwError} from "rxjs";
import {catchError, map, switchMap, take, tap} from "rxjs/operators";
import {PARAM} from "@shared/constants/app.const";
import {SignalStore} from "@shared/data-access/signal.store";
import {EmbarcacionRemoteReq} from "./embarcacion.remote.req";

export type IEmbarcacionState = {
    embarcacionLoading: boolean,
    embarcacionData: any[],
    embarcacionPagination: any,
    embarcacionError: any,

    embarcacionSelected: any,

    filterEmbarcacionToApply: any,

    createUpdateStateEmbarcacionLoading: boolean,
    createUpdateStateEmbarcacionFlashMessage: string,
    createUpdateStateEmbarcacionError: any,
}

const initialEmbarcacionState: IEmbarcacionState = {
    embarcacionLoading: false,
    embarcacionData: [],
    embarcacionPagination: null,
    embarcacionError: null,

    embarcacionSelected: null,

    filterEmbarcacionToApply: {
        query: PARAM.VACIO,
        page: 1,
        perPage: 10
    },

    createUpdateStateEmbarcacionLoading: false,
    createUpdateStateEmbarcacionFlashMessage: null,
    createUpdateStateEmbarcacionError: null,
};

@Injectable({providedIn: 'root'})
export class EmbarcacionStore extends SignalStore<IEmbarcacionState> {

    public readonly vm = this.selectMany([
        'filterEmbarcacionToApply',

        'embarcacionLoading',
        'embarcacionData',
        'embarcacionPagination',
        'embarcacionError',

        'embarcacionSelected',

        'createUpdateStateEmbarcacionLoading',
        'createUpdateStateEmbarcacionFlashMessage',
        'createUpdateStateEmbarcacionError',
    ]);

    constructor(
        private _embarcacionRemoteReq: EmbarcacionRemoteReq,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
    ) {
        super();
        this.initialize(initialEmbarcacionState);
    }

    public get embarcacionSelected() {
        const state = this.vm();
        return state.embarcacionSelected
    };

    public get embarcacionData() {
        const state = this.vm();
        return state.embarcacionData
    };

    public get filterEmbarcacionToApply() {
        const state = this.vm();
        return state.filterEmbarcacionToApply
    };

    public async loadSearchEmbarcacion(criteria) {
        this.patch({embarcacionLoading: true, embarcacionError: null});
        this._embarcacionRemoteReq.requestSearchEmbarcacionByCriteria(criteria).pipe(
            tap(async ({data, pagination}) => {
                this.patch({
                    embarcacionData: data,
                    embarcacionPagination: pagination,
                })
            }),
            finalize(async () => {
                this.patch({embarcacionLoading: false});
            }),
            catchError((error) => {
                return of(this.patch({
                    embarcacionError: error
                }));
            }),
        ).subscribe();
    };

    public loadAllEmbarcacion(): Observable<any> {
        this.loadSearchEmbarcacion(this.filterEmbarcacionToApply);
        return of(true);
    };

    public addEmbarcacion(): Observable<any> {
        const embarcacionData: any[] = [...this.embarcacionData];

        const embarcacionSelected = {
            id: null,
            persona_id: null,
            nombre: null,
            matricula: null,
            capacidad_bodega: null,
            permiso_pesca: null,
            regimen: null,
            activa: null
        };

        embarcacionData.unshift(embarcacionSelected);

        this.patch({
            embarcacionData,
            embarcacionSelected
        })
        return of(true);
    };

    public searchEmbarcacionById(embarcacionId): Observable<any> {
        return of(this.vm().embarcacionData).pipe(
            take(1),
            map((embarcacion) => {

                const embarcacionSelected = embarcacion.find(item => item.id == embarcacionId) || null;

                this.patch({
                    embarcacionSelected
                });

                return embarcacionSelected;
            }),
            switchMap((embarcacion) => {

                if (!embarcacion) {
                    return throwError('No se encontró la embarcación con el id: ' + embarcacionId + '!');
                }

                return of(embarcacion);
            })
        );
    };

    public changeQueryInEmbarcacion(searchValue) {
        const filterEmbarcacionToApply = this.vm().filterEmbarcacionToApply;
        filterEmbarcacionToApply.query = searchValue;
        if (!searchValue.length) {
            filterEmbarcacionToApply.query = PARAM.VACIO;
        }
        filterEmbarcacionToApply.page = 1;
        this.loadSearchEmbarcacion(filterEmbarcacionToApply);
        this.patch({filterEmbarcacionToApply});
    };

    public async loadCreateEmbarcacion(formData) {
        this.patch({createUpdateStateEmbarcacionLoading: true, createUpdateStateEmbarcacionError: null});
        delete formData.id;
        formData.activo = formData.activo ? PARAM.ACTIVO : PARAM.INACTIVO;
        this._embarcacionRemoteReq.requestCreateEmbarcacion(formData).pipe(
            tap(async ({data, message}) => {
                this.updateEmbarcacionInList(data);
                this.patch({
                    embarcacionSelected: data,
                    createUpdateStateEmbarcacionFlashMessage: message,
                    createUpdateStateEmbarcacionError: null
                });

                this._router.navigate(['gestion/embarcacion', data.id], {relativeTo: this._activatedRoute});

                setTimeout(_ => {
                    this.patch({
                        createUpdateStateEmbarcacionFlashMessage: null
                    });
                }, 3000);
            }),
            finalize(async () => {
                this.patch({createUpdateStateEmbarcacionLoading: false});
            }),
            catchError((error) => {
                return of(this.patch({
                    createUpdateStateEmbarcacionError: error
                }));
            }),
        ).subscribe();
    };

    public discardFromListEmbarcacionToCreate() {
        const embarcacionDataStored = this.vm().embarcacionData;
        const embarcacionData = embarcacionDataStored.filter(embarcacion => embarcacion.id > 0);
        this.patch({
            embarcacionData,
            embarcacionSelected: null
        });
    }

    public updateEmbarcacionInList(embarcacionToUpdate) {
        const embarcacionData = this.vm().embarcacionData;
        const embarcacionIndex = embarcacionData.findIndex(embarcacion => !embarcacion.id || embarcacion.id == embarcacionToUpdate.id);

        if (embarcacionIndex >= 0) {
            embarcacionData[embarcacionIndex] = embarcacionToUpdate;
        }
        this.patch({
            embarcacionData,
        });
    }

    public async loadUpdateEmbarcacion(formData) {
        this.patch({createUpdateStateEmbarcacionLoading: true, createUpdateStateEmbarcacionError: null});
        formData.activo = formData.activo ? PARAM.ACTIVO : PARAM.INACTIVO;
        this._embarcacionRemoteReq.requestUpdateEmbarcacion(formData).pipe(
            tap(async ({data, message}) => {
                this.updateEmbarcacionInList(data);
                this.patch({
                    embarcacionSelected: data,
                    createUpdateStateEmbarcacionFlashMessage: message,
                });
                setTimeout(_ => {
                    this.patch({
                        createUpdateStateEmbarcacionFlashMessage: null
                    });
                }, 3000);
            }),
            finalize(async () => {
                this.patch({createUpdateStateEmbarcacionLoading: false});
            }),
            catchError((error) => {
                return of(this.patch({
                    createUpdateStateEmbarcacionError: error
                }));
            }),
        ).subscribe();
    };

    public changePageInEmbarcacion(pagination: any) {
        const filterEmbarcacionToApply = this.vm().filterEmbarcacionToApply;
        filterEmbarcacionToApply.page = pagination.pageIndex + 1;
        filterEmbarcacionToApply.perPage = pagination.pageSize;
        this.loadSearchEmbarcacion(filterEmbarcacionToApply);
        this.patch({filterEmbarcacionToApply});
    };
}
