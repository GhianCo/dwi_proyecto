import {Injectable} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {finalize, Observable, of, throwError} from "rxjs";
import {catchError, map, switchMap, take, tap} from "rxjs/operators";
import {PARAM} from "@shared/constants/app.const";
import {SignalStore} from "@shared/data-access/signal.store";
import {PresentacionRemoteReq} from "./presentacion.remote.req";

export type ITipoDocumentoState = {
    presentacionLoading: boolean,
    presentacionData: any[],
    presentacionPagination: any,
    presentacionError: any,

    presentacionSelected: any,

    filterTipoDocumentoToApply: any,

    createUpdateStateTipoDocumentoLoading: boolean,
    createUpdateStateTipoDocumentoFlashMessage: string,
    createUpdateStateTipoDocumentoError: any,
}

const initialTipoDocumentoState: ITipoDocumentoState = {
    presentacionLoading: false,
    presentacionData: [],
    presentacionPagination: null,
    presentacionError: null,

    presentacionSelected: null,

    filterTipoDocumentoToApply: {
        query: PARAM.UNDEFINED,
        page: 1,
        perPage: 10
    },

    createUpdateStateTipoDocumentoLoading: false,
    createUpdateStateTipoDocumentoFlashMessage: null,
    createUpdateStateTipoDocumentoError: null,
};

@Injectable({providedIn: 'root'})
export class PresentacionStore extends SignalStore<ITipoDocumentoState> {

    public readonly vm = this.selectMany([
        'filterTipoDocumentoToApply',

        'presentacionLoading',
        'presentacionData',
        'presentacionPagination',
        'presentacionError',

        'presentacionSelected',

        'createUpdateStateTipoDocumentoLoading',
        'createUpdateStateTipoDocumentoFlashMessage',
        'createUpdateStateTipoDocumentoError',
    ]);

    constructor(
        private _presentacionRemoteReq: PresentacionRemoteReq,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
    ) {
        super();
        this.initialize(initialTipoDocumentoState);
    }

    public get presentacionSelected() {
        const state = this.vm();
        return state.presentacionSelected
    };

    public get presentacionData() {
        const state = this.vm();
        return state.presentacionData
    };

    public get filterTipoDocumentoToApply() {
        const state = this.vm();
        return state.filterTipoDocumentoToApply
    };

    public async loadSearchTipoDocumento(criteria) {
        this.patch({presentacionLoading: true, presentacionError: null});
        this._presentacionRemoteReq.requestSearchTipoDocumentoByCriteria(criteria).pipe(
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

    public loadAllTipoDocumento(): Observable<any> {
        this.loadSearchTipoDocumento(this.filterTipoDocumentoToApply);
        return of(true);
    };

    public addTipoDocumento(): Observable<any> {
        const presentacionData: any[] = [...this.presentacionData];

        const presentacionSelected = {
            tipodocumento_id: null,
            tipodocumento_descripcion: null,
            tipodocumento_activo: true
        };

        presentacionData.unshift(presentacionSelected);

        this.patch({
            presentacionData,
            presentacionSelected
        })
        return of(true);
    };

    public searchTipoDocumentoById(presentacionId): Observable<any> {
        return of(this.vm().presentacionData).pipe(
            take(1),
            map((presentacion) => {

                const presentacionSelected = presentacion.find(item => item.tipodocumento_id == presentacionId) || null;

                this.patch({
                    presentacionSelected
                });

                return presentacionSelected;
            }),
            switchMap((presentacion) => {

                if (!presentacion) {
                    return throwError('No se encontro el tipodocumento con el id: ' + presentacionId + '!');
                }

                return of(presentacion);
            })
        );
    };

    public changeQueryInTipoDocumento(searchValue) {
        const filterTipoDocumentoToApply = this.vm().filterTipoDocumentoToApply;
        filterTipoDocumentoToApply.query = searchValue;
        if (!searchValue.length) {
            filterTipoDocumentoToApply.query = PARAM.UNDEFINED;
        }
        filterTipoDocumentoToApply.page = 1;
        this.loadSearchTipoDocumento(filterTipoDocumentoToApply);
        this.patch({filterTipoDocumentoToApply});
    };

    public async loadCreateTipoDocumento(formData) {
        this.patch({createUpdateStateTipoDocumentoLoading: true, createUpdateStateTipoDocumentoError: null});
        formData.tipodocumento_fiscalizado = 1;
        formData.tipodocumento_estado = formData.tipodocumento_activo ? PARAM.ACTIVO : PARAM.INACTIVO;
        this._presentacionRemoteReq.requestCreateTipoDocumento(formData).pipe(
            tap(async ({data, message}) => {
                this.updateTipoDocumentoInList(data);
                this.patch({
                    presentacionSelected: data,
                    createUpdateStateTipoDocumentoFlashMessage: message,
                    createUpdateStateTipoDocumentoError: null
                });

                this._router.navigate(['gestion/presentacion', data.tipodocumento_id], {relativeTo: this._activatedRoute});

                setTimeout(_ => {
                    this.patch({
                        createUpdateStateTipoDocumentoFlashMessage: null
                    });
                }, 3000);
            }),
            finalize(async () => {
                this.patch({createUpdateStateTipoDocumentoLoading: false});
            }),
            catchError((error) => {
                return of(this.patch({
                    createUpdateStateTipoDocumentoError: error
                }));
            }),
        ).subscribe();
    };

    public discardFromListTipoDocumentoToCreate() {
        const presentacionDataStored = this.vm().presentacionData;
        const presentacionData = presentacionDataStored.filter(tipodocumento => tipodocumento.tipodocumento_id > 0);
        this.patch({
            presentacionData,
            presentacionSelected: null
        });
    }

    public updateTipoDocumentoInList(presentacionToUpdate) {
        const presentacionData = this.vm().presentacionData;
        const presentacionIndex = presentacionData.findIndex(presentacion => !presentacion.tipodocumento_id || presentacion.tipodocumento_id == presentacionToUpdate.tipodocumento_id);

        if (presentacionIndex >= 0) {
            presentacionData[presentacionIndex] = presentacionToUpdate;
        }
        this.patch({
            presentacionData,
        });
    }

    public async loadUpdateTipoDocumento(formData) {
        this.patch({createUpdateStateTipoDocumentoLoading: true, createUpdateStateTipoDocumentoError: null});
        // formData.tipodocumento_estado = formData.tipodocumento_activo ? PARAM.ACTIVO : PARAM.INACTIVO;
        this._presentacionRemoteReq.requestUpdateTipoDocumento(formData).pipe(
            tap(async ({data, message}) => {
                this.updateTipoDocumentoInList(data);
                this.patch({
                    presentacionSelected: data,
                    createUpdateStateTipoDocumentoFlashMessage: message,
                });
                setTimeout(_ => {
                    this.patch({
                        createUpdateStateTipoDocumentoFlashMessage: null
                    });
                }, 3000);
            }),
            finalize(async () => {
                this.patch({createUpdateStateTipoDocumentoLoading: false});
            }),
            catchError((error) => {
                return of(this.patch({
                    createUpdateStateTipoDocumentoError: error
                }));
            }),
        ).subscribe();
    };

    public changePageInTipoDocumento(pagination: any) {
        const filterTipoDocumentoToApply = this.vm().filterTipoDocumentoToApply;
        filterTipoDocumentoToApply.page = pagination.pageIndex + 1;
        filterTipoDocumentoToApply.perPage = pagination.pageSize;
        this.loadSearchTipoDocumento(filterTipoDocumentoToApply);
        this.patch({filterTipoDocumentoToApply});
    };
}
