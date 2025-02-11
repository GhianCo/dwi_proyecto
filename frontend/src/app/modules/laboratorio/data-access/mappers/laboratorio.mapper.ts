import { MainMapper } from '@shared/mappers/main.mapper';
import {PARAM} from "@shared/constants/app.const";
import { DateService } from '@shared/services/date.service';

export class LaboratorioMapper extends MainMapper<any, any> {
  protected map(laboratorio: any): any {

    return {
      ...laboratorio,
      laboratorio_activo: laboratorio.laboratorio_activo == PARAM.ACTIVO,
      laboratorio_fecharegistroformateda: DateService.formatDateString(laboratorio.laboratorio_fecharegistro)
    };
  };

};
