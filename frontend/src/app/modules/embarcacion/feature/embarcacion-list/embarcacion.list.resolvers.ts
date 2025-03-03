import {inject} from '@angular/core';
import {EmbarcacionStore} from "../../data-access/embarcacion.store";

export const embarcacionListResolver = () => {
    const embarcacionStore = inject(EmbarcacionStore);
    return embarcacionStore.loadAllEmbarcacion()
}
