import {inject} from '@angular/core';
import {PuntoDesembarqueStore} from "../../data-access/punto.desembarque.store";

export const puntodesembarqueListResolver = () => {
    const puntodesembarqueStore = inject(PuntoDesembarqueStore);
    return puntodesembarqueStore.loadAllPuntoDesembarque()
}
