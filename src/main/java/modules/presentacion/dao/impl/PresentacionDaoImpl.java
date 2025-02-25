package modules.presentacion.dao.impl;

import modules.presentacion.models.Presentacion;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import modules.presentacion.dao.PresentacionDao;
import shared.Pagination;
import shared.PaginationResult;
import shared.conn.DBConn;

public class PresentacionDaoImpl implements PresentacionDao {

    private Connection connection;
    private ResultSet resultSet;
    private Statement statement;

    @Override
    public int create(Presentacion entity) {
        int id = 0;
        try {
            connection = DBConn.getConnection();

            String sql = "INSERT INTO presentacion (nombre, peso_promedio) "
                    + "VALUES (?, ?)";

            PreparedStatement pst = connection.prepareStatement(sql, PreparedStatement.RETURN_GENERATED_KEYS);
            pst.setString(1, entity.getNombre());
            pst.setDouble(2, entity.getPeso_promedio());

            // Ejecutar la inserción
            pst.executeUpdate();

            // Obtener el ID generado
            resultSet = pst.getGeneratedKeys();
            if (resultSet.next()) {
                id = resultSet.getInt(1); // El ID generado es recuperado aquí
            }

            // Asignar el ID al objeto Presentacion
            entity.setId(id);

            pst.close();
            resultSet.close();
            connection.close();
        } catch (SQLException ex) {
            try {
                System.out.println(ex.getMessage());
                if (connection != null) {
                    connection.close();
                }
            } catch (SQLException exp) {
                System.out.println(exp.getMessage());
            }
        }
        return id;
    }

    @Override
    public Presentacion find(Object presentacionId) {
        Presentacion presentacion = null;

        try {

            connection = DBConn.getConnection();

            String sql = "select * from presentacion where id = " + presentacionId + " limit 1";

            statement = connection.createStatement();

            resultSet = statement.executeQuery(sql);

            if (resultSet.next()) {
                int id = resultSet.getInt("id");
                String nombre = resultSet.getString("nombre");
                double peso_promedio = resultSet.getDouble("peso_promedio");
                String activa = resultSet.getString("activa");

                presentacion = new Presentacion(id, nombre, peso_promedio, activa);
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
        return presentacion;
    }

    @Override
    public ArrayList<Presentacion> findAll() {
        ArrayList<Presentacion> presentaciones = new ArrayList<>();

        try {
            connection = DBConn.getConnection();

            String sql = "select * from presentacion where activa = '1'";

            statement = connection.createStatement();
            resultSet = statement.executeQuery(sql);

            while (resultSet.next()) {
                int id = resultSet.getInt("id");
                String nombre = resultSet.getString("nombre");
                double peso_promedio = resultSet.getDouble("peso_promedio");
                String activa = resultSet.getString("activa");

                presentaciones.add(new Presentacion(id, nombre, peso_promedio, activa));
            }

            resultSet.close();
            statement.close();
            connection.close();

        } catch (SQLException ex) {
            System.out.println(ex.getMessage());
        }

        return presentaciones;
    }

    @Override
    public void update(Presentacion entity) {
        try {

            connection = DBConn.getConnection();

            String sql = "update presentacion set nombre = ?, peso_promedio = ?, activa = ? where id = ?";

            PreparedStatement pst = connection.prepareStatement(sql);

            pst.setString(1, entity.getNombre());
            pst.setDouble(2, entity.getPeso_promedio());
            pst.setString(3, entity.getActiva());
            pst.setInt(4, entity.getId());

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

            String sql = "update presentacion set activa = 0 where id = " + id;
            statement = connection.createStatement();
            statement.executeUpdate(sql);

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
    }

    @Override
    public PaginationResult<ArrayList<Presentacion>, Pagination> paginate(String query, int page, int perPage) {
        ArrayList<Presentacion> listaPresentaciones = new ArrayList<>();
        int totalRecords = 0;

        String sql = "SELECT SQL_CALC_FOUND_ROWS * "
                + "FROM presentacion "
                + "WHERE activa = 1 "
                + (query != null && !query.isEmpty() ? " AND nombre LIKE ?" : "")
                + " ORDER BY id LIMIT ? OFFSET ?";

        try (Connection connection = DBConn.getConnection(); PreparedStatement preparedStatement = connection.prepareStatement(sql)) {

            int paramIndex = 1;
            if (query != null && !query.isEmpty()) {
                preparedStatement.setString(paramIndex++, "%" + query + "%");
            }

            preparedStatement.setInt(paramIndex++, perPage);
            preparedStatement.setInt(paramIndex++, (page - 1) * perPage);

            try (ResultSet resultSet = preparedStatement.executeQuery()) {
                while (resultSet.next()) {
                    int id = resultSet.getInt("id");
                    String nombre = resultSet.getString("nombre");
                    double peso_promedio = resultSet.getDouble("peso_promedio");
                    String activa = resultSet.getString("activa");

                    listaPresentaciones.add(new Presentacion(id, nombre, peso_promedio, activa));
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

        return new PaginationResult<>(listaPresentaciones, pagination);
    }

}
