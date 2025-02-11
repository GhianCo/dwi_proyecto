import { MainMapper } from '@shared/mappers/main.mapper';
import { PARAM } from "@shared/constants/app.const";

export class PermisoMapper extends MainMapper<any, any> {
  protected map(permiso: any): any {
    return {
      ...permiso,
      permiso_activo: permiso.permiso_activo == PARAM.ACTIVO
    }
  }

}
