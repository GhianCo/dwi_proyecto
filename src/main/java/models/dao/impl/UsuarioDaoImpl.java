package models.dao.impl;

import utils.DBConn;
import models.dao.UsuarioDao;
import models.entities.Usuario;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.CallableStatement;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;

public class UsuarioDaoImpl implements UsuarioDao {

    private Connection connection;
    private ResultSet resultSet;
    private CallableStatement callableStatement;
    private Statement statement;

    @Override
    public int create(Usuario entity) {
        throw new UnsupportedOperationException("Not supported yet."); // Generated from nbfs://nbhost/SystemFileSystem/Templates/Classes/Code/GeneratedMethodBody
    }

    @Override
    public Usuario find(Object id) {
        throw new UnsupportedOperationException("Not supported yet."); // Generated from nbfs://nbhost/SystemFileSystem/Templates/Classes/Code/GeneratedMethodBody
    }

    @Override
    public ArrayList<Usuario> findAll() {
        throw new UnsupportedOperationException("Not supported yet."); // Generated from nbfs://nbhost/SystemFileSystem/Templates/Classes/Code/GeneratedMethodBody
    }

    @Override
    public void update(Usuario entity) {
        throw new UnsupportedOperationException("Not supported yet."); // Generated from nbfs://nbhost/SystemFileSystem/Templates/Classes/Code/GeneratedMethodBody
    }

    @Override
    public void delete(Object id) {
        throw new UnsupportedOperationException("Not supported yet."); // Generated from nbfs://nbhost/SystemFileSystem/Templates/Classes/Code/GeneratedMethodBody
    }

    public Usuario login(Usuario usuario) {
        Usuario usuario_login = new Usuario();
        try {

            connection = DBConn.getConnection();
            String sql = "select * from usuario u, persona p where. u.persona_id = p.id and nick='" + usuario.getNick() + "' and clave='" + usuario.getClave() + "' and u.activo = 1";
            statement = connection.createStatement();
            resultSet = statement.executeQuery(sql);

            if (resultSet.next()) {
                usuario_login.setId(resultSet.getInt(1));
                usuario_login.setRol(resultSet.getString(4));
                usuario_login.setNick(resultSet.getString(5));
                usuario_login.setClave(resultSet.getString(6));
                usuario_login.setNombres(resultSet.getString(9));
                usuario_login.setApellidos(resultSet.getString(10));
                usuario_login.setDni(resultSet.getString(11));
            }

            resultSet.close();
            statement.close();
            connection.close();
        } catch (SQLException ex) {
            try {
                System.out.println(ex.getMessage());
                resultSet.close();
                statement.close();
                connection.close();
            } catch (SQLException exp) {
                System.out.println(exp.getMessage());
            }
        }

        return usuario_login;

    }

}
