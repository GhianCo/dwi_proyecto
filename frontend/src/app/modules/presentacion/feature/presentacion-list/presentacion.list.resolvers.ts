import {inject} from '@angular/core';
import {PresentacionStore} from "../../data-access/presentacion.store";

export const presentacionListResolver = () => {
    const presentacionStore = inject(PresentacionStore);
    return presentacionStore.loadAllTipoDocumento()
}
