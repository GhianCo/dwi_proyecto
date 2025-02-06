package modules.especie.dao.impl;

import modules.especie.models.Especie;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import modules.especie.dao.EspecieDao;
import shared.Pagination;
import shared.PaginationResult;
import shared.conn.DBConn;

public class EspecieDaoImpl implements EspecieDao {

    private Connection connection;
    private ResultSet resultSet;
    private Statement statement;

    @Override
    public int create(Especie entity) {
        int id = 0;
        try {
            connection = DBConn.getConnection();

            String sql = "INSERT INTO especie (nombre_comun, nombre_cientifico, familia, abreviatura, talla_minima) "
                    + "VALUES (?, ?, ?, ?, ?)";

            PreparedStatement pst = connection.prepareStatement(sql, PreparedStatement.RETURN_GENERATED_KEYS);
            pst.setString(1, entity.getNombre_comun());
            pst.setString(2, entity.getNombre_cientifico());
            pst.setString(3, entity.getFamilia());
            pst.setString(4, entity.getAbreviatura());
            pst.setDouble(5, entity.getTalla_minima());

            // Ejecutar la inserción
            pst.executeUpdate();

            // Obtener el ID generado
            resultSet = pst.getGeneratedKeys();
            if (resultSet.next()) {
                id = resultSet.getInt(1); // El ID generado es recuperado aquí
            }

            // Asignar el ID al objeto Especie
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
    public Especie find(Object especieId) {
        Especie especie = null;

        try {

            connection = DBConn.getConnection();

            String sql = "select * from especie where id = " + especieId + " limit 1";

            statement = connection.createStatement();

            resultSet = statement.executeQuery(sql);

            if (resultSet.next()) {
                int id = resultSet.getInt("id");
                String nombre_comun = resultSet.getString("nombre_comun");
                String nombre_cientifico = resultSet.getString("nombre_cientifico");
                String familia = resultSet.getString("familia");
                String abreviatura = resultSet.getString("abreviatura");
                double talla_minima = resultSet.getDouble("talla_minima");
                String activa = resultSet.getString("activa");

                especie = new Especie(id, nombre_comun, nombre_cientifico, familia, abreviatura, talla_minima, activa);
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
        return especie;
    }

    @Override
    public ArrayList<Especie> findAll() {
        ArrayList<Especie> especies = new ArrayList<>();

        try {
            connection = DBConn.getConnection();

            String sql = "select * from especie where activa = '1'";

            statement = connection.createStatement();
            resultSet = statement.executeQuery(sql);

            while (resultSet.next()) {
                int id = resultSet.getInt("id");
                String nombre_comun = resultSet.getString("nombre_comun");
                String nombre_cientifico = resultSet.getString("nombre_cientifico");
                String familia = resultSet.getString("familia");
                String abreviatura = resultSet.getString("abreviatura");
                double talla_minima = resultSet.getDouble("talla_minima");
                String activa = resultSet.getString("activa");

                especies.add(new Especie(id, nombre_comun, nombre_cientifico, familia, abreviatura, talla_minima, activa));
            }

            resultSet.close();
            statement.close();
            connection.close();

        } catch (SQLException ex) {
            System.out.println(ex.getMessage());
        }

        return especies;
    }

    @Override
    public void update(Especie entity) {
        try {

            connection = DBConn.getConnection();

            String sql = "update especie set nombre_comun = ?, nombre_cientifico = ?, familia = ?, abreviatura = ?, talla_minima = ?, activa = ? where id = ?";

            PreparedStatement pst = connection.prepareStatement(sql);

            pst.setString(1, entity.getNombre_comun());
            pst.setString(2, entity.getNombre_cientifico());
            pst.setString(3, entity.getFamilia());
            pst.setString(4, entity.getAbreviatura());
            pst.setDouble(5, entity.getTalla_minima());
            pst.setString(6, entity.getActivo());
            pst.setInt(7, entity.getId());

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

            String sql = "update especie set activa = 0 where id = " + id;
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
    public PaginationResult<ArrayList<Especie>, Pagination> paginate(String query, int page, int perPage) {
        ArrayList<Especie> listaEspecies = new ArrayList<>();
        int totalRecords = 0;

        String sql = "SELECT SQL_CALC_FOUND_ROWS * "
                + "FROM especie "
                + "WHERE activa = 1 "
                + (query != null && !query.isEmpty() ? " AND (nombre_comun LIKE ? OR nombre_cientifico LIKE ?)" : "")
                + " ORDER BY id LIMIT ? OFFSET ?";

        try (Connection connection = DBConn.getConnection(); PreparedStatement preparedStatement = connection.prepareStatement(sql)) {

            int paramIndex = 1;
            if (query != null && !query.isEmpty()) {
                preparedStatement.setString(paramIndex++, "%" + query + "%");
                preparedStatement.setString(paramIndex++, "%" + query + "%");
            }

            preparedStatement.setInt(paramIndex++, perPage);
            preparedStatement.setInt(paramIndex++, (page - 1) * perPage);

            try (ResultSet resultSet = preparedStatement.executeQuery()) {
                while (resultSet.next()) {
                    int id = resultSet.getInt("id");
                    String nombre_comun = resultSet.getString("nombre_comun");
                    String nombre_cientifico = resultSet.getString("nombre_cientifico");
                    String familia = resultSet.getString("familia");
                    String abreviatura = resultSet.getString("abreviatura");
                    double talla_minima = resultSet.getDouble("talla_minima");
                    String activa = resultSet.getString("activa");

                    listaEspecies.add(new Especie(id, nombre_comun, nombre_cientifico, familia, abreviatura, talla_minima, activa));
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

        return new PaginationResult<>(listaEspecies, pagination);
    }

}
