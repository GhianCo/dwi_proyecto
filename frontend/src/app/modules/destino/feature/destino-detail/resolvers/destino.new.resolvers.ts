import {DestinoStore} from "../../../data-access/destino.store";
import {inject} from "@angular/core";

export const destinoNewResolver = () => {
    const destinoStore = inject(DestinoStore);
    return destinoStore.addDestino();
}
