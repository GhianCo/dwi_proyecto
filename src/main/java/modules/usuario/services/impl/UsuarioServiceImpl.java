package modules.usuario.services.impl;

import modules.usuario.models.Usuario;
import java.util.ArrayList;
import modules.usuario.dao.UsuarioDao;
import modules.usuario.services.UsuarioService;
import shared.DaoFactory;
import shared.PaginationResult;

public class UsuarioServiceImpl implements UsuarioService {

    UsuarioDao usuarioDao;

    public UsuarioServiceImpl() {
        this.instanceConn();
    }

    private void instanceConn() {
        DaoFactory daoFactory = DaoFactory.getInstance();
        usuarioDao = daoFactory.getUsuarioDao();
    }

    @Override
    public void crear(Usuario usuario) {
        throw new UnsupportedOperationException("Not supported yet."); // Generated from nbfs://nbhost/SystemFileSystem/Templates/Classes/Code/GeneratedMethodBody
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
