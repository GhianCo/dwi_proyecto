import { MainMapper } from '@shared/mappers/main.mapper';
import { PARAM } from "@shared/constants/app.const";

export class UnidadmedidaMapper extends MainMapper<any, any> {
  protected map(unidadmedida: any): any {
    return {
      ...unidadmedida,
      unidadmedida_activo: unidadmedida.unidadmedida_activo == PARAM.ACTIVO
    }
  }

}
