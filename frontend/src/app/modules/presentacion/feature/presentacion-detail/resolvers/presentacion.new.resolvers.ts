import {PresentacionStore} from "../../../data-access/presentacion.store";
import {inject} from "@angular/core";

export const presentacionNewResolver = () => {
    const presentacionStore = inject(PresentacionStore);
    return presentacionStore.addPresentacion();
}
