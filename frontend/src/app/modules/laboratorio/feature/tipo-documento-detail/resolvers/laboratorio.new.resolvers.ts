import {inject} from "@angular/core";
import { LaboratorioStore } from "app/modules/laboratorio/data-access/laboratorio.store";

export const LaboratorioNewResolver = () => {
    const laboratorioStore = inject(LaboratorioStore);
    return laboratorioStore.addlaboratorio();
}
