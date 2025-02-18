import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { finalize, Observable, of, throwError } from "rxjs";
import { catchError, map, switchMap, take, tap } from "rxjs/operators";
import { PARAM } from "@shared/constants/app.const";
import { SignalStore } from "@shared/data-access/signal.store";
import { UsuarioRemoteReq } from "./usuario.remote.req";
import { TipoDocumentoRemoteReq } from "app/modules/tipo-documento/data-access/tipo.documento.remote.req";
import { DateUtilityService } from "@shared/services/date-utility.service";

export type IUsuarioState = {
    usuarioLoading: boolean,
    usuarioData: any[],
    usuarioPagination: any,
    usuarioError: any,

    usuarioSelected: any,
    tiposdocumentosData: any[]

    filterUsuarioToApply: any,

    createUpdateStateUsuarioLoading: boolean,
    createUpdateStateUsuarioFlashMessage: string,
    createUpdateStateUsuarioError: any,
    refreshData: boolean
}

const initialUsuarioState: IUsuarioState = {
    usuarioLoading: false,
    usuarioData: [],
    usuarioPagination: null,
    usuarioError: null,

    usuarioSelected: null,
    tiposdocumentosData: [],

    filterUsuarioToApply: {
        query: PARAM.VACIO,
        page: 1,
        perPage: 10
    },

    createUpdateStateUsuarioLoading: false,
    createUpdateStateUsuarioFlashMessage: null,
    createUpdateStateUsuarioError: null,
    refreshData: false

};

@Injectable({ providedIn: 'root' })
export class UsuarioStore extends SignalStore<IUsuarioState> {

    public readonly vm = this.selectMany([
        "usuarioLoading",
        "usuarioData",
        "usuarioPagination",
        "usuarioError",
        "usuarioSelected",
        "tiposdocumentosData",
        "filterUsuarioToApply",
        "createUpdateStateUsuarioLoading",
        "createUpdateStateUsuarioFlashMessage",
        "createUpdateStateUsuarioError",
        "refreshData"
    ]);

    constructor(
        private _usuarioRemoteReq: UsuarioRemoteReq,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _tipoDocumentoRemoteReq: TipoDocumentoRemoteReq
    ) {
        super();
        this.initialize(initialUsuarioState);
    }

    public get usuarioSelected() {
        const state = this.vm();
        return state.usuarioSelected
    };

    public get zonaData() {
        const state = this.vm();
        return state.usuarioData
    };

    public get filterClienteToApply() {
        const state = this.vm();
        return state.filterUsuarioToApply
    };

    public updateRefreshData(refreshData: boolean) {
        this.patch({ refreshData: refreshData });
    }

    public async loadSearchUsuario(criteria) {
        this.patch({ usuarioLoading: true, usuarioError: null });
        this._usuarioRemoteReq.requestSearchUsuarioByCriteria(criteria).pipe(
            tap(async ({data, pagination}) => {
                this.patch({
                    usuarioData: data,
                    usuarioPagination: pagination,
                })
            }),
            finalize(async () => {
                this.patch({ usuarioLoading: false });
            }),
            catchError((error) => {
                return of(this.patch({
                    usuarioError: error
                }));
            }),
        ).subscribe();
    };

    public loadAllUsuario(): Observable<any> {
        this.loadSearchUsuario(this.filterClienteToApply);
        return of(true);
    };

    public addUsuario(): Observable<any> {
        const usuarioData: any[] = [...this.zonaData];

        const clienteSelected = {
            usuario_id: null,
            zona_descripcion: null,
            zona_activo: true,
            zona_estadio: "1"
        };

        usuarioData.unshift(clienteSelected);

        this.patch({
            usuarioData: usuarioData,
            usuarioSelected: clienteSelected
        })
        return of(true);
    };

    public searchUsuarioById(usuarioId): Observable<any> {
        return of(this.vm().usuarioData).pipe(
            take(1),
            map((usuario) => {
                const usuarioSelected = usuario.find(item => item.id == usuarioId) || null;

                this.patch({
                    usuarioSelected
                });

                return usuarioSelected;
            }),
            switchMap((usuario) => {
                if (!usuario) {
                    return throwError(() => 'No se encontro el usuario con el id: ' + usuarioId + '!');
                }
                return of(usuario);
            })
        );
    };

