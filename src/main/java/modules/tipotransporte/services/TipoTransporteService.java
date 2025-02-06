package modules.tipotransporte.services;

import modules.tipotransporte.dto.TipoTransporteCreateRequestDTO;
import modules.tipotransporte.models.TipoTransporte;
import shared.BaseService;

public interface TipoTransporteService extends BaseService<TipoTransporte> {
    public TipoTransporte createTipoTransporteAndPersona(TipoTransporteCreateRequestDTO entity);
    public TipoTransporte updateTipoTransporteAndPersona(TipoTransporteCreateRequestDTO entity);
}
