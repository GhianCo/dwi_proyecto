import {Injectable} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {finalize, Observable, of, throwError} from "rxjs";
import {catchError, map, switchMap, take, tap} from "rxjs/operators";
import {PARAM} from "@shared/constants/app.const";
import {SignalStore} from "@shared/data-access/signal.store";
import {LaboratorioRemoteReq} from "./laboratorio.remote.req";

export type ILaboratorioState = {
    laboratorioLoading: boolean,
    laboratorioData: any[],
    laboratorioPagination: any,
    laboratorioError: any,

    laboratorioSelected: any,

    filterlaboratorioToApply: any,

    createUpdateStatelaboratorioLoading: boolean,
    createUpdateStatelaboratorioFlashMessage: string,
    createUpdateStatelaboratorioError: any,
}

const initiallaboratorioState: ILaboratorioState = {
    laboratorioLoading: false,
    laboratorioData: [],
    laboratorioPagination: null,
    laboratorioError: null,

    laboratorioSelected: null,

    filterlaboratorioToApply: {
        query: PARAM.UNDEFINED,
        page: 1,
        perPage: 10
    },

    createUpdateStatelaboratorioLoading: false,
    createUpdateStatelaboratorioFlashMessage: null,
    createUpdateStatelaboratorioError: null,
};

@Injectable({providedIn: 'root'})
export class LaboratorioStore extends SignalStore<ILaboratorioState> {

    public readonly vm = this.selectMany([
        'filterlaboratorioToApply',

        'laboratorioLoading',
        'laboratorioData',
        'laboratorioPagination',
        'laboratorioError',

        'laboratorioSelected',

        'createUpdateStatelaboratorioLoading',
        'createUpdateStatelaboratorioFlashMessage',
        'createUpdateStatelaboratorioError',
    ]);

    constructor(
        private _laboratorioReq: LaboratorioRemoteReq,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
    ) {
        super();
        this.initialize(initiallaboratorioState);
    }

    public get laboratorioSelected() {
        const state = this.vm();
        return state.laboratorioSelected
    };

    public get laboratorioData() {
        const state = this.vm();
        return state.laboratorioData
    };

    public get filterlaboratorioToApply() {
        const state = this.vm();
        return state.filterlaboratorioToApply
    };

    public async loadSearchlaboratorio(criteria) {
        this.patch({laboratorioLoading: true, laboratorioError: null});
        this._laboratorioReq.requestSearchLaboratorioByCriteria(criteria).pipe(
            tap(async ({data, pagination}) => {
                this.patch({
                    laboratorioData: data,
                    laboratorioPagination: pagination,
                })
            }),
            finalize(async () => {
                this.patch({laboratorioLoading: false});
            }),
            catchError((error) => {
                return of(this.patch({
                    laboratorioError: error
                }));
            }),
        ).subscribe();
    };

    public loadAlllaboratorio(): Observable<any> {
        this.loadSearchlaboratorio(this.filterlaboratorioToApply);
        return of(true);
    };

    public addlaboratorio(): Observable<any> {
        const laboratorioData: any[] = [...this.laboratorioData];

        const laboratorioSelected = {
            laboratorio_id: null,
            laboratorio_descripcion: null,
            laboratorio_activo: true,
            laboratorio_sigla: null,
        };

        laboratorioData.unshift(laboratorioSelected);

        this.patch({
            laboratorioData,
            laboratorioSelected
        })
        return of(true);
    };

    public searchlaboratorioById(laboratorioId): Observable<any> {
        return of(this.vm().laboratorioData).pipe(
            take(1),
            map((laboratorio) => {

                const laboratorioSelected = laboratorio.find(item => item.laboratorio_id == laboratorioId) || null;

                this.patch({
                    laboratorioSelected
                });

                return laboratorioSelected;
            }),
            switchMap((laboratorio) => {

                if (!laboratorio) {
                    return throwError('No se encontro el laboratorio con el id: ' + laboratorioId + '!');
                }

                return of(laboratorio);
            })
        );
    };

