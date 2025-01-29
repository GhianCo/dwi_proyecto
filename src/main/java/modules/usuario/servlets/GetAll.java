package modules.usuario.servlets;

import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import modules.usuario.services.impl.UsuarioServiceImpl;
import shared.ActionPayload;
import shared.BaseServlet;
import shared.PaginationResult;

public class GetAll extends BaseServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String query = request.getParameter("query");
        String page = request.getParameter("page");
        String perPage = request.getParameter("perPage");

        query = (query != null && !query.isEmpty()) ? query : "";
        page = (page != null && !page.isEmpty()) ? page : "1";
        perPage = (perPage != null && !perPage.isEmpty()) ? perPage : "10";

        UsuarioServiceImpl usuarioservice = new UsuarioServiceImpl();
        PaginationResult data = usuarioservice.paginate(query, Integer.parseInt(page), Integer.parseInt(perPage));
        sendJsonResponse(response, new ActionPayload(200, data.getData(), "Lista de usuarios", data.getPagination()));
    }
}
