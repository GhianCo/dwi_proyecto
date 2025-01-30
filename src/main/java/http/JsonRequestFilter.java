package http;

import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import com.auth0.jwt.JWT;
import org.json.JSONObject;

@WebFilter("/*")
public class JsonRequestFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        if (request instanceof HttpServletRequest) {
            HttpServletRequest httpRequest = (HttpServletRequest) request;
            HttpServletResponse httpResponse = (HttpServletResponse) response;

            String uri = httpRequest.getRequestURI();
            String method = httpRequest.getMethod();

            if (uri.contains("/api/")) {

                String authHeader = httpRequest.getHeader("Authorization");

                if (authHeader != null && authHeader.startsWith("Bearer ")) {
                    String token = authHeader.substring(7); // Extraer el token (descontando "Bearer ")

                    try {
                        boolean isValid = validateJwt(token); // Suponiendo que esta función valida el JWT

                        if (!isValid) {
                            sendErrorResponse(httpResponse, 401, "Invalid or expired JWT token.");
                            return;
                        }
                    } catch (Exception e) {
                        sendErrorResponse(httpResponse, 401, "Invalid JWT token.");
                        return;
                    }
                } else {
                    sendErrorResponse(httpResponse, 401, "Authorization header missing or invalid.");
                    return;
                }
            }

            if (("POST".equalsIgnoreCase(method) || "PUT".equalsIgnoreCase(method))
                    && "application/json".equalsIgnoreCase(httpRequest.getContentType())) {

                JsonRequestWrapper wrappedRequest = new JsonRequestWrapper(httpRequest);

                chain.doFilter(wrappedRequest, response);
                return;
            }
        }

        chain.doFilter(request, response);
    }

    @Override
    public void destroy() {
    }

    private boolean validateJwt(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256("pwd_proyecto_2025!-!");

            JWTVerifier verifier = JWT.require(algorithm)
                    .build();
            return verifier.verify(token) != null;
        } catch (Exception exception) {
            System.out.println("Invalid token: " + exception.getMessage());
            return false;
        }
    }

    private void sendErrorResponse(HttpServletResponse httpResponse, int code, String message) throws IOException {
        JSONObject jsonResponse = new JSONObject();
        jsonResponse.put("code", code);

        JSONObject data = new JSONObject();
        data.put("message", message);

        jsonResponse.put("message", message);

        httpResponse.setContentType("application/json");
        httpResponse.setStatus(code);

        httpResponse.getWriter().write(jsonResponse.toString());
    }
}
