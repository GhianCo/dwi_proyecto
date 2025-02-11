import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ZonaStore } from "../../data-access/zona.store";

export const ZonaListResolver = () => {
    const zonaStore = inject(ZonaStore);
    return zonaStore.loadAllZonaStore()
}
