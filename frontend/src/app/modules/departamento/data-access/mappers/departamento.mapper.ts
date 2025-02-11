import { MainMapper } from '@shared/mappers/main.mapper';
import { PARAM } from "@shared/constants/app.const";

export class DepartamentoMapper extends MainMapper<any, any> {
  protected map(departamento: any): any {
    return {
      ...departamento,
      departamento_activo: departamento.departamento_activo == PARAM.ACTIVO
    } 
  }

}
