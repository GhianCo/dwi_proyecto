import {PuntoDesembarqueStore} from "../../../data-access/punto.desembarque.store";
import {inject} from "@angular/core";

export const puntodesembarqueNewResolver = () => {
    const puntodesembarqueStore = inject(PuntoDesembarqueStore);
    return puntodesembarqueStore.addPuntoDesembarque();
}
