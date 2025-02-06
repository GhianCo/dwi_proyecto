package modules.embarcacion.dao.impl;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Statement;
import modules.embarcacion.dao.EmbarcacionDao;
import modules.embarcacion.models.Embarcacion;
import shared.conn.DBConn;

import java.util.ArrayList;
import java.util.List;
import shared.Pagination;
import shared.PaginationResult;

public class EmbarcacionDaoImpl implements EmbarcacionDao {

    private static final String INSERT_SQL
            = "INSERT INTO embarcacion "
            + "(persona_id, nombre, matricula, capacidad_bodega, permiso_pesca, regimen) "
            + "VALUES (?, ?, ?, ?, ?, ?)";

    private static final String FIND_BY_ID_SQL
            = "SELECT * FROM embarcacion "
            + "WHERE id = ? AND activa = '1'";

    private static final String FIND_ALL_SQL
            = "SELECT * FROM embarcacion "
            + "WHERE activa = '1'";

    private static final String UPDATE_SQL
            = "UPDATE embarcacion "
            + "SET persona_id = ?, nombre = ?, matricula = ?, capacidad_bodega = ?, permiso_pesca = ?, regimen = ? "
            + "WHERE id = ?";

    private static final String DELETE_SQL
            = "UPDATE embarcacion "
            + "SET activa = '0' "
            + "WHERE id = ?";

    @Override
    public int create(Embarcacion entity) {
        int idGenerado = 0;
        try (Connection connection = DBConn.getConnection(); PreparedStatement pst = connection.prepareStatement(INSERT_SQL, Statement.RETURN_GENERATED_KEYS)) {
            
            pst.setInt(1, entity.getPersona_id());
            pst.setString(2, entity.getNombre());
            pst.setString(3, entity.getMatricula());
            pst.setDouble(4, entity.getCapacidad_bodega());
            pst.setString(5, entity.getPermiso_pesca());
            pst.setString(6, entity.getRegimen());

            pst.executeUpdate();

            try (ResultSet resultSet = pst.getGeneratedKeys()) {
                if (resultSet.next()) {
                    idGenerado = resultSet.getInt(1);
                    entity.setId(idGenerado);
                }
                
            }
            
        } catch (SQLException ex) {
            ex.printStackTrace();
        }
        return idGenerado;
    }

    @Override
    public Embarcacion find(Object id) {
        try (Connection connection = DBConn.getConnection(); PreparedStatement pst = connection.prepareStatement(FIND_BY_ID_SQL)) {

            pst.setInt(1, (Integer) id);
            try (ResultSet rs = pst.executeQuery()) {
                return rs.next() ? mapResultSetToEmbarcacion(rs) : null;
            }
        } catch (SQLException ex) {
            ex.printStackTrace();
        }
        return null;
    }

    @Override 
    public List<Embarcacion> findAll() {
        List<Embarcacion> embarcaciones = new ArrayList<>();
        try (Connection connection = DBConn.getConnection(); PreparedStatement pst = connection.prepareStatement(FIND_ALL_SQL); ResultSet rs = pst.executeQuery()) {

            while (rs.next()) {
                embarcaciones.add(mapResultSetToEmbarcacion(rs));
            }
        } catch (SQLException ex) {
            ex.printStackTrace();
        }
        return embarcaciones;
    }

    @Override
    public void update(Embarcacion entity) {
        try (Connection connection = DBConn.getConnection(); PreparedStatement pst = connection.prepareStatement(UPDATE_SQL)) {

            pst.setInt(1, entity.getPersona_id());
            pst.setString(2, entity.getNombre());
            pst.setString(3, entity.getMatricula());
            pst.setDouble(4, entity.getCapacidad_bodega());
            pst.setString(5, entity.getPermiso_pesca());
            pst.setString(6, entity.getRegimen());
            pst.setInt(7, entity.getId());

            pst.executeUpdate();
        } catch (SQLException ex) {
            ex.printStackTrace();
        }
    }

    @Override
    public void delete(Object id) {
        try (Connection connection = DBConn.getConnection(); PreparedStatement pst = connection.prepareStatement(DELETE_SQL)) {

            pst.setInt(1, (Integer) id);
            pst.executeUpdate();
        } catch (SQLException ex) {
            ex.printStackTrace();
        }
    }

    private Embarcacion mapResultSetToEmbarcacion(ResultSet rs) throws SQLException {
        return new Embarcacion(
                rs.getInt("id"),
                rs.getInt("persona_id"),
                rs.getString("nombre"),
                rs.getString("matricula"),
                rs.getDouble("capacidad_bodega"),
                rs.getString("permiso_pesca"),
                rs.getString("regimen"),
                rs.getString("activa")
        );
    }

    @Override
    public PaginationResult<List<Embarcacion>, Pagination> paginate(String query, int page, int perPage) {
        List<Embarcacion> embarcaciones = new ArrayList<>();
        int totalRecords = 0;

        // Construcción dinámica de la consulta con filtro seguro
        String baseQuery
                = "SELECT SQL_CALC_FOUND_ROWS * FROM embarcacion "
                + "WHERE activa = '1' ";

        // Se agrega filtro dinámico si 'query' no está vacío
        if (query != null && !query.isBlank()) {
            baseQuery += " AND (nombre LIKE ? OR matricula LIKE ? OR permiso_pesca LIKE ?) ";
        }

        // Se añade ordenación y paginación
        String paginateQuery = baseQuery + " ORDER BY id LIMIT ? OFFSET ?";
        
        System.out.println("LISTO " + paginateQuery );
        
        try (Connection connection = DBConn.getConnection(); PreparedStatement pst = connection.prepareStatement(paginateQuery)) {

            int paramIndex = 1;

            // Si la query tiene filtro, se agregan parámetros seguros
            if (query != null && !query.isBlank()) {
                String likeQuery = "%" + query + "%";
                pst.setString(paramIndex++, likeQuery);
                pst.setString(paramIndex++, likeQuery);
                pst.setString(paramIndex++, likeQuery);
            }

            // Parámetros para la paginación
            pst.setInt(paramIndex++, perPage);
            pst.setInt(paramIndex++, (page - 1) * perPage);

            // Ejecución de la consulta
            try (ResultSet rs = pst.executeQuery()) {
                while (rs.next()) {
                    embarcaciones.add(mapResultSetToEmbarcacion(rs));
                }
            }

            // Obtener el total de registros con una consulta separada
            try (Statement countStmt = connection.createStatement(); ResultSet countResultSet = countStmt.executeQuery("SELECT FOUND_ROWS()")) {
                if (countResultSet.next()) {
                    totalRecords = countResultSet.getInt(1);
                }
            }

        } catch (SQLException ex) {
            ex.printStackTrace();
            return new PaginationResult<>(List.of(), new Pagination(0, 0, page, perPage));
        }

        int totalPages = (int) Math.ceil((double) totalRecords / perPage);
        return new PaginationResult<>(embarcaciones, new Pagination(totalRecords, totalPages, page, perPage));
    }
}
