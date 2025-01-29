package modules.persona.dao.impl;

import shared.Persona;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.CallableStatement;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import modules.persona.dao.PersonaDao;
import shared.PaginationResult;
import shared.conn.DBConn;

public class PersonaDaoImpl implements PersonaDao {

    private Connection connection;
    private ResultSet resultSet;
    private CallableStatement callableStatement;
    private Statement statement;

    @Override
    public int create(Persona entity) {
        int id = 0;
        try {

            connection = DBConn.getConnection();

            String sql = "insert into persona (nombres, apellidos, dni, telefono, email, direccion) "
                    + "values (?,?,?,?,?,?)";

            PreparedStatement pst = connection.prepareStatement(sql, PreparedStatement.RETURN_GENERATED_KEYS);

            pst.setString(1, entity.getNombres());
            pst.setString(2, entity.getApellidos());
            pst.setString(3, entity.getDni());
            pst.setString(4, entity.getTelefono());
            pst.setString(5, entity.getEmail());
            pst.setString(6, entity.getDireccion());

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
    public Persona find(Object personaId) {
        throw new UnsupportedOperationException("Not supported yet."); // Generated from
                                                                       // nbfs://nbhost/SystemFileSystem/Templates/Classes/Code/GeneratedMethodBody
    }

    @Override
    public ArrayList<Persona> findAll() {
        throw new UnsupportedOperationException("Not supported yet."); // Generated from
                                                                       // nbfs://nbhost/SystemFileSystem/Templates/Classes/Code/GeneratedMethodBody
    }

    @Override
    public void update(Persona entity) {
        throw new UnsupportedOperationException("Not supported yet."); // Generated from
                                                                       // nbfs://nbhost/SystemFileSystem/Templates/Classes/Code/GeneratedMethodBody
    }

    @Override
    public void delete(Object id) {
        throw new UnsupportedOperationException("Not supported yet."); // Generated from
                                                                       // nbfs://nbhost/SystemFileSystem/Templates/Classes/Code/GeneratedMethodBody
    }

    @Override
    public PaginationResult<Object, Object> paginate(String query, int page, int perPage) {
        throw new UnsupportedOperationException("Not supported yet."); // Generated from
                                                                       // nbfs://nbhost/SystemFileSystem/Templates/Classes/Code/GeneratedMethodBody
    }

}
