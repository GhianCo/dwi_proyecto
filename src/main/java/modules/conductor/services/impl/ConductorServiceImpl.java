package modules.conductor.services.impl;

import modules.conductor.models.Conductor;
import java.util.ArrayList;
import modules.persona.dao.PersonaDao;
import modules.conductor.dao.ConductorDao;
import modules.conductor.dto.ConductorCreateRequestDTO;
import modules.conductor.services.ConductorService;
import org.json.JSONObject;
import shared.DaoFactory;
import shared.JsonMapper;
import shared.PaginationResult;
import shared.Persona;

public class ConductorServiceImpl implements ConductorService {

    ConductorDao conductorDao;
    PersonaDao personaDao;

    public ConductorServiceImpl() {
        this.instanceConn();
    }

    private void instanceConn() {
        DaoFactory daoFactory = DaoFactory.getInstance();
        conductorDao = daoFactory.getConductorDao();
        personaDao = daoFactory.getPersonaDao();
    }

    @Override
    public void crear(Conductor conductor) {
        throw new UnsupportedOperationException("Not supported yet."); // Generated from nbfs://nbhost/SystemFileSystem/Templates/Classes/Code/GeneratedMethodBody
    }

    @Override
    public Conductor createConductorAndPersona(ConductorCreateRequestDTO jsonRequest) {
        Persona personaToCreate = JsonMapper.mapJsonToDto(new JSONObject(jsonRequest), Persona.class);
        int personaIdCreate = personaDao.create(personaToCreate);

        Conductor conductorToCreate = JsonMapper.mapJsonToDto(new JSONObject(jsonRequest), Conductor.class);
        conductorToCreate.setPersona_id(personaIdCreate);

        int conductorIdCreate = conductorDao.create(conductorToCreate);

        conductorToCreate.setId(conductorIdCreate);
        conductorToCreate.setPersona_id(personaIdCreate);
        conductorToCreate.setNombres(personaToCreate.getNombres());
        conductorToCreate.setApellidos(personaToCreate.getApellidos());
        conductorToCreate.setNumero_documento(personaToCreate.getNumero_documento());
        conductorToCreate.setEmail(personaToCreate.getEmail());
        conductorToCreate.setTelefono(personaToCreate.getTelefono());

        return conductorToCreate;
    }

    @Override
    public Conductor updateConductorAndPersona(ConductorCreateRequestDTO jsonRequest) {
        Persona personaToCreate = JsonMapper.mapJsonToDto(new JSONObject(jsonRequest), Persona.class);
        Conductor conductorToCreate = JsonMapper.mapJsonToDto(new JSONObject(jsonRequest), Conductor.class);

        personaToCreate.setId(jsonRequest.getPersonaId());
        personaDao.update(personaToCreate);

        conductorToCreate.setId(jsonRequest.getId());
        conductorDao.update(conductorToCreate);

        return conductorToCreate;
    }

    @Override
    public Conductor buscar(Object id) {
        return conductorDao.find(id);
    }

    @Override
    public ArrayList<Conductor> listar() {
        throw new UnsupportedOperationException("Not supported yet."); // Generated from nbfs://nbhost/SystemFileSystem/Templates/Classes/Code/GeneratedMethodBody
    }

    @Override
    public void update(Conductor conductor) {
        throw new UnsupportedOperationException("Not supported yet."); // Generated from nbfs://nbhost/SystemFileSystem/Templates/Classes/Code/GeneratedMethodBody
    }

    @Override
    public void borrar(Object id) {
        conductorDao.delete(id);
    }

    @Override
    public PaginationResult paginate(String query, int page, int perPage) {
        return conductorDao.paginate(query, page, perPage);
    }

}
