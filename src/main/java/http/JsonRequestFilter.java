package http;

import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;

@WebFilter("/*")
public class JsonRequestFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        // Solo procesar solicitudes POST que contengan JSON
        if (request instanceof HttpServletRequest) {
            HttpServletRequest httpRequest = (HttpServletRequest) request;

            if (("POST".equalsIgnoreCase(httpRequest.getMethod()) || "PUT".equalsIgnoreCase(httpRequest.getMethod()))
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
}
