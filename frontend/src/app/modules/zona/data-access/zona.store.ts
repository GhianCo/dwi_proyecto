import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { finalize, Observable, of, throwError } from "rxjs";
import { catchError, map, switchMap, take, tap } from "rxjs/operators";
import { PARAM } from "@shared/constants/app.const";
import { SignalStore } from "@shared/data-access/signal.store";
import { ZonaRemoteReq } from "./zona.remote.req";

export type ITipoDocumentoState = {
    zonaLoading: boolean,
    zonaData: any[],
    zonaPagination: any,
    zonaError: any,

    zonaSelected: any,

    filterZonaToApply: any,

    createUpdateStateZonaLoading: boolean,
    createUpdateStateZonaFlashMessage: string,
    createUpdateStateZonaError: any,
}

const initialTipoDocumentoState: ITipoDocumentoState = {
    zonaLoading: false,
    zonaData: [],
    zonaPagination: null,
    zonaError: null,

    zonaSelected: null,

    filterZonaToApply: {
        query: PARAM.UNDEFINED,
        page: 1,
        perPage: 10
    },

    createUpdateStateZonaLoading: false,
    createUpdateStateZonaFlashMessage: null,
    createUpdateStateZonaError: null,
};

@Injectable({ providedIn: 'root' })
export class ZonaStore extends SignalStore<ITipoDocumentoState> {

    public readonly vm = this.selectMany([
        "zonaLoading",
        "zonaData",
        "zonaPagination",
        "zonaError",

        "zonaSelected",

        "filterZonaToApply",

        "createUpdateStateZonaLoading",
        "createUpdateStateZonaFlashMessage",
        "createUpdateStateZonaError",
    ]);

    constructor(
        private _zonaRemoteReq: ZonaRemoteReq,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
    ) {
        super();
        this.initialize(initialTipoDocumentoState);
    }

    public get zonaSelected() {
        const state = this.vm();
        return state.zonaSelected
    };

    public get zonaData() {
        const state = this.vm();
        return state.zonaData
    };

    public get filterZonaToApply() {
        const state = this.vm();
        return state.filterZonaToApply
    };

    public async loadSearchTipoDocumento(criteria) {
        this.patch({ zonaLoading: true, zonaError: null });
        this._zonaRemoteReq.requestSearchZonaByCriteria(criteria).pipe(
            tap(async ({data, pagination}) => {
                this.patch({
                    zonaData: data,
                    zonaPagination: pagination,
                })
            }),
            finalize(async () => {
                this.patch({ zonaLoading: false });
            }),
            catchError((error) => {
                return of(this.patch({
                    zonaError: error
                }));
            }),
        ).subscribe();
    };  

    public loadAllZonaStore(): Observable<any> {
        this.loadSearchTipoDocumento(this.filterZonaToApply);
        return of(true);
    };

    public addZona(): Observable<any> {
        const zonaData: any[] = [...this.zonaData];

        const zonaSelected = {
            zona_id: null,
            zona_descripcion: null,
            zona_activo: true,
        };

        zonaData.unshift(zonaSelected);

        this.patch({
            zonaData,
            zonaSelected
        })
        return of(true);
    };

    public searchZonaById(zonaId): Observable<any> {
        return of(this.vm().zonaData).pipe(
            take(1),
            map((tipoDocumento) => {
                const zonaSelected = tipoDocumento.find(item => item.zona_id == zonaId) || null;

                this.patch({
                    zonaSelected
                });

                return zonaSelected;
            }),
            switchMap((zona) => {
                if (!zona) {
                    return throwError(() => 'No se encontro el tipodocumento con el id: ' + zonaId + '!');
                }
                return of(zona);
            })
        );
    };

    public changeQueryInZona(searchValue) {
        const filterZonaToApply = this.vm().filterZonaToApply;
        filterZonaToApply.query = searchValue;
        if (!searchValue.length) {
            filterZonaToApply.query = PARAM.UNDEFINED;
        }
        filterZonaToApply.page = 1;
        this.loadSearchTipoDocumento(filterZonaToApply);
        this.patch({ filterZonaToApply });
    };

    public async loadCreateZona(formData) {
        this.patch({
            // createUpdateStateTipoDocumentoLoading: true, 
            createUpdateStateZonaLoading: true, 

            // createUpdateStateTipoDocumentoError: null 
            createUpdateStateZonaError: null 
        });
        // formData.zona_estado = formData.zona_activo ? PARAM.ACTIVO : PARAM.INACTIVO;
        this._zonaRemoteReq.requestCreateZona(formData).pipe(
            tap(async ({ data, message }) => {
                this.updateZonaInList(data);
                this.patch({
                    zonaSelected: data,
                    createUpdateStateZonaFlashMessage: message,
                    createUpdateStateZonaError: null
                });

                this._router.navigate(['gestion/zona', data.zona_id], { relativeTo: this._activatedRoute });

                setTimeout(_ => {
                    this.patch({
                        // createUpdateStateTipoDocumentoFlashMessage: null
                        createUpdateStateZonaFlashMessage: null
                    });
                }, 3000);
            }),
            finalize(async () => {
                this.patch({ 
                    // createUpdateStateTipoDocumentoLoading: false 
                    createUpdateStateZonaLoading: false 
                });
            }),
            catchError((error) => {
                return of(this.patch({
                    // createUpdateStateTipoDocumentoError: error
                    createUpdateStateZonaError: error
                }));
            }),
        ).subscribe();
    };

    public discardFromListZonaToCreate() {
        const zonaDataStored = this.vm().zonaData;
        const zonaData = zonaDataStored.filter((zonaData) => zonaData.zona_id > 0);
        this.patch({
            zonaData,
            zonaSelected: null
        });
    }

    public updateZonaInList(zonaToUpdate: any) {
        const zonaData = this.vm().zonaData;
        const zonaIndex = zonaData.findIndex(tipoDocumento => !tipoDocumento.tipodocumento_id || tipoDocumento.tipodocumento_id == zonaToUpdate.tipodocumento_id);

        if (zonaIndex >= 0) {
            zonaData[zonaIndex] = zonaToUpdate;
        }
        this.patch({
            zonaData,
        });
    }

    public async loadUpdateZona(formData: any) {
        this.patch({ createUpdateStateZonaLoading: true, createUpdateStateZonaError: null });

        formData.zona_estado = formData.zona_activo ? PARAM.ACTIVO : PARAM.INACTIVO;

        this._zonaRemoteReq.requestUpdateZona(formData).pipe(
            tap(async ({ data, message }) => {
                this.updateZonaInList(data);
                this.patch({
                    zonaSelected: data,
                    // createUpdateStateTipoDocumentoFlashMessage: message,
                    createUpdateStateZonaFlashMessage: message,
                });
                setTimeout(_ => {
                    this.patch({
                        // createUpdateStateTipoDocumentoFlashMessage: null,
                        createUpdateStateZonaFlashMessage: null
                    });
                }, 3000);
            }),
            finalize(async () => {
                this.patch({ createUpdateStateZonaLoading: false });
            }),
            catchError((error) => {
                return of(this.patch({
                    // createUpdateStateTipoDocumentoError: error,
                    createUpdateStateZonaError: error
                }));
            }),
        ).subscribe();
    };

    public changePageInTipoDocumento(pagination: any) {
        const filterZonaToApply = this.vm().filterZonaToApply;
        filterZonaToApply.page = pagination.pageIndex + 1;
        filterZonaToApply.perPage = pagination.pageSize;
        this.loadSearchTipoDocumento(filterZonaToApply);
        this.patch({ filterZonaToApply });
    };

    
}
