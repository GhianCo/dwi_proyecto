import { MainMapper } from '@shared/mappers/main.mapper';
import { PARAM } from "@shared/constants/app.const";

export class ComprobantelocalMapper extends MainMapper<any, any> {
  protected map(comprobantelocal: any): any {
    return {
      ...comprobantelocal,
      comprobantelocal_activo: comprobantelocal.comprobantelocal_activo == PARAM.ACTIVO
    }
  }

}
