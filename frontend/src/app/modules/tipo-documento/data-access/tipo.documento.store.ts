import {Injectable} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {finalize, Observable, of, throwError} from "rxjs";
import {catchError, map, switchMap, take, tap} from "rxjs/operators";
import {PARAM} from "@shared/constants/app.const";
import {SignalStore} from "@shared/data-access/signal.store";
import {TipoDocumentoRemoteReq} from "./tipo.documento.remote.req";

export type ITipoDocumentoState = {
    tipoDocumentoLoading: boolean,
    tipoDocumentoData: any[],
    tipoDocumentoPagination: any,
    tipoDocumentoError: any,

    tipoDocumentoSelected: any,

    filterTipoDocumentoToApply: any,

    createUpdateStateTipoDocumentoLoading: boolean,
    createUpdateStateTipoDocumentoFlashMessage: string,
    createUpdateStateTipoDocumentoError: any,
}

const initialTipoDocumentoState: ITipoDocumentoState = {
    tipoDocumentoLoading: false,
    tipoDocumentoData: [],
    tipoDocumentoPagination: null,
    tipoDocumentoError: null,

    tipoDocumentoSelected: null,

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
export class TipoDocumentoStore extends SignalStore<ITipoDocumentoState> {

    public readonly vm = this.selectMany([
        'filterTipoDocumentoToApply',

        'tipoDocumentoLoading',
        'tipoDocumentoData',
        'tipoDocumentoPagination',
        'tipoDocumentoError',

        'tipoDocumentoSelected',

        'createUpdateStateTipoDocumentoLoading',
        'createUpdateStateTipoDocumentoFlashMessage',
        'createUpdateStateTipoDocumentoError',
    ]);

    constructor(
        private _tipoDocumentoRemoteReq: TipoDocumentoRemoteReq,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
    ) {
        super();
        this.initialize(initialTipoDocumentoState);
    }

    public get tipoDocumentoSelected() {
        const state = this.vm();
        return state.tipoDocumentoSelected
    };

    public get tipoDocumentoData() {
        const state = this.vm();
        return state.tipoDocumentoData
    };

    public get filterTipoDocumentoToApply() {
        const state = this.vm();
        return state.filterTipoDocumentoToApply
    };

    public async loadSearchTipoDocumento(criteria) {
        this.patch({tipoDocumentoLoading: true, tipoDocumentoError: null});
        this._tipoDocumentoRemoteReq.requestSearchTipoDocumentoByCriteria(criteria).pipe(
            tap(async ({data, pagination}) => {
                this.patch({
                    tipoDocumentoData: data,
                    tipoDocumentoPagination: pagination,
                })
            }),
            finalize(async () => {
                this.patch({tipoDocumentoLoading: false});
            }),
            catchError((error) => {
                return of(this.patch({
                    tipoDocumentoError: error
                }));
            }),
        ).subscribe();
    };

    public loadAllTipoDocumento(): Observable<any> {
        this.loadSearchTipoDocumento(this.filterTipoDocumentoToApply);
        return of(true);
    };

    public addTipoDocumento(): Observable<any> {
        const tipoDocumentoData: any[] = [...this.tipoDocumentoData];

        const tipoDocumentoSelected = {
            tipodocumento_id: null,
            tipodocumento_descripcion: null,
            tipodocumento_activo: true
        };

        tipoDocumentoData.unshift(tipoDocumentoSelected);

        this.patch({
            tipoDocumentoData,
            tipoDocumentoSelected
        })
        return of(true);
    };

    public searchTipoDocumentoById(tipoDocumentoId): Observable<any> {
        return of(this.vm().tipoDocumentoData).pipe(
            take(1),
            map((tipoDocumento) => {

                const tipoDocumentoSelected = tipoDocumento.find(item => item.tipodocumento_id == tipoDocumentoId) || null;

                this.patch({
                    tipoDocumentoSelected
                });

                return tipoDocumentoSelected;
            }),
            switchMap((tipoDocumento) => {

                if (!tipoDocumento) {
                    return throwError('No se encontro el tipodocumento con el id: ' + tipoDocumentoId + '!');
                }

                return of(tipoDocumento);
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
        this._tipoDocumentoRemoteReq.requestCreateTipoDocumento(formData).pipe(
            tap(async ({data, message}) => {
                this.updateTipoDocumentoInList(data);
                this.patch({
                    tipoDocumentoSelected: data,
                    createUpdateStateTipoDocumentoFlashMessage: message,
                    createUpdateStateTipoDocumentoError: null
                });

                this._router.navigate(['gestion/tipo-documento', data.tipodocumento_id], {relativeTo: this._activatedRoute});

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
        const tipoDocumentoDataStored = this.vm().tipoDocumentoData;
        const tipoDocumentoData = tipoDocumentoDataStored.filter(tipodocumento => tipodocumento.tipodocumento_id > 0);
        this.patch({
            tipoDocumentoData,
            tipoDocumentoSelected: null
        });
    }

    public updateTipoDocumentoInList(tipoDocumentoToUpdate) {
        const tipoDocumentoData = this.vm().tipoDocumentoData;
        const tipoDocumentoIndex = tipoDocumentoData.findIndex(tipoDocumento => !tipoDocumento.tipodocumento_id || tipoDocumento.tipodocumento_id == tipoDocumentoToUpdate.tipodocumento_id);

        if (tipoDocumentoIndex >= 0) {
            tipoDocumentoData[tipoDocumentoIndex] = tipoDocumentoToUpdate;
        }
        this.patch({
            tipoDocumentoData,
        });
    }

    public async loadUpdateTipoDocumento(formData) {
        this.patch({createUpdateStateTipoDocumentoLoading: true, createUpdateStateTipoDocumentoError: null});
        // formData.tipodocumento_estado = formData.tipodocumento_activo ? PARAM.ACTIVO : PARAM.INACTIVO;
        this._tipoDocumentoRemoteReq.requestUpdateTipoDocumento(formData).pipe(
            tap(async ({data, message}) => {
                this.updateTipoDocumentoInList(data);
                this.patch({
                    tipoDocumentoSelected: data,
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
