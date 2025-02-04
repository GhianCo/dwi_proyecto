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
import modules.conductor.models.Conductor;

public class GetOne extends BaseServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        Map<String, String> params = PathInfoExtractor.extractParams(request);
        String conductorId = params.get("id");
        
        ConductorServiceImpl conductorservice = new ConductorServiceImpl();
        Conductor conductor = conductorservice.buscar(conductorId);
        sendJsonResponse(response, new ActionPayload(200, conductor, "Conductor encontrado"));
    }

}
