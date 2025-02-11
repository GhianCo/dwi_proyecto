import { MainMapper } from '@shared/mappers/main.mapper';
import { PARAM } from "@shared/constants/app.const";

export class DiascreditoMapper extends MainMapper<any, any> {
  protected map(diascredito: any): any {
    return {
      ...diascredito,
      diascredito_activo: diascredito.diascredito_activo == PARAM.ACTIVO
    } 
  }

}
