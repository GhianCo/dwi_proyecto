import {DestroyRef, inject, Injectable} from "@angular/core";
import {SignalStore} from "@shared/data-access/signal.store";
import {ExampleRemoteReq} from "./example.remote.req";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {catchError, finalize, of, tap} from "rxjs";

export type IAppCoreState = {
    testLoading: boolean,
    test: any,
    testError: any,
}

const initialAppCoreState: IAppCoreState = {
    testLoading: false,
    test: [],
    testError: null,
};

@Injectable({providedIn: 'root'})
export class ExampleStore extends SignalStore<IAppCoreState> {

    public readonly vm = this.selectMany([
        'testLoading',
        'test',
        'testError',
    ]);

    destroyRef = inject(DestroyRef);
    exampleRemoteReq = inject(ExampleRemoteReq);

    constructor(
    ) {
        super();
        this.initialize(initialAppCoreState);
    }

    public async getTest() {
        this.patch({testLoading: true, testError: null});
        this.exampleRemoteReq.requestTest().pipe(
            takeUntilDestroyed(this.destroyRef),
            tap(async ({data}: any) => {
                this.patch({
                    test: data,
                    testLoading: false
                });
            }),
            finalize(async () => {
            }),
            catchError(async ({error}) => {
                return of(this.patch({
                    testLoading: false,
                    testError: error
                }));
            })
        ).subscribe();
    };

}
