import { MainMapper } from '@shared/mappers/main.mapper';
import { PARAM } from "@shared/constants/app.const";
import { DateUtilityService } from '@shared/services/date-utility.service';
import { isArray } from 'lodash';

export class CompraMapper extends MainMapper<any, any> {
  protected map(compra: any): any {
    const objMapper = {
      ...compra,
      compra_activo: compra.compra_activo == PARAM.ACTIVO,
      compra_fechaFormateada: DateUtilityService.formatearFecha(compra.compra_fecha),
      compra_fecharegistFormateada: DateUtilityService.formatearFecha(compra.compra_fecharegistro),
    }

    return objMapper;
  }

}
