package shared;

import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletResponse;
import org.json.JSONObject;

import java.io.IOException;

public class BaseServlet extends HttpServlet {

    protected void allowCORS(HttpServletResponse response) {
        response.setContentType("text/html;charset=UTF-8");
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
        response.setHeader("Access-Control-Max-Age", "3600");
        response.setHeader("Access-Control-Allow-Headers", "x-requested-with");
    }

    protected void sendJsonResponse(HttpServletResponse response, Object data) throws IOException {
        allowCORS(response);

        response.setContentType("application/json");
        JSONObject jsonResponse = new JSONObject(data);
        response.getWriter().write(jsonResponse.toString());
    }
}
