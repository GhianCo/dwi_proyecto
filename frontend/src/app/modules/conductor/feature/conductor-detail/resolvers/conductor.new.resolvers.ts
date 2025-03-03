import {ConductorStore} from "../../../data-access/conductor.store";
import {inject} from "@angular/core";

export const conductorNewResolver = () => {
    const conductorStore = inject(ConductorStore);
    return conductorStore.addConductor();
}
