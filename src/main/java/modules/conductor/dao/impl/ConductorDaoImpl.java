package modules.conductor.dao.impl;

import modules.conductor.models.Conductor;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import modules.conductor.dao.ConductorDao;
import shared.Pagination;
import shared.PaginationResult;
import shared.conn.DBConn;

public class ConductorDaoImpl implements ConductorDao {

    private Connection connection;
    private ResultSet resultSet;
    private CallableStatement callableStatement;
    private Statement statement;

    @Override
    public int create(Conductor entity) {
        int id = 0;
        try {

            connection = DBConn.getConnection();

            String sql = "insert into conductor (persona_id, fecha_nacimiento, activo) "
                    + "values (?,?, ?)";

            PreparedStatement pst = connection.prepareStatement(sql, PreparedStatement.RETURN_GENERATED_KEYS);

            pst.setInt(1, entity.getPersona_id());
            pst.setString(2, entity.getFecha_nacimiento());
            pst.setString(3, entity.getActivo());

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
    public Conductor find(Object conductorId) {
        Conductor conductor = null;

        try {

            connection = DBConn.getConnection();

            String sql = "select c.id, c.persona_id, c.fecha_nacimiento, p.nombres, p.apellidos, p.numero_documento, p.telefono, p.email, p.direccion from conductor c, persona p where c.persona_id = p.id and c.activo = 1 and c.id = " + conductorId + " limit 1";

            statement = connection.createStatement();

            resultSet = statement.executeQuery(sql);

            if (resultSet.next()) {
                int id = resultSet.getInt("id");
                int personaId = resultSet.getInt("persona_id");
                String nombres = resultSet.getString("nombres");
                String apellidos = resultSet.getString("apellidos");
                String numero_documento = resultSet.getString("numero_documento");
                String telefono = resultSet.getString("telefono");
                String email = resultSet.getString("email");
                String direccion = resultSet.getString("direccion");

                conductor = new Conductor(id, personaId, nombres, apellidos, numero_documento);
                conductor.setTelefono(telefono);
                conductor.setEmail(email);
                conductor.setDireccion(direccion);
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
        return conductor;
    }

    @Override
    public ArrayList<Conductor> findAll() {
        throw new UnsupportedOperationException("Not supported yet."); // Generated from nbfs://nbhost/SystemFileSystem/Templates/Classes/Code/GeneratedMethodBody
    }

    @Override
    public void update(Conductor entity) {
        try {

            connection = DBConn.getConnection();
//Falta nombre, apellido, numero_documento, telefono, fecha_nacimiento creo 
            String sql = "update conductor set fecha_nacimiento = ? where id = ?";
            PreparedStatement pst = connection.prepareStatement(sql);
            pst.setString(1, entity.getFecha_nacimiento());
            pst.setDouble(2, entity.getId());
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

            String sql = "update conductor set activo = 0 where id = " + id;
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

    @Override
    public PaginationResult<ArrayList<Conductor>, Pagination> paginate(String query, int page, int perPage) {
        ArrayList<Conductor> listadeConductors = new ArrayList<>();
        int totalRecords = 0;

        String sql = "SELECT SQL_CALC_FOUND_ROWS c.id, c.persona_id, p.nombres, p.apellidos, p.numero_documento, p.telefono, c.fecha_nacimiento, c.activo "
                + "FROM conductor c "
                + "JOIN persona p ON c.persona_id = p.id "
                + "WHERE c.activo = 1 "
                + (query != null && !query.isEmpty() ? " AND (p.nombres LIKE ? OR p.apellidos LIKE ? OR p.numero_documento LIKE ?)" : "")
                + " ORDER BY c.id LIMIT ? OFFSET ?";

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
                    String telefono = resultSet.getString("telefono");
                    String fecha_nacimiento = resultSet.getString("fecha_nacimiento");
                    String activo = resultSet.getString("activo");

                    Conductor conductor = new Conductor(id, personaId, nombres, apellidos, numero_documento);
                    conductor.setTelefono(telefono);
                    conductor.setFecha_nacimiento(fecha_nacimiento);
                    conductor.setActivo(activo);
                    listadeConductors.add(conductor);
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

        return new PaginationResult<>(listadeConductors, pagination);

    }

}
