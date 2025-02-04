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
        int id = 0;
        try {

            connection = DBConn.getConnection();

            String sql = "insert into usuario (persona_id, nick, clave, rol) "
                    + "values (?,?,?,?)";

            PreparedStatement pst = connection.prepareStatement(sql, PreparedStatement.RETURN_GENERATED_KEYS);

            pst.setInt(1, entity.getPersona_id());
            pst.setString(2, entity.getNick());
            pst.setString(3, entity.getClave());
            pst.setString(4, entity.getRol());

            pst.executeUpdate();

            resultSet = pst.getGeneratedKeys();

            if (resultSet.next()) {
                id = resultSet.getInt(1);
            }

            pst.close();
            resultSet.close();
            connection.close();

        } catch (SQLException ex) {
            try {
                System.out.println(ex.getMessage());
                connection.close();
            } catch (SQLException exp) {
                System.out.println(exp.getMessage());
            }
        }
        return id;
    }

    @Override
    public Usuario find(Object usuarioId) {
        Usuario usuario = null;

        try {

            connection = DBConn.getConnection();

            String sql = "select u.id, u.persona_id, u.rol, u.nick, u.clave, u.rol, p.nombres, p.apellidos, p.numero_documento from usuario u, persona p where u.persona_id = p.id and u.activo = 1 and u.id = " + usuarioId + " limit 1";

            statement = connection.createStatement();

            resultSet = statement.executeQuery(sql);

            if (resultSet.next()) {
                int id = resultSet.getInt("id");
                int personaId = resultSet.getInt("persona_id");
                String nombres = resultSet.getString("nombres");
                String apellidos = resultSet.getString("apellidos");
                String numero_documento = resultSet.getString("numero_documento");
                String rol = resultSet.getString("rol");

                usuario = new Usuario(id, personaId, nombres, apellidos, numero_documento, rol);

            }

            resultSet.close();
            statement.close();
            connection.close();
        } catch (SQLException ex) {
            try {
                System.out.println(ex.getMessage());
                resultSet.close();
                callableStatement.close();
                connection.close();
            } catch (SQLException exp) {
                System.out.println(exp.getMessage());
            }
        }
        return usuario;
    }

    @Override
    public ArrayList<Usuario> findAll() {
        throw new UnsupportedOperationException("Not supported yet."); // Generated from nbfs://nbhost/SystemFileSystem/Templates/Classes/Code/GeneratedMethodBody
    }

    @Override
    public void update(Usuario entity) {
        try {

            connection = DBConn.getConnection();

            String sql = "update usuario set nick = ?, clave = ?, rol = ? where id = ?";

            PreparedStatement pst = connection.prepareStatement(sql);

            pst.setString(1, entity.getNick());
            pst.setString(2, entity.getClave());
            pst.setString(3, entity.getRol());

            pst.setDouble(4, entity.getId());

            pst.executeUpdate();

            pst.close();
            connection.close();
        } catch (SQLException ex) {
            try {
                System.out.println(ex.getMessage());
                connection.close();
            } catch (SQLException exp) {
                System.out.println(exp.getMessage());
            }
        }
    }

    @Override
    public void delete(Object id) {
        try {

            connection = DBConn.getConnection();

            String sql = "update usuario set activo = 0 where id = " + id;
            statement = connection.createStatement();
            statement.executeUpdate(sql);

            statement.close();
            connection.close();
        } catch (SQLException ex) {
            try {
                System.out.println(ex.getMessage());
                resultSet.close();
                callableStatement.close();
                connection.close();
            } catch (SQLException exp) {
                System.out.println(exp.getMessage());
            }
        }
    }

    public Usuario login(Usuario usuario) {
        Usuario usuario_login = new Usuario();
        try {

            connection = DBConn.getConnection();
            String sql = "select u.id, u.rol, u.nick, u.clave, p.nombres, p.apellidos, p.numero_documento from usuario u, persona p where u.persona_id = p.id and nick='" + usuario.getNick() + "' and clave='" + usuario.getClave() + "' and u.activo = 1";
            statement = connection.createStatement();
            resultSet = statement.executeQuery(sql);

            if (resultSet.next()) {
                usuario_login.setId(resultSet.getInt(1));
                usuario_login.setRol(resultSet.getString(2));
                usuario_login.setNick(resultSet.getString(3));
                usuario_login.setClave(resultSet.getString(4));
                usuario_login.setNombres(resultSet.getString(5));
                usuario_login.setApellidos(resultSet.getString(6));
                usuario_login.setNumero_documento(resultSet.getString(7));
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
    public PaginationResult<ArrayList<Usuario>, Pagination> paginate(String query, int page, int perPage) {
        ArrayList<Usuario> listadeUsuarios = new ArrayList<>();
        int totalRecords = 0;

        String sql = "SELECT SQL_CALC_FOUND_ROWS u.id, u.persona_id, p.nombres, p.apellidos, p.numero_documento, u.rol "
                + "FROM usuario u "
                + "JOIN persona p ON u.persona_id = p.id "
                + "WHERE u.activo = 1 "
                + (query != null && !query.isEmpty() ? " AND (p.nombres LIKE ? OR p.apellidos LIKE ? OR p.numero_documento LIKE ?)" : "")
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
                    String numero_documento = resultSet.getString("numero_documento");
                    String rol = resultSet.getString("rol");

                    listadeUsuarios.add(new Usuario(id, personaId, nombres, apellidos, numero_documento, rol));
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
