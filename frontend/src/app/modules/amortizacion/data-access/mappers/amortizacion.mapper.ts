import { MainMapper } from '@shared/mappers/main.mapper';
import { PARAM } from "@shared/constants/app.const";
import { DateUtilityService } from '@shared/services/date-utility.service';

export class AmortizacionMapper extends MainMapper<any, any> {
  protected map(amortizacion: any): any {
    const objMapper = {
      ...amortizacion,
      amortizacion_activo: amortizacion.amortizacion_activo == PARAM.ACTIVO
    }

    if(amortizacion.venta_fecha && amortizacion.venta_fecha !== '') {
      objMapper.venta_fechaFormateada = DateUtilityService.formatearFecha(amortizacion.venta_fecha); 
    }
    
    if(amortizacion.ventacredito_fechavencimiento && amortizacion.ventacredito_fechavencimiento !== '') {
      objMapper.ventacredito_fechavencimientoFormateada = DateUtilityService.formatearFechaSinHora(amortizacion.ventacredito_fechavencimiento)
    }

    if(objMapper.ventacredito_fechapagada && objMapper.ventacredito_fechapagada !== '') {
      objMapper.ventacredito_fechapagadaFormateada = DateUtilityService.formatearFecha(objMapper.ventacredito_fechapagada)
    }

    if(typeof objMapper.ventacredito_pagada != 'undefined') {
      objMapper.ventacredito_pagada = objMapper.ventacredito_pagada == PARAM.ACTIVO;
    }


    return objMapper;

  }

}
