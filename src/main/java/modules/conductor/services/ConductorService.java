package modules.conductor.services;

import modules.conductor.dto.ConductorCreateRequestDTO;
import modules.conductor.models.Conductor;
import shared.BaseService;

public interface ConductorService extends BaseService<Conductor> {
    public Conductor createConductorAndPersona(ConductorCreateRequestDTO entity);
    public Conductor updateConductorAndPersona(ConductorCreateRequestDTO entity);
}
