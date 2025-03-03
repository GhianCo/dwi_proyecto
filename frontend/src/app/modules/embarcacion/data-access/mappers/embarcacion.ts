import { MainMapper } from '@shared/mappers/main.mapper';
import {PARAM} from "@shared/constants/app.const";

export class Embarcacion extends MainMapper<any, any> {
  protected map(embarcacion: any): any {

    return {
      ...embarcacion,
      activa: embarcacion.activa == PARAM.ACTIVO
    }
  }

}
