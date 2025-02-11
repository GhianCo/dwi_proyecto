import { MainMapper } from '@shared/mappers/main.mapper';
import {PARAM} from "@shared/constants/app.const";

export class TipoDocumentoMapper extends MainMapper<any, any> {
  protected map(tipoDocumento: any): any {

    return {
      ...tipoDocumento,
      tipodocumento_activo: tipoDocumento.tipodocumento_activo == PARAM.ACTIVO
    }
  }

}
