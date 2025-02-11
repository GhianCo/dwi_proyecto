import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { finalize, Observable, of, throwError } from "rxjs";
import { catchError, map, switchMap, take, tap } from "rxjs/operators";
import { PARAM } from "@shared/constants/app.const";
import { SignalStore } from "@shared/data-access/signal.store";
import { TipoDocumentoRemoteReq } from "app/modules/tipo-documento/data-access/tipo.documento.remote.req";
import { UsuarioRemoteReq } from "app/modules/usuario/data-access/usuario.remote.req";
import { DateUtilityService } from "@shared/services/date-utility.service";
import { PedidoRemoteReq } from "./pedido.remote.req";

export type IPedidoState = {
    pedidoLoading: boolean,
    pedidoData: any[],
    pedidoPagination: any,
    pedidoError: any,

    pedidoSelected: any,
    pedidoLoadingSelected: boolean,

    filterPedidoToApply: any,

    createUpdateStatePedidoLoading: boolean,
    createUpdateStatePedidoFlashMessage: string,
    createUpdateStatePedidoError: any,
}

const initialVentaState: IPedidoState = {
    pedidoLoading: false,
    pedidoData: [],
    pedidoPagination: null,
    pedidoError: null,

    pedidoSelected: null,
    pedidoLoadingSelected: false,

    filterPedidoToApply: {
        cliente: null,
        page: 1,
        perPage: 10,
        pedidoCodigo: null,
        active: null,
        pedidoPendiente: null,
    },    

    createUpdateStatePedidoLoading: false,
    createUpdateStatePedidoFlashMessage: null,
    createUpdateStatePedidoError: null,
};

@Injectable({ providedIn: 'root' })
export class PedidoStore extends SignalStore<IPedidoState> {

    public readonly vm = this.selectMany([
        'pedidoLoading',
        'pedidoData',
        'pedidoPagination',
        'pedidoSelected',
        "pedidoLoadingSelected",
        'filterPedidoToApply',
        'createUpdateStatePedidoLoading',
        'createUpdateStatePedidoFlashMessage',
        'createUpdateStatePedidoError',
    ]);

    constructor(
        private _pedidoRemoteReq: PedidoRemoteReq,
        private _router: Router,
        private _activatedRoute: ActivatedRoute
    ) {
        super();
        this.initialize(initialVentaState);
    }

    public clearPedidoSelected() {
        this.patch({ pedidoSelected: null });
    }

    public updateFilterPedidoToApply(filterPedidoToApply: any) {
        this.patch({ filterPedidoToApply: {
            ...this.vm().filterPedidoToApply,
            ...filterPedidoToApply
        }});
    }

    public async loadSearchPedidos(criteria) {
        this.patch({ pedidoLoading: true });

        this._pedidoRemoteReq.requestSearchVentaByCriteria(criteria).pipe(
            tap(async (response) => {
                this.patch({
                    pedidoData: response.data,
                    pedidoPagination: response.pagination
                });
            }),
            finalize(async () => {
                this.patch({ pedidoLoading: false });
            }),
            catchError((error) => {
                return of(this.patch({ 
                    pedidoError: error
                }));
            }),
        ).subscribe();
    }

    public async loadPedidoById(pedidoId) {
        this.patch({ pedidoLoadingSelected: true });

        this._pedidoRemoteReq.requestGetPedidoById(pedidoId).pipe(
            tap(async ({ data }) => {
                this.patch({ pedidoSelected: data });
            }),
            finalize(async () => {
                this.patch({ pedidoLoadingSelected: false });
            }),
            catchError((error) => {
                return of(this.patch({ 
                    pedidoError: error
                    
                }));
            }),
        ).subscribe();
    }

    public get filterPedidoToApply() {
        const state = this.vm();
        return state.filterPedidoToApply;
    }

    public loadAllPedidos(): Observable<any> {
        this.loadSearchPedidos(this.filterPedidoToApply);
        return of(true);
    };

    public async loadCreateVenta(formData) {
        this.patch({
            createUpdateStatePedidoLoading: true,
            createUpdateStatePedidoError: null
        });
        this._pedidoRemoteReq.requestNuevoPedido(formData).pipe(
            tap(async ({ data, message }) => {
                this.patch({
                    createUpdateStatePedidoFlashMessage: message,
                    createUpdateStatePedidoError: null,
                });

                setTimeout(_ => {
                    this.patch({
                        createUpdateStatePedidoFlashMessage: null,
                    });
                }, 3000);
            }),

            finalize(async () => {
                this.patch({
                    createUpdateStatePedidoLoading: false
                });
            }),
            catchError((error) => {
                return of(this.patch({
                    createUpdateStatePedidoError: error
                }));
            }),
        ).subscribe();
    };

    public changePageInPedido(pagination: any) {
        const filterVentaToApply = this.vm().filterPedidoToApply;
        filterVentaToApply.page = pagination.pageIndex + 1;
        filterVentaToApply.perPage = pagination.pageSize;
        this.loadSearchPedidos(filterVentaToApply);
        this.patch({ filterPedidoToApply: filterVentaToApply });
    }


}
