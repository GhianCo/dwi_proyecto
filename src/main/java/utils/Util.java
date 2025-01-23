package utils;

import java.util.ResourceBundle;

public class Util {

    public static final int STM = 0;
    public static final int PST = 1;
    public static final int CST = 2;
    public static int opc;
    public static String error1;

    static {
        ResourceBundle properties = ResourceBundle.getBundle("utils.config");
        error1 = properties.getString("error1");
        opc = Integer.parseInt(properties.getString("opc"));
    }
}
