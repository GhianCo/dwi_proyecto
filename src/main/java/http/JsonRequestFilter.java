package http;

import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;

@WebFilter("/*") // Aplica el filtro a todas las solicitudes
public class JsonRequestFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // No es necesario realizar ninguna inicialización
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        // Solo procesar solicitudes POST que contengan JSON
        if (request instanceof HttpServletRequest) {
            HttpServletRequest httpRequest = (HttpServletRequest) request;

            // Procesar solo solicitudes POST con tipo de contenido 'application/json'
            if ("POST".equalsIgnoreCase(httpRequest.getMethod())
                    && "application/json".equalsIgnoreCase(httpRequest.getContentType())) {

                // Envolver la solicitud original con el JsonRequestWrapper
                JsonRequestWrapper wrappedRequest = new JsonRequestWrapper(httpRequest);

                // Continuar la cadena de filtros o servir la solicitud al servlet
                chain.doFilter(wrappedRequest, response);
                return;
            }
        }

        // Si no es una solicitud POST con JSON, simplemente continuar con el siguiente filtro o servlet
        chain.doFilter(request, response);
    }

    @Override
    public void destroy() {
        // No es necesario realizar ninguna acción al destruir el filtro
    }
}
