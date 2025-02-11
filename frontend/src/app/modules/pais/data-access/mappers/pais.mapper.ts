import { MainMapper } from '@shared/mappers/main.mapper';
import { PARAM } from "@shared/constants/app.const";

export class PaisMapper extends MainMapper<any, any> {
  protected map(pais: any): any {
    return {
      ...pais,
      pais_activo: pais.pais_activo == PARAM.ACTIVO
    } 
  }

}
