package modules.puntodesembarque.dao.impl;


import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement; 
import java.util.ArrayList;
import java.util.List;
import modules.puntodesembarque.dao.PuntoDesembarqueDao;
import modules.puntodesembarque.models.PuntoDesembarque;
import shared.Pagination;
import shared.PaginationResult;
import shared.conn.DBConn;

public class PuntoDesembarqueDaoImpl implements PuntoDesembarqueDao {

    private static final String INSERT_SQL = 
        "INSERT INTO puntodesembarque (nombre, tipo, ubigeo) VALUES (?, ?, ?)";

    private static final String FIND_BY_ID_SQL = 
        "SELECT * FROM puntodesembarque WHERE id = ?";

    private static final String FIND_ALL_SQL = 
        "SELECT * FROM puntodesembarque";

    private static final String UPDATE_SQL = 
        "UPDATE puntodesembarque SET nombre = ?, tipo = ?, ubigeo = ? WHERE id = ?";

    // Borrado físico:
    private static final String DELETE_SQL = 
        "DELETE FROM puntodesembarque WHERE id = ?";

    // Si quisieras borrado lógico, usarías algo como:
    // private static final String DELETE_SQL = 
    //     "UPDATE puntodesembarque SET activa = '0' WHERE id = ?";

    @Override
    public int create(PuntoDesembarque entity) {
        int idGenerado = 0;
        try (Connection connection = DBConn.getConnection();
             PreparedStatement pst = connection.prepareStatement(INSERT_SQL, Statement.RETURN_GENERATED_KEYS)) {
            
            pst.setString(1, entity.getNombre());
            pst.setString(2, entity.getTipo());
            pst.setString(3, entity.getUbigeo());
            
            pst.executeUpdate();

            // Obtener el ID autogenerado
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
    public PuntoDesembarque find(Object id) {
        try (Connection connection = DBConn.getConnection();
             PreparedStatement pst = connection.prepareStatement(FIND_BY_ID_SQL)) {
            
            pst.setInt(1, (Integer) id);
            try (ResultSet rs = pst.executeQuery()) {
                return rs.next() ? mapResultSetToPuntoDesembarque(rs) : null;
            }
        } catch (SQLException ex) {
            ex.printStackTrace();
        }
        return null;
    }

    @Override
    public List<PuntoDesembarque> findAll() {
        List<PuntoDesembarque> lista = new ArrayList<>();
        try (Connection connection = DBConn.getConnection();
             PreparedStatement pst = connection.prepareStatement(FIND_ALL_SQL);
             ResultSet rs = pst.executeQuery()) {
            
            while (rs.next()) {
                lista.add(mapResultSetToPuntoDesembarque(rs));
            }
        } catch (SQLException ex) {
            ex.printStackTrace();
        }
        return lista;
    }

    @Override
    public void update(PuntoDesembarque entity) {
        try (Connection connection = DBConn.getConnection();
             PreparedStatement pst = connection.prepareStatement(UPDATE_SQL)) {
            
            pst.setString(1, entity.getNombre());
            pst.setString(2, entity.getTipo());
            pst.setString(3, entity.getUbigeo());
            pst.setInt(4, entity.getId());
            
            pst.executeUpdate();
        } catch (SQLException ex) {
            ex.printStackTrace();
        }
    }

    @Override
    public void delete(Object id) {
        try (Connection connection = DBConn.getConnection();
             PreparedStatement pst = connection.prepareStatement(DELETE_SQL)) {
            
            pst.setInt(1, (Integer) id);
            pst.executeUpdate();
        } catch (SQLException ex) {
            ex.printStackTrace();
        }
    }

    private PuntoDesembarque mapResultSetToPuntoDesembarque(ResultSet rs) throws SQLException {
        return new PuntoDesembarque(
            rs.getInt("id"),
            rs.getString("nombre"),
            rs.getString("tipo"),
            rs.getString("ubigeo")
        );
    }

    @Override
    public PaginationResult<List<PuntoDesembarque>, Pagination> paginate(String query, int page, int perPage) {
        List<PuntoDesembarque> lista = new ArrayList<>();
        int totalRecords = 0;

        // Consulta base
        String baseQuery = "SELECT SQL_CALC_FOUND_ROWS * FROM puntodesembarque WHERE 1=1 ";

        // Filtro dinámico si 'query' no está vacío
        if (query != null && !query.isBlank()) {
            baseQuery += " AND (nombre LIKE ? OR tipo LIKE ? OR ubigeo LIKE ?) ";
        }

        // Añadir orden y paginación
        String paginateQuery = baseQuery + " ORDER BY id LIMIT ? OFFSET ?";

        try (Connection connection = DBConn.getConnection();
             PreparedStatement pst = connection.prepareStatement(paginateQuery)) {

            int paramIndex = 1;

            // Parámetros para el filtro
            if (query != null && !query.isBlank()) {
                String likeQuery = "%" + query + "%";
                pst.setString(paramIndex++, likeQuery);
                pst.setString(paramIndex++, likeQuery);
                pst.setString(paramIndex++, likeQuery);
            }

            // Parámetros de paginación
            pst.setInt(paramIndex++, perPage);
            pst.setInt(paramIndex++, (page - 1) * perPage);

            // Ejecutar y mapear resultados
            try (ResultSet rs = pst.executeQuery()) {
                while (rs.next()) {
                    lista.add(mapResultSetToPuntoDesembarque(rs));
                }
            }

            // Obtener el total de registros
            try (Statement countStmt = connection.createStatement();
                 ResultSet countRs = countStmt.executeQuery("SELECT FOUND_ROWS()")) {
                if (countRs.next()) {
                    totalRecords = countRs.getInt(1);
                }
            }
        } catch (SQLException ex) {
            ex.printStackTrace();
            return new PaginationResult<>(List.of(), new Pagination(0, 0, page, perPage));
        }

        int totalPages = (int) Math.ceil((double) totalRecords / perPage);
        return new PaginationResult<>(lista, new Pagination(totalRecords, totalPages, page, perPage));
    }
}
