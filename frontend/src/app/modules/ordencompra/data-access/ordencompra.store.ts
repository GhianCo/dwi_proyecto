import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { finalize, Observable, of, throwError } from "rxjs";
import { catchError, map, switchMap, take, tap } from "rxjs/operators";
import { PARAM } from "@shared/constants/app.const";
import { SignalStore } from "@shared/data-access/signal.store";
import { TipoDocumentoRemoteReq } from "app/modules/tipo-documento/data-access/tipo.documento.remote.req";
import { UsuarioRemoteReq } from "app/modules/usuario/data-access/usuario.remote.req";
import { DateUtilityService } from "@shared/services/date-utility.service";
import { OrdencompraRemoteReq } from "./ordencompra.remote.req";

export type IOrdencompraState = {
    ordencompraLoading: boolean,
    ordencompraData: any[],
    ordencompraPagination: any,
    pedidoError: any,

    ordencompraSelected: any,
    ordencompraLoadingSelected: boolean,

    filterOrdencompraToApply: any,

    createUpdateStateOrdencompraLoading: boolean,
    createUpdateStateOrdencompraFlashMessage: string,
    createUpdateStateOrdencompraError: any,

    ordenCompraCreated: boolean,
    ordenCompraParaCanjear: any

}

const initialVentaState: IOrdencompraState = {
    ordencompraLoading: false,
    ordencompraData: [],
    ordencompraPagination: null,
    pedidoError: null,

    ordencompraSelected: null,
    ordencompraLoadingSelected: false,

    filterOrdencompraToApply: {
        cliente: null,
        page: 1,
        perPage: 10,
        ordencompra_estado: PARAM.UNDEFINED
    },    

    createUpdateStateOrdencompraLoading: false,
    createUpdateStateOrdencompraFlashMessage: null,
    createUpdateStateOrdencompraError: null,
    ordenCompraCreated: false,
    ordenCompraParaCanjear: null
};

@Injectable({ providedIn: 'root' })
export class OrdencompraStore extends SignalStore<IOrdencompraState> {

    public readonly vm = this.selectMany([
        'ordencompraLoading',
        'ordencompraData',
        'ordencompraPagination',
        'ordencompraSelected',
        "ordencompraLoadingSelected",
        'filterOrdencompraToApply',
        'createUpdateStateOrdencompraLoading',
        'createUpdateStateOrdencompraFlashMessage',
        'createUpdateStateOrdencompraError',
        'ordenCompraParaCanjear'
    ]);

    constructor(
        private _ordencompraRemoteReq: OrdencompraRemoteReq,
        private _router: Router,
        private _activatedRoute: ActivatedRoute
    ) {
        super();
        this.initialize(initialVentaState);
    }

    public clearPedidoSelected() {
        this.patch({ ordencompraSelected: null });
    }

    public updateFilterOrdencompraToApply(filterOrdencompraToApply: any) {
        this.patch({ filterOrdencompraToApply: {
            ...this.vm().filterOrdencompraToApply,
            ...filterOrdencompraToApply
        }});
    }

    public setOrdencompraParaCanjear(ordenCompraParaCanjear: any) {
        this.patch({ ordenCompraParaCanjear });
    }

    public get getOrdencompraParaCanjear() {
        return this.vm().ordenCompraParaCanjear;
    }

    public setOrdenCompraCreated(ordenCompraCreated: boolean) {
        this.patch({ ordenCompraCreated });
    }

    public async loadSearchOrdencompras(criteria) {
        this.patch({ ordencompraLoading: true });

        this._ordencompraRemoteReq.requestSearchOrdencompraByCriteria(criteria).pipe(
            tap(async (response) => {
                this.patch({
                    ordencompraData: response.data,
                    ordencompraPagination: response.pagination
                });
            }),
            finalize(async () => {
                this.patch({ ordencompraLoading: false });
            }),
            catchError((error) => {
                return of(this.patch({ 
                    pedidoError: error
                }));
            }),
        ).subscribe();
    }

