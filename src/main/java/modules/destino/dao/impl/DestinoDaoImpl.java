package modules.destino.dao.impl;

import modules.destino.models.Destino;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import modules.destino.dao.DestinoDao;
import shared.Pagination;
import shared.PaginationResult;
import shared.conn.DBConn;

public class DestinoDaoImpl implements DestinoDao {

    private Connection connection;
    private ResultSet resultSet;
    private Statement statement;

    @Override
    public int create(Destino entity) {
        int id = 0;
        try {
            connection = DBConn.getConnection();

            String sql = "INSERT INTO destino (nombre, tipo, actividad, direccion) "
                    + "VALUES (?, ?, ?, ?)";

            PreparedStatement pst = connection.prepareStatement(sql, PreparedStatement.RETURN_GENERATED_KEYS);
            pst.setString(1, entity.getNombre());
            pst.setString(2, entity.getTipo());
            pst.setString(3, entity.getActividad());
            pst.setString(4, entity.getDireccion());

            // Ejecutar la inserción
            pst.executeUpdate();

            // Obtener el ID generado
            resultSet = pst.getGeneratedKeys();
            if (resultSet.next()) {
                id = resultSet.getInt(1); // El ID generado es recuperado aquí
            }

            // Asignar el ID al objeto Destino
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
    public Destino find(Object destinoId) {
        Destino destino = null;

        try {

            connection = DBConn.getConnection();

            String sql = "select * from destino where id = " + destinoId + " limit 1";

            statement = connection.createStatement();

            resultSet = statement.executeQuery(sql);

            if (resultSet.next()) {
                int id = resultSet.getInt("id");
                String nombre = resultSet.getString("nombre");
                String tipo = resultSet.getString("tipo");
                String actividad = resultSet.getString("actividad");
                String direccion = resultSet.getString("direccion");
                String activa = resultSet.getString("activa");

                destino = new Destino(id, nombre, tipo, actividad, direccion, activa);
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
        return destino;
    }

    @Override
    public ArrayList<Destino> findAll() {
        ArrayList<Destino> destinos = new ArrayList<>();

        try {
            connection = DBConn.getConnection();

            String sql = "select * from destino where activa = '1'";

            statement = connection.createStatement();
            resultSet = statement.executeQuery(sql);

            while (resultSet.next()) {
                int id = resultSet.getInt("id");
                String nombre = resultSet.getString("nombre");
                String tipo = resultSet.getString("tipo");
                String actividad = resultSet.getString("actividad");
                String direccion = resultSet.getString("direccion");
                String activa = resultSet.getString("activa");
                
                destinos.add(new Destino(id, nombre, tipo, actividad, direccion, activa));
            }

            resultSet.close();
            statement.close();
            connection.close();

        } catch (SQLException ex) {
            System.out.println(ex.getMessage());
        }

        return destinos;
    }

    @Override
    public void update(Destino entity) {
        try {

            connection = DBConn.getConnection();

            String sql = "update destino set nombre = ?, tipo = ?, actividad = ?, direccion = ?, activa = ? where id = ?";

            PreparedStatement pst = connection.prepareStatement(sql);
            
            pst.setString(1, entity.getNombre());
            pst.setString(2, entity.getTipo());
            pst.setString(3, entity.getActividad());
            pst.setString(4, entity.getDireccion());
            pst.setString(5, entity.getActiva());
            pst.setInt(6, entity.getId());

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

            String sql = "update destino set activa = 0 where id = " + id;
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
    public PaginationResult<ArrayList<Destino>, Pagination> paginate(String query, int page, int perPage) {
        ArrayList<Destino> listaDestinos = new ArrayList<>();
        int totalRecords = 0;

        String sql = "SELECT SQL_CALC_FOUND_ROWS * "
                + "FROM destino "
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
                    String tipo = resultSet.getString("tipo");
                    String actividad = resultSet.getString("actividad");
                    String direccion = resultSet.getString("direccion");
                    String activa = resultSet.getString("activa");

                    listaDestinos.add(new Destino(id, nombre, tipo, actividad, direccion, activa));
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

        return new PaginationResult<>(listaDestinos, pagination);
    }

}
