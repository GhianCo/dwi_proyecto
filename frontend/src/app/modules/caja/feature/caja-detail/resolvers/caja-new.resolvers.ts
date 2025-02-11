import {inject} from "@angular/core";
import { CajaStore } from "app/modules/caja/data-access/mapers/caja.store";
import { ZonaStore } from "app/modules/zona/data-access/zona.store";

export const cajaNewResolver = () => {
    const cajaStore = inject(CajaStore);
    return cajaStore.addCaja();
}
