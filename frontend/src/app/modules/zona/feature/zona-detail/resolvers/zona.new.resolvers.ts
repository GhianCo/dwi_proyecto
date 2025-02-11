import {inject} from "@angular/core";
import { ZonaStore } from "app/modules/zona/data-access/zona.store";

export const zonaNewResolver = () => {
    const zonaStore = inject(ZonaStore);
    return zonaStore.addZona();
}
