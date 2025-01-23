package servlets;

import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import models.entities.Usuario;
import services.impl.UsuarioServiceImpl;

@WebServlet(name = "LoginSv", urlPatterns = {"/LoginSv"})
public class LoginSv extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String usuario = request.getParameter("usuario");
        String clave = request.getParameter("clave");

        Usuario usuario_login = new Usuario();

        Usuario usuarioObj = new Usuario();
        usuarioObj.setNick(usuario);
        usuarioObj.setClave(String.valueOf(clave));

        UsuarioServiceImpl usuarioservice = new UsuarioServiceImpl();
        usuario_login = usuarioservice.login(usuarioObj);
        request.setAttribute("errorMessage", null);
        
        if (usuario_login.getNick() != null) {
            response.sendRedirect("index.jsp");  // Redirigir al index
        } else {
            request.setAttribute("errorMessage", "Credenciales inválidas, intenta nuevamente.");
            request.getRequestDispatcher("/login.jsp").forward(request, response);
        }
    }

    @Override
    public String getServletInfo() {
        return "Short description";
    }

}
