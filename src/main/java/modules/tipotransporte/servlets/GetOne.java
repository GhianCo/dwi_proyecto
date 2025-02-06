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
import modules.tipotransporte.models.TipoTransporte;

public class GetOne extends BaseServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        Map<String, String> params = PathInfoExtractor.extractParams(request);
        String tipotransporteId = params.get("id");
        
        TipoTransporteServiceImpl tipotransporteservice = new TipoTransporteServiceImpl();
        TipoTransporte tipotransporte = tipotransporteservice.buscar(tipotransporteId);
        sendJsonResponse(response, new ActionPayload(200, tipotransporte, "Tipo de transporte encontrado"));
    }

}
