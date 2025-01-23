package services.impl;

import models.dao.UsuarioDao;
import models.dao.impl.DaoFactory;
import models.entities.Usuario;
import services.UsuarioService;
import java.util.ArrayList;

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
        throw new UnsupportedOperationException("Not supported yet."); // Generated from nbfs://nbhost/SystemFileSystem/Templates/Classes/Code/GeneratedMethodBody
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

}
