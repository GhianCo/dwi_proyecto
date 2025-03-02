import { MainMapper } from '@shared/mappers/main.mapper';
import {PARAM} from "@shared/constants/app.const";

export class Destino extends MainMapper<any, any> {
  protected map(destino: any): any {

    return {
      ...destino,
      activa: destino.activa == PARAM.ACTIVO
    }
  }

}
