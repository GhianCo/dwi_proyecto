package utils;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBConn {
    private static String driver = null;
    private static String usuario = null;
    private static String password = null;
    private static String url = null;

    static {
        try {
            url = "jdbc:mysql://localhost:3306/mapisa_car?autoReconnect=true&useSSL=false";
            driver = "com.mysql.jdbc.Driver";
            usuario = "root";
            password = "";

            Class.forName(driver);

        } catch (ClassNotFoundException e) {
            System.out.println(Util.error1);
        }
    }

    public static Connection getConnection() {
        Connection connection = null;
        try {
            connection = DriverManager.getConnection(url, usuario, password);
        } catch (SQLException e) {
            System.out.println("Error:" + e);
        }
        return connection;
    }
}