    public changeQueryInUsuario(searchValue) {
        const filterUsuarioToApply = this.vm().filterUsuarioToApply;
        filterUsuarioToApply.query = searchValue;
        if (!searchValue.length) {
            filterUsuarioToApply.query = PARAM.VACIO;
        }
        filterUsuarioToApply.page = 1;
        this.loadSearchUsuario(filterUsuarioToApply);
        this.patch({ filterUsuarioToApply });
    };

    public async loadCreateUsuario(formData) {
        this.patch({
            createUpdateStateUsuarioLoading: true,
            createUpdateStateUsuarioError: null
        });


        if(formData.usuario_fechanacimiento) {
            formData.usuario_fechanacimiento =  DateUtilityService.parseFechaFromServer(formData.usuario_fechanacimiento);
        }

        this._usuarioRemoteReq.requestCreateUsuario(formData).pipe(
            tap(async ({ data, message }) => {
                this.updateUsuarioInList(data);
                this.patch({
                    usuarioSelected: data,
                    createUpdateStateUsuarioFlashMessage: message,
                    createUpdateStateUsuarioError: null,
                    refreshData: true
                });

                this._router.navigateByUrl('sistema/usuario');

                setTimeout(_ => {
                    this.patch({
                        // createUpdateStateTipoDocumentoFlashMessage: null
                        createUpdateStateUsuarioFlashMessage: null,
                        refreshData: false
                    });
                }, 3000);
            }),
            finalize(async () => {
                this.patch({
                    // createUpdateStateTipoDocumentoLoading: false
                    createUpdateStateUsuarioLoading: false
                });
            }),
            catchError((error) => {
                return of(this.patch({
                    // createUpdateStateTipoDocumentoError: error
                    createUpdateStateUsuarioError: error
                }));
            }),
        ).subscribe();
    };

    public discardFromListUsuarioToCreate() {
        const usuarioDataStored = this.vm().usuarioData;
        const usuarioData = usuarioDataStored.filter((usuario) => usuario.usuario_id > 0);
        this.patch({
            usuarioData: usuarioData,
            usuarioSelected: null
        });
    }

    public updateUsuarioInList(usuarioToUpdate: any) {
        const usuarioData = structuredClone(this.vm().usuarioData);
        const usuarioIndex = usuarioData.findIndex(usuario => usuario.usuario_id == usuarioToUpdate.usuario_id);

        if (usuarioIndex >= 0) {
            usuarioData[usuarioIndex] = {...usuarioToUpdate};
        }
        this.patch({
            usuarioData: usuarioData,
        });
    }

    public async loadUpdateUsuario(formData: any) {
        this.patch({ createUpdateStateUsuarioLoading: true, createUpdateStateUsuarioError: null });

        if(formData.usuario_fechanacimiento) {
            formData.usuario_fechanacimiento =  DateUtilityService.parseFechaFromServer(formData.usuario_fechanacimiento);
        }

        this._usuarioRemoteReq.requestUpdateUsuario(formData).pipe(
            tap(async ({ data, message }) => {
                this.updateUsuarioInList(data);
                this.patch({
                    usuarioSelected: data,
                    createUpdateStateUsuarioFlashMessage: message,
                });

                setTimeout(_ => {
                    this.patch({
                        createUpdateStateUsuarioFlashMessage: null
                    });
                }, 3000);
            }),
            finalize(async () => {
                this.patch({ createUpdateStateUsuarioLoading: false });
            }),
            catchError((error) => {
                return of(this.patch({
                    createUpdateStateUsuarioError: error
                }));
            }),
        ).subscribe();
    };

    public changePageInUsuario(pagination: any) {
        const filterUsuarioToApply = this.vm().filterUsuarioToApply;
        filterUsuarioToApply.page = pagination.pageIndex + 1;
        filterUsuarioToApply.perPage = pagination.pageSize;
        this.loadSearchUsuario(filterUsuarioToApply);
        this.patch({ filterUsuarioToApply });
    };
}
