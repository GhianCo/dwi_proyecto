import {inject} from '@angular/core';
import {ConductorStore} from "../../data-access/conductor.store";

export const conductorListResolver = () => {
    const conductorStore = inject(ConductorStore);
    return conductorStore.loadAllConductor()
}
