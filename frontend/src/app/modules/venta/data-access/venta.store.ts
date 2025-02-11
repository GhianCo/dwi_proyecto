import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { finalize, Observable, of, throwError } from "rxjs";
import { catchError, map, switchMap, take, tap } from "rxjs/operators";
import { PARAM } from "@shared/constants/app.const";
import { SignalStore } from "@shared/data-access/signal.store";
import { TipoDocumentoRemoteReq } from "app/modules/tipo-documento/data-access/tipo.documento.remote.req";
import { UsuarioRemoteReq } from "app/modules/usuario/data-access/usuario.remote.req";
import { VentaRemoteReq } from "./venta.remote.req";
import { DateUtilityService } from "@shared/services/date-utility.service";

export type IVentaState = {
    ventaLoading: boolean,
    ventaData: any[],
    ventaPagination: any,
    ventaError: any,
    ventaCreada: boolean,

    ventaSelected: any,
    ventaLoadingSelected: boolean,

    filterVentaToApply: any,

    createUpdateStateVentaLoading: boolean,
    createUpdateStateVentaFlashMessage: string,
    createUpdateStateVentaError: any,
}

const initialVentaState: IVentaState = {
    ventaLoading: false,
    ventaData: [],
    ventaPagination: null,
    ventaError: null,
    ventaCreada: false,

    ventaSelected: null,
    ventaLoadingSelected: false,

    filterVentaToApply: {
        cliente: null,
        page: 1,
        perPage: 10,
        ventaSerie: null,
        ventaCorrelativo: null,
    },    

    createUpdateStateVentaLoading: false,
    createUpdateStateVentaFlashMessage: null,
    createUpdateStateVentaError: null,
};

@Injectable({ providedIn: 'root' })
export class VentaStore extends SignalStore<IVentaState> {

    public readonly vm = this.selectMany([
        'ventaLoading',
        'ventaData',
        'ventaCreada',
        'ventaPagination',
        'ventaSelected',
        "ventaLoadingSelected",
        'filterVentaToApply',
        'createUpdateStateVentaLoading',
        'createUpdateStateVentaFlashMessage',
        'createUpdateStateVentaError',
    ]);

    constructor(
        private _ventaRemoteRe: VentaRemoteReq,
        private _router: Router,
        private _activatedRoute: ActivatedRoute
    ) {
        super();
        this.initialize(initialVentaState);
    }

    public clearVentaSelected() {
        this.patch({ ventaSelected: null });
    }

    public updateFilterVentaToApply(filterVentaToApply: any) {
        this.patch({ filterVentaToApply: {
            ...this.vm().filterVentaToApply,
            ...filterVentaToApply
        }});
    }

    public async loadSearchVenta(criteria) {
        this.patch({ ventaLoading: true });

        this._ventaRemoteRe.requestSearchVentaByCriteria(criteria).pipe(
            tap(async (response) => {
                this.patch({
                    ventaData: response.data,
                    ventaPagination: response.pagination
                });
            }),
            finalize(async () => {
                this.patch({ ventaLoading: false });
            }),
            catchError((error) => {
                return of(this.patch({ 
                    ventaError: error
                }));
            }),
        ).subscribe();
    }

    public async loadVentaById(ventaId) {
        this.patch({ ventaLoadingSelected: true });

        this._ventaRemoteRe.requestGetVentaById(ventaId).pipe(
            tap(async ({ data }) => {
                this.patch({ ventaSelected: data });
            }),
            finalize(async () => {
                this.patch({ ventaLoadingSelected: false });
            }),
            catchError((error) => {
                return of(this.patch({ 
                    ventaError: error
                    
                }));
            }),
        ).subscribe();
    }

    // public changePageInTransportista(pagination: any) {
    //     const filterTransportistaToApply = this.vm().filterProveedorToApply;
    //     filterTransportistaToApply.page = pagination.pageIndex + 1;
    //     filterTransportistaToApply.perPage = pagination.pageSize;
    //     this.loadVentaByCriteria(filterTransportistaToApply);
    //     this.patch({ filterProveedorToApply: filterTransportistaToApply });
    // };

    public get filterVentaToApply() {
        const state = this.vm();
        return state.filterVentaToApply;
    }

    public loadAllVenta(): Observable<any> {
        this.loadSearchVenta(this.filterVentaToApply);
        return of(true);
    };

    public async loadCreateVenta(formData) {
        if(formData.venta_fechaemision) {
            formData.venta_fechaemision =  DateUtilityService.parseFechaFromServer(formData.venta_fechaemision);
        }

        if(formData.venta_fechavencimiento) {
            formData.venta_fechavencimiento =  DateUtilityService.parseFechaFromServer(formData.venta_fechavencimiento);
        } 

        this.patch({
            createUpdateStateVentaLoading: true,
            createUpdateStateVentaError: null
        });
        this._ventaRemoteRe.requestNuevaVenta(formData).pipe(
            tap(async ({ data, message }) => {
                this.patch({
                    createUpdateStateVentaFlashMessage: message,
                    createUpdateStateVentaError: null,
                    ventaCreada: true
                });

                setTimeout(_ => {
                    this.patch({
                        createUpdateStateVentaFlashMessage: null,
                        ventaCreada: false
                    });
                }, 3000);
            }),

            finalize(async () => {
                this.patch({
                    createUpdateStateVentaLoading: false
                });
            }),
            catchError((error) => {
                return of(this.patch({
                    createUpdateStateVentaError: error
                }));
            }),
        ).subscribe();
    };

    public changePageInVenta(pagination: any) {
        const filterVentaToApply = this.vm().filterVentaToApply;
        filterVentaToApply.page = pagination.pageIndex + 1;
        filterVentaToApply.perPage = pagination.pageSize;
        this.loadSearchVenta(filterVentaToApply);
        this.patch({ filterVentaToApply });
    }

    public anularVenta() {
        const ventaSelected = this.vm().ventaSelected;

        this.patch({
            createUpdateStateVentaLoading: true
        })

        this._ventaRemoteRe.requestAnularVenta(ventaSelected.venta_id)
            .pipe(
                tap(async ({ data, message }) => {
                    this.patch({
                        createUpdateStateVentaFlashMessage: message,
                        createUpdateStateVentaError: null,
                        ventaSelected: data
                    });
    
                    setTimeout(_ => {
                        this.patch({
                            createUpdateStateVentaFlashMessage: null,
                        });
                    }, 3000);
                }),
                finalize(async () => {
                    this.patch({
                        createUpdateStateVentaLoading: false
                    });
                }),
                catchError((error) => {
                    return of(this.patch({
                        createUpdateStateVentaError: error
                    }));
                })
            ).subscribe();
        

    }

    
}
