import {inject} from '@angular/core';
import {DestinoStore} from "../../data-access/destino.store";

export const destinoListResolver = () => {
    const destinoStore = inject(DestinoStore);
    return destinoStore.loadAllDestino()
}
