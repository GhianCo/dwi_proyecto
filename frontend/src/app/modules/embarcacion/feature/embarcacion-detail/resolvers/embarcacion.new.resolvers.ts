import {EmbarcacionStore} from "../../../data-access/embarcacion.store";
import {inject} from "@angular/core";

export const embarcacionNewResolver = () => {
    const embarcacionStore = inject(EmbarcacionStore);
    return embarcacionStore.addEmbarcacion();
}
