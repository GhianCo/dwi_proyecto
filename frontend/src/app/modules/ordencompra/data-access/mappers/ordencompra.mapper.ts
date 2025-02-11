import { MainMapper } from '@shared/mappers/main.mapper';
import { PARAM } from "@shared/constants/app.const";
import { DateUtilityService } from '@shared/services/date-utility.service';
import { isArray } from 'lodash';

export class OrdencompraMapper extends MainMapper<any, any> {
  protected map(ordencompra: any): any {
    const objMapper = {
      ...ordencompra,
      ordencompra_activo: ordencompra.ordencompra_activo == PARAM.ACTIVO,
      ordencompra_fecharegistroFormateada: DateUtilityService.formatearFecha(ordencompra.ordencompra_fecharegistro),
      ordencompra_fechavecimientoFormateada: DateUtilityService.formatearFecha(ordencompra.ordencompra_fechavecimiento),
      ordencompra_pedientecanjear: ordencompra.ordencompra_pedientecanjear == PARAM.SI
    }

    if(objMapper.detalleordencompra && isArray(objMapper.detalleordencompra)) { 
      objMapper.detalleordencompra = objMapper.detalleordencompra.map((detalle: any) =>{
        
        if(detalle.detalleordencompra_pendientecanjear) {
          detalle.detalleordencompra_pendientecanjear = detalle.detalleordencompra_pendientecanjear == PARAM.SI;
        }

        return detalle;

      })
    }

   return objMapper;
  }

}
