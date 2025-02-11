import {TipoDocumentoStore} from "../../../data-access/tipo.documento.store";
import {inject} from "@angular/core";

export const tipoDocumentoNewResolver = () => {
    const tipoDocumentoStore = inject(TipoDocumentoStore);
    return tipoDocumentoStore.addTipoDocumento();
}
