package modules.usuario.services.impl;

import modules.usuario.models.Usuario;
import java.util.ArrayList;
import modules.persona.dao.PersonaDao;
import modules.usuario.dao.UsuarioDao;
import modules.usuario.dto.UsuarioCreateRequestDTO;
import modules.usuario.services.UsuarioService;
import org.json.JSONObject;
import shared.DaoFactory;
import shared.JsonMapper;
import shared.PaginationResult;
import shared.Persona;

public class UsuarioServiceImpl implements UsuarioService {

    UsuarioDao usuarioDao;
    PersonaDao personaDao;

    public UsuarioServiceImpl() {
        this.instanceConn();
    }

    private void instanceConn() {
        DaoFactory daoFactory = DaoFactory.getInstance();
        usuarioDao = daoFactory.getUsuarioDao();
        personaDao = daoFactory.getPersonaDao();
    }

    @Override
    public void crear(Usuario usuario) {
        throw new UnsupportedOperationException("Not supported yet."); // Generated from nbfs://nbhost/SystemFileSystem/Templates/Classes/Code/GeneratedMethodBody
    }

    @Override
    public Usuario createUsuarioAndPersona(UsuarioCreateRequestDTO jsonRequest) {
        Persona personaToCreate = JsonMapper.mapJsonToDto(new JSONObject(jsonRequest), Persona.class);
        int personaIdCreate = personaDao.create(personaToCreate);

        Usuario usuarioToCreate = JsonMapper.mapJsonToDto(new JSONObject(jsonRequest), Usuario.class);
        usuarioToCreate.setPersona_id(personaIdCreate);

        int usuarioIdCreate = usuarioDao.create(usuarioToCreate);

        usuarioToCreate.setId(usuarioIdCreate);
        usuarioToCreate.setPersona_id(personaIdCreate);
        usuarioToCreate.setNombres(personaToCreate.getNombres());
        usuarioToCreate.setApellidos(personaToCreate.getApellidos());
        usuarioToCreate.setDni(personaToCreate.getDni());
        usuarioToCreate.setEmail(personaToCreate.getEmail());
        usuarioToCreate.setTelefono(personaToCreate.getTelefono());

        return usuarioToCreate;
    }

    @Override
    public Usuario updateUsuarioAndPersona(UsuarioCreateRequestDTO jsonRequest) {
        Persona personaToCreate = JsonMapper.mapJsonToDto(new JSONObject(jsonRequest), Persona.class);
        Usuario usuarioToCreate = JsonMapper.mapJsonToDto(new JSONObject(jsonRequest), Usuario.class);

        personaToCreate.setId(jsonRequest.getPersonaId());
        personaDao.update(personaToCreate);

        usuarioToCreate.setId(jsonRequest.getId());
        usuarioDao.update(usuarioToCreate);

        return usuarioToCreate;
    }

    @Override
    public Usuario buscar(Object id) {
        return usuarioDao.find(id);
    }

    @Override
    public ArrayList<Usuario> listar() {
        throw new UnsupportedOperationException("Not supported yet."); // Generated from nbfs://nbhost/SystemFileSystem/Templates/Classes/Code/GeneratedMethodBody
    }

    @Override
    public void update(Usuario usuario) {
        throw new UnsupportedOperationException("Not supported yet."); // Generated from nbfs://nbhost/SystemFileSystem/Templates/Classes/Code/GeneratedMethodBody
    }

    @Override
    public void borrar(Object id) {
        throw new UnsupportedOperationException("Not supported yet."); // Generated from nbfs://nbhost/SystemFileSystem/Templates/Classes/Code/GeneratedMethodBody
    }

    @Override
    public Usuario login(Usuario login) {
        Usuario usuario = usuarioDao.login(login);
        return usuario;
    }

    @Override
    public PaginationResult paginate(String query, int page, int perPage) {
        return usuarioDao.paginate(query, page, perPage);
    }

}
