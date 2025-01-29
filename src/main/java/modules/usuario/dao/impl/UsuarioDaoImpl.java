package modules.usuario.dao.impl;

import modules.usuario.models.Usuario;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import modules.usuario.dao.UsuarioDao;
import shared.Pagination;
import shared.PaginationResult;
import shared.conn.DBConn;

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
            String sql = "select u.id, u.rol, u.nick, u.clave, p.nombres, p.apellidos, p.dni from usuario u, persona p where u.persona_id = p.id and nick='" + usuario.getNick() + "' and clave='" + usuario.getClave() + "' and u.activo = 1";
            statement = connection.createStatement();
            resultSet = statement.executeQuery(sql);

            if (resultSet.next()) {
                usuario_login.setId(resultSet.getInt(1));
                usuario_login.setRol(resultSet.getString(2));
                usuario_login.setNick(resultSet.getString(3));
                usuario_login.setClave(resultSet.getString(4));
                usuario_login.setNombres(resultSet.getString(5));
                usuario_login.setApellidos(resultSet.getString(6));
                usuario_login.setDni(resultSet.getString(7));
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

    @Override
    public PaginationResult paginate(String query, int page, int perPage) {
        ArrayList<Usuario> listadeUsuarios = new ArrayList<>();
        int totalRecords = 0;

        String sql = "SELECT SQL_CALC_FOUND_ROWS u.id, u.persona_id, p.nombres, p.apellidos, p.dni "
                + "FROM usuario u "
                + "JOIN persona p ON u.persona_id = p.id "
                + "WHERE u.activo = 1 "
                + (query != null && !query.isEmpty() ? " AND (p.nombres LIKE ? OR p.apellidos LIKE ? OR p.dni LIKE ?)" : "")
                + " ORDER BY u.id LIMIT ? OFFSET ?";

        try (Connection connection = DBConn.getConnection(); PreparedStatement preparedStatement = connection.prepareStatement(sql)) {

            int paramIndex = 1;
            if (query != null && !query.isEmpty()) {
                preparedStatement.setString(paramIndex++, "%" + query + "%");
                preparedStatement.setString(paramIndex++, "%" + query + "%");
                preparedStatement.setString(paramIndex++, "%" + query + "%");
            }

            preparedStatement.setInt(paramIndex++, perPage);
            preparedStatement.setInt(paramIndex++, (page - 1) * perPage);

            try (ResultSet resultSet = preparedStatement.executeQuery()) {
                while (resultSet.next()) {
                    int id = resultSet.getInt("id");
                    int personaId = resultSet.getInt("persona_id");
                    String nombres = resultSet.getString("nombres");
                    String apellidos = resultSet.getString("apellidos");
                    String dni = resultSet.getString("dni");

                    listadeUsuarios.add(new Usuario(id, personaId, nombres, apellidos, dni));
                }
            }

            try (Statement stmt = connection.createStatement()) {
                ResultSet countResultSet = stmt.executeQuery("SELECT FOUND_ROWS()");
                if (countResultSet.next()) {
                    totalRecords = countResultSet.getInt(1);
                }
            }

        } catch (SQLException ex) {
            ex.printStackTrace();
            return new PaginationResult<>(null, null);
        }

        int totalPages = (int) Math.ceil((double) totalRecords / perPage);
        Pagination pagination = new Pagination(totalRecords, totalPages, page, perPage);
        
        return new PaginationResult<>(listadeUsuarios, pagination);

    }

}
