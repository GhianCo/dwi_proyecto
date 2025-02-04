package modules.conductor.servlets;

import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.Map;
import modules.conductor.services.impl.ConductorServiceImpl;
import shared.ActionPayload;
import shared.BaseServlet;
import shared.PathInfoExtractor;

public class Delete extends BaseServlet {

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        Map<String, String> params = PathInfoExtractor.extractParams(request);
        String conductorId = params.get("id");

        ConductorServiceImpl conductorservice = new ConductorServiceImpl();
        conductorservice.borrar(conductorId);
        sendJsonResponse(response, new ActionPayload(200, conductorId, "Conductor eliminado"));
    }

}
