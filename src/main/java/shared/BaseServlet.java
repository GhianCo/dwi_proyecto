package shared;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.json.JSONObject;

import java.io.IOException;

public class BaseServlet extends HttpServlet {
    
    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response) throws ServletException  , IOException {
        String origin = request.getHeader("Origin");
        if (origin != null) {
            response.setHeader("Access-Control-Allow-Origin", origin); // Permitir el origen dinámicamente
        }

        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setHeader("Access-Control-Max-Age", "86400"); // Cachear la respuesta preflight por 24 horas
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        
        String requestHeaders = request.getHeader("Access-Control-Request-Headers");
        if (requestHeaders != null) {
            response.setHeader("Access-Control-Allow-Headers", requestHeaders);
        }

        response.setStatus(HttpServletResponse.SC_OK);
    }

    protected void allowCORS(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "*"); // O especifica el origen
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setContentType("application/json");
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
        response.setHeader("Access-Control-Max-Age", "3600");
        response.setHeader("Access-Control-Allow-Headers", "x-requested-with");
    }

    protected void sendJsonResponse(HttpServletResponse response, Object data) throws IOException {
        allowCORS(response);

        JSONObject jsonResponse = new JSONObject(data);
        response.getWriter().write(jsonResponse.toString());
    }
}
