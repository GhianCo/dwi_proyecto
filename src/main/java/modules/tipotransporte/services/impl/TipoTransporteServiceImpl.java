package modules.tipotransporte.services.impl;

import modules.tipotransporte.models.TipoTransporte;
import java.util.ArrayList;
import modules.persona.dao.PersonaDao;
import modules.tipotransporte.dao.TipoTransporteDao;
import modules.tipotransporte.dto.TipoTransporteCreateRequestDTO;
import modules.tipotransporte.services.TipoTransporteService;
import org.json.JSONObject;
import shared.DaoFactory;
import shared.JsonMapper;
import shared.PaginationResult;
import shared.Persona;

public class TipoTransporteServiceImpl implements TipoTransporteService {

    TipoTransporteDao tipotransporteDao;
    PersonaDao personaDao;

    public TipoTransporteServiceImpl() {
        this.instanceConn();
    }

    private void instanceConn() {
        DaoFactory daoFactory = DaoFactory.getInstance();
        tipotransporteDao = daoFactory.getTipoTransporteDao();
        personaDao = daoFactory.getPersonaDao();
    }

    @Override
    public void crear(TipoTransporte tipotransporte) {
        throw new UnsupportedOperationException("Not supported yet."); // Generated from nbfs://nbhost/SystemFileSystem/Templates/Classes/Code/GeneratedMethodBody
    }

    @Override
    public TipoTransporte createTipoTransporteAndPersona(TipoTransporteCreateRequestDTO jsonRequest) {
        Persona personaToCreate = JsonMapper.mapJsonToDto(new JSONObject(jsonRequest), Persona.class);
        int personaIdCreate = personaDao.create(personaToCreate);

        TipoTransporte tipotransporteToCreate = JsonMapper.mapJsonToDto(new JSONObject(jsonRequest), TipoTransporte.class);
        tipotransporteToCreate.setPersona_id(personaIdCreate);

        int tipotransporteIdCreate = tipotransporteDao.create(tipotransporteToCreate);

        tipotransporteToCreate.setId(tipotransporteIdCreate);
        tipotransporteToCreate.setPersona_id(personaIdCreate);
        tipotransporteToCreate.setNombres(personaToCreate.getNombres());
        tipotransporteToCreate.setApellidos(personaToCreate.getApellidos());
        tipotransporteToCreate.setNumero_documento(personaToCreate.getNumero_documento());
        tipotransporteToCreate.setEmail(personaToCreate.getEmail());
        tipotransporteToCreate.setTelefono(personaToCreate.getTelefono());

        return tipotransporteToCreate;
    }

    @Override
    public TipoTransporte buscar(Object id) {
        return tipotransporteDao.find(id);
    }

    @Override
    public ArrayList<TipoTransporte> listar() {
        throw new UnsupportedOperationException("Not supported yet."); // Generated from nbfs://nbhost/SystemFileSystem/Templates/Classes/Code/GeneratedMethodBody
    }

    @Override
    public void update(TipoTransporte tipotransporte) {
        throw new UnsupportedOperationException("Not supported yet."); // Generated from nbfs://nbhost/SystemFileSystem/Templates/Classes/Code/GeneratedMethodBody
    }

    @Override
    public void borrar(Object id) {
        tipotransporteDao.delete(id);
    }

    @Override
    public PaginationResult paginate(String query, int page, int perPage) {
        return tipotransporteDao.paginate(query, page, perPage);
    }

    @Override
    public TipoTransporte updateTipoTransporteAndPersona(TipoTransporteCreateRequestDTO jsonRequest) {
        Persona personaToCreate = JsonMapper.mapJsonToDto(new JSONObject(jsonRequest), Persona.class);
        TipoTransporte tipotransporteToCreate = JsonMapper.mapJsonToDto(new JSONObject(jsonRequest), TipoTransporte.class);

        personaToCreate.setId(jsonRequest.getPersonaId());
        personaDao.update(personaToCreate);

        tipotransporteToCreate.setId(jsonRequest.getId());
        tipotransporteDao.update(tipotransporteToCreate);

        return tipotransporteToCreate;
    }

}
