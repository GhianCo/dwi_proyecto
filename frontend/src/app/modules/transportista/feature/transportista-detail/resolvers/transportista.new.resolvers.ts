import {inject} from "@angular/core";
import { TransportistaStore } from "app/modules/transportista/data-access/transportista.store";

export const transportistaNewResolver = () => {
    const transportistaStore = inject(TransportistaStore);
    transportistaStore.cargarTiposDocumentoActivos();
    return transportistaStore.addTransportista();
}
