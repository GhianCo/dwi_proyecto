package modules.tipotransporte.servlets;

import modules.tipotransporte.servlets.*;
import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.Map;
import modules.tipotransporte.services.impl.TipoTransporteServiceImpl;
import shared.ActionPayload;
import shared.BaseServlet;
import shared.PathInfoExtractor;

public class Delete extends BaseServlet {

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        Map<String, String> params = PathInfoExtractor.extractParams(request);
        String tipotransporteId = params.get("id");

        TipoTransporteServiceImpl tipotransporteservice = new TipoTransporteServiceImpl();
        tipotransporteservice.borrar(tipotransporteId);
        sendJsonResponse(response, new ActionPayload(200, tipotransporteId, "Tipo de transporte eliminado"));
    }

}
