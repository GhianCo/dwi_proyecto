package modules.tipotransporte.servlets;

import modules.tipotransporte.servlets.*;
import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.List;
import modules.tipotransporte.services.impl.TipoTransporteServiceImpl;
import shared.ActionPayload;
import shared.BaseServlet;
import shared.PaginationResult;
import modules.tipotransporte.models.TipoTransporte;

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

        TipoTransporteServiceImpl tipotransporteservice = new TipoTransporteServiceImpl();
        PaginationResult<List<TipoTransporte>, Object> data = tipotransporteservice.paginate(query, Integer.parseInt(page), Integer.parseInt(perPage));
        sendJsonResponse(response, new ActionPayload(200, data.getData(), "Lista de transportes", data.getPagination()));
    }
}
