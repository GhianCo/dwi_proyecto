import { MainMapper } from '@shared/mappers/main.mapper';
import {PARAM} from "@shared/constants/app.const";

export class Presentacion extends MainMapper<any, any> {
  protected map(presentacion: any): any {

    return {
      ...presentacion,
      activa: presentacion.activa == PARAM.ACTIVO
    }
  }

}
