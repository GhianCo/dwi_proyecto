import {inject, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import { LaboratorioStore } from '../../data-access/laboratorio.store';

export const LaboratorioListResolver = () => {
    const laboratorioStore = inject(LaboratorioStore);
    return laboratorioStore.loadAlllaboratorio()
};
