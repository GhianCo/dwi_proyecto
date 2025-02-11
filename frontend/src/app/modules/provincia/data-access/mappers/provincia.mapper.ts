import { MainMapper } from '@shared/mappers/main.mapper';
import { PARAM } from "@shared/constants/app.const";

export class ProvinciaMapper extends MainMapper<any, any> {
  protected map(provincia: any): any {
    return {
      ...provincia,
      provincia_activo: provincia.provincia_activo == PARAM.ACTIVO
    } 
  }

}
