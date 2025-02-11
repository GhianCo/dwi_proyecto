import { MainMapper } from '@shared/mappers/main.mapper';
import { PARAM } from "@shared/constants/app.const";

export class DistritoMapper extends MainMapper<any, any> {
  protected map(distrito: any): any {
    return {
      ...distrito,
      distrito_activo: distrito.distrito_activo == PARAM.ACTIVO
    } 
  }

}
