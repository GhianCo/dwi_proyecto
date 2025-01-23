package api.usuario;

import http.JsonRequestWrapper;
import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import models.entities.Usuario;
import org.json.JSONObject;
import services.impl.UsuarioServiceImpl;

public class LoginCtrl extends HttpServlet {

    protected void allowCORS(HttpServletResponse response) {
        response.setContentType("text/html;charset=UTF-8");
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
        response.setHeader("Access-Control-Max-Age", "3600");
        response.setHeader("Access-Control-Allow-Headers", "x-requested-with");
    }

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        allowCORS(response);

        // Obtener el cuerpo JSON de la solicitud utilizando el JsonRequestWrapper
        JsonRequestWrapper wrappedRequest = (JsonRequestWrapper) request;
        String jsonBody = wrappedRequest.getJsonBody();

        // Convertir el cuerpo JSON en un JSONObject
        JSONObject jsonRequest = new JSONObject(jsonBody);

        String usuario = jsonRequest.optString("usuario");
        String clave = jsonRequest.optString("clave");

        Usuario usuario_login = new Usuario();

        Usuario usuarioObj = new Usuario();
        usuarioObj.setNick(usuario);
        usuarioObj.setClave(String.valueOf(clave));

        UsuarioServiceImpl usuarioservice = new UsuarioServiceImpl();
        usuario_login = usuarioservice.login(usuarioObj);

        JSONObject jsonResponse = new JSONObject();
        jsonResponse.put("success", true);
        jsonResponse.put("data", "");
        if (usuario_login.getNick() != null) {
            JSONObject data = new JSONObject();
            data.put("nombres", usuario_login.getNombres());
            data.put("apellidos", usuario_login.getApellidos());

            jsonResponse.put("data", data);
        } else {
            jsonResponse.put("success", false);
        }

        response.setContentType("application/json");
        response.getWriter().write(jsonResponse.toString());
    }

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        allowCORS(resp);
    }

    @Override
    public String getServletInfo() {
        return "Short description";
    }

}