    public async loadOrdencompraById(pedidoId) {
        this.patch({ ordencompraLoadingSelected: true });

        this._ordencompraRemoteReq.requestGetOrdenCompraById(pedidoId).pipe(
            tap(async ({ data }) => {
                this.patch({ ordencompraSelected: data });
            }),
            finalize(async () => {
                this.patch({ ordencompraLoadingSelected: false });
            }),
            catchError((error) => {
                return of(this.patch({ 
                    pedidoError: error
                    
                }));
            }),
        ).subscribe();
    }

    public get filterOrdencompraToApply() {
        const state = this.vm();
        return state.filterOrdencompraToApply;
    }

    public loadAllOrdenesDeCompra(): Observable<any> {
        this.loadSearchOrdencompras(this.filterOrdencompraToApply);
        return of(true);
    };

    public async loadCreateOrdencompra(formData) {
        this.patch({
            createUpdateStateOrdencompraLoading: true,
            createUpdateStateOrdencompraError: null
        });

        if(formData.ordencompra_fechavecimiento) {
            formData.ordencompra_fechavecimiento = DateUtilityService.parsearSoloFecha(formData.ordencompra_fechavecimiento) + ' 23:59:59';
        }

        this._ordencompraRemoteReq.requestRegistrarOrdecompra(formData).pipe(
            tap(async ({ data, message }) => {
                this.patch({
                    createUpdateStateOrdencompraFlashMessage: message,
                    createUpdateStateOrdencompraError: null,
                });


                setTimeout(_ => {
                    this.patch({
                        createUpdateStateOrdencompraFlashMessage: null,
                    });
                }, 3000);
            }),

            finalize(async () => {
                this.patch({
                    createUpdateStateOrdencompraLoading: false
                });

                this._router.navigateByUrl("/compras/ordenes-de-compra");

            }),
            catchError((error) => {
                return of(this.patch({
                    createUpdateStateOrdencompraError: error
                }));
            }),
        ).subscribe();
    };

    public changePageInOrdencompra(pagination: any) {
        const filterVentaToApply = this.vm().filterOrdencompraToApply;
        filterVentaToApply.page = pagination.pageIndex + 1;
        filterVentaToApply.perPage = pagination.pageSize;
        this.loadSearchOrdencompras(filterVentaToApply);
        this.patch({ filterOrdencompraToApply: filterVentaToApply });
    }

    public async loadUpdateOrdencompra(formData: any) {
        if(formData.ordencompra_fechavecimiento) {
            formData.ordencompra_fechavecimiento = DateUtilityService.parsearSoloFecha(formData.ordencompra_fechavecimiento) + ' 23:59:59';
        }

        if(formData.ordencompra_activo) {
            formData.ordencompra_activo = PARAM.ACTIVO;
        } else {
            formData.ordencompra_activo = PARAM.INACTIVO;
        }

        this.patch({
            createUpdateStateOrdencompraLoading: true,
            createUpdateStateOrdencompraError: null
        });

        this._ordencompraRemoteReq.requestActualizarOrdecompra(formData).pipe(
            tap(async ({ data, message }) => {
                // this.updateClienteInList(data);
                this.patch({
                    createUpdateStateOrdencompraFlashMessage: message,
                    createUpdateStateOrdencompraError: null,
                });

                setTimeout(_ => {
                    this.patch({
                        createUpdateStateOrdencompraFlashMessage: null,
                    });
                }, 3000);
            }),
            finalize(async () => {
                this.patch({
                    createUpdateStateOrdencompraLoading: false,
                    createUpdateStateOrdencompraFlashMessage: null,
                    ordenCompraCreated: true
                });
            }),

            catchError((error) => {
                return of(this.patch({
                    createUpdateStateOrdencompraError: error
                }));
            }),
        ).subscribe();
    };

    


    


}
