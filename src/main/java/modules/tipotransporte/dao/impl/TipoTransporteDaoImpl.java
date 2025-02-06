package modules.tipotransporte.dao.impl;

import modules.tipotransporte.models.TipoTransporte;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import modules.tipotransporte.dao.TipoTransporteDao;
import shared.Pagination;
import shared.PaginationResult;
import shared.conn.DBConn;

public class TipoTransporteDaoImpl implements TipoTransporteDao {

    private Connection connection;
    private ResultSet resultSet;
    private CallableStatement callableStatement;
    private Statement statement;

    @Override
    public int create(TipoTransporte entity) {
        int id = 0;
        try {

            connection = DBConn.getConnection();

            String sql = "insert into tipotransporte (persona_id, tipo, matricula, capacidad_carga) "
                    + "values (?,?,?,?)";

            PreparedStatement pst = connection.prepareStatement(sql, PreparedStatement.RETURN_GENERATED_KEYS);

            pst.setInt(1, entity.getPersona_id());
            pst.setString(2, entity.getTipo());
            pst.setString(3, entity.getMatricula());
            pst.setString(4, entity.getCapacidad_carga());

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
    public TipoTransporte find(Object tipotransporteId) {
        TipoTransporte tipotransporte = null;

        try {

            connection = DBConn.getConnection();

            String sql = "select t.id, t.persona_id, t.tipo, t.matricula, t.capacidad_carga, p.nombres, p.apellidos, p.numero_documento from tipotransporte t, persona p where t.persona_id = p.id and t.activo = 1 and t.id = " + tipotransporteId + " limit 1";

            statement = connection.createStatement();

            resultSet = statement.executeQuery(sql);

            if (resultSet.next()) {
                int id = resultSet.getInt("id");
                int personaId = resultSet.getInt("persona_id");
                String nombres = resultSet.getString("nombres");
                String apellidos = resultSet.getString("apellidos");
                String numero_documento = resultSet.getString("numero_documento");

                tipotransporte = new TipoTransporte(id, personaId, nombres, apellidos, numero_documento);

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
        return tipotransporte;
    }

    @Override
    public ArrayList<TipoTransporte> findAll() {
        throw new UnsupportedOperationException("Not supported yet."); // Generated from nbfs://nbhost/SystemFileSystem/Templates/Classes/Code/GeneratedMethodBody
    }

    @Override
    public void update(TipoTransporte entity) {
        try {

            connection = DBConn.getConnection();

            String sql = "update tipotransporte set tipo = ?, matricula =?, capacidad_carga=? where id = ?";

            PreparedStatement pst = connection.prepareStatement(sql);

            pst.setString(1, entity.getTipo());
            pst.setString(2, entity.getMatricula());
            pst.setString(3, entity.getCapacidad_carga());
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

            String sql = "update tipotransporte set activo = 0 where id = " + id;
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
    public PaginationResult<ArrayList<TipoTransporte>, Pagination> paginate(String query, int page, int perPage) {
        ArrayList<TipoTransporte> listadeTipoTransportes = new ArrayList<>();
        int totalRecords = 0;

        String sql = "SELECT SQL_CALC_FOUND_ROWS t.id, t.persona_id, p.nombres, p.apellidos, p.numero_documento "
                + "FROM tipotransporte t "
                + "JOIN persona p ON t.persona_id = p.id "
                + "WHERE t.activo = 1 "
                + (query != null && !query.isEmpty() ? " AND (p.nombres LIKE ? OR p.apellidos LIKE ? OR p.numero_documento LIKE ?)" : "")
                + " ORDER BY t.id LIMIT ? OFFSET ?";

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

                    listadeTipoTransportes.add(new TipoTransporte(id, personaId, nombres, apellidos, numero_documento));
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

        return new PaginationResult<>(listadeTipoTransportes, pagination);

    }

}