    public changeQueryInlaboratorio(searchValue) {
        const filterlaboratorioToApply = this.vm().filterlaboratorioToApply;
        filterlaboratorioToApply.query = searchValue;
        if (!searchValue.length) {
            filterlaboratorioToApply.query = PARAM.UNDEFINED;
        }
        filterlaboratorioToApply.page = 1;
        this.loadSearchlaboratorio(filterlaboratorioToApply);
        this.patch({filterlaboratorioToApply});
    };

    public async loadCreatelaboratorio(formData) {
        this.patch({createUpdateStatelaboratorioLoading: true, createUpdateStatelaboratorioError: null});
        formData.laboratorio_fiscalizado = 1;
        formData.laboratorio_estado = formData.laboratorio_activo ? PARAM.ACTIVO : PARAM.INACTIVO;
        this._laboratorioReq.requestCreateLaboratorio(formData).pipe(
            tap(async ({data, message}) => {
                this.updatelaboratorioInList(data);
                this.patch({
                    laboratorioSelected: data,
                    createUpdateStatelaboratorioFlashMessage: message,
                    createUpdateStatelaboratorioError: null
                });

                this._router.navigate(['gestion/laboratorio', data.laboratorio_id], {relativeTo: this._activatedRoute});

                setTimeout(_ => {
                    this.patch({
                        createUpdateStatelaboratorioFlashMessage: null
                    });
                }, 3000);
            }),
            finalize(async () => {
                this.patch({createUpdateStatelaboratorioLoading: false});
            }),
            catchError((error) => {
                return of(this.patch({
                    createUpdateStatelaboratorioError: error
                }));
            }),
        ).subscribe();
    };

    public discardFromListlaboratorioToCreate() {
        const laboratorioDataStored = this.vm().laboratorioData;
        const laboratorioData = laboratorioDataStored.filter(laboratorio => laboratorio.laboratorio_id > 0);
        this.patch({
            laboratorioData,
            laboratorioSelected: null
        });
    };

    public updatelaboratorioInList(laboratorioToUpdate) {
        const laboratorioData = this.vm().laboratorioData;
        const laboratorioIndex = laboratorioData.findIndex(laboratorio => !laboratorio.laboratorio_id || laboratorio.laboratorio_id == laboratorioToUpdate.laboratorio_id);

        if (laboratorioIndex >= 0) {
            laboratorioData[laboratorioIndex] = laboratorioToUpdate;
        }
        this.patch({
            laboratorioData,
        });
    };

    public async loadUpdatelaboratorio(formData) {
        this.patch({createUpdateStatelaboratorioLoading: true, createUpdateStatelaboratorioError: null});
        this._laboratorioReq.requestUpdateLaboratorio(formData).pipe(
            tap(async ({data, message}) => {
                this.updatelaboratorioInList(data);
                this.patch({
                    laboratorioSelected: data,
                    createUpdateStatelaboratorioFlashMessage: message,
                });
                setTimeout(_ => {
                    this.patch({
                        createUpdateStatelaboratorioFlashMessage: null
                    });
                }, 3000);
            }),
            finalize(async () => {
                this.patch({createUpdateStatelaboratorioLoading: false});
            }),
            catchError((error) => {
                return of(this.patch({
                    createUpdateStatelaboratorioError: error
                }));
            }),
        ).subscribe();
    };

    public changePageInlaboratorio(pagination: any) {
        const filterlaboratorioToApply = this.vm().filterlaboratorioToApply;
        filterlaboratorioToApply.page = pagination.pageIndex + 1;
        filterlaboratorioToApply.perPage = pagination.pageSize;
        this.loadSearchlaboratorio(filterlaboratorioToApply);
        this.patch({filterlaboratorioToApply});
    };
}
