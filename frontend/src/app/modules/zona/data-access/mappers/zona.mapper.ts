import { MainMapper } from '@shared/mappers/main.mapper';
import { PARAM } from "@shared/constants/app.const";

export class ZonaMapper extends MainMapper<any, any> {
  protected map(zona: any): any {
    return {
      ...zona,
      zona_activo: zona.zona_activo == PARAM.ACTIVO
    }
  }

}
