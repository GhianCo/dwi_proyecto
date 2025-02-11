import { MainMapper } from '@shared/mappers/main.mapper';
import { PARAM } from "@shared/constants/app.const";
import { DateService } from '@shared/services/date.service';
import { UtilityService } from '@shared/services/utility.service';
import { DateUtilityService } from '@shared/services/date-utility.service';

export class HistorialproductoMapper extends MainMapper<any, any> {
  protected map(historialproducto: any): any {
    return {
      ...historialproducto,
      compra_fechaFormateada: DateUtilityService.formatearFecha(historialproducto.compra_fecha),
    }
  }

}
