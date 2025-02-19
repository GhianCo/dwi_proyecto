package modules.tipotransporte;

import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.Response;
import modules.tipotransporte.dto.TipoTransporteCreateRequestDTO;
import modules.tipotransporte.models.TipoTransporte;
import modules.tipotransporte.services.impl.TipoTransporteServiceImpl;
import shared.ActionPayload;
import shared.PaginationResult;

@Path("tipotransporte")
public class TipotransporteResource {
    
    @GET
    @Path("getAll")
    public Response getAll(
            @DefaultValue("") @QueryParam("query") String query,
            @DefaultValue("1") @QueryParam("page") String page,
            @DefaultValue("10") @QueryParam("perPage") String perPage
    ) {
        TipoTransporteServiceImpl tipotransporteservice = new TipoTransporteServiceImpl();
        PaginationResult data = tipotransporteservice.paginate(query, Integer.parseInt(page), Integer.parseInt(perPage));

        return Response
                .status(Response.Status.OK)
                .entity(new ActionPayload(200, data.getData(), "Lista de tipo transportes", data.getPagination()))
                .build();
    }

    @GET
    @Path("{id}")
    public Response getOne(@PathParam("id") String tipotransporteId) {
        TipoTransporteServiceImpl tipotransporteservice = new TipoTransporteServiceImpl();
        TipoTransporte tipotransporte = tipotransporteservice.buscar(tipotransporteId);
        return Response
                .status(Response.Status.OK)
                .entity(new ActionPayload(200, tipotransporte, "Tipo transporte encontrado"))
                .build();
    }

    @POST
    public Response create(TipoTransporteCreateRequestDTO tipotransporteCreateRequestDTO) {
        TipoTransporteServiceImpl tipotransporteservice = new TipoTransporteServiceImpl();
        TipoTransporte data = tipotransporteservice.createTipoTransporteAndPersona(tipotransporteCreateRequestDTO);
        return Response
                .status(Response.Status.OK)
                .entity(new ActionPayload(201, data, "Tipo transporte creado exitosamente"))
                .build(); 
    }

    @PUT
    @Path("{id}")
    public Response update(@PathParam("id") int tipotransporteId, TipoTransporteCreateRequestDTO tipotransporteCreateRequestDTO) {
        TipoTransporteServiceImpl tipotransporteservice = new TipoTransporteServiceImpl();
        tipotransporteCreateRequestDTO.setId(tipotransporteId);
        TipoTransporte data = tipotransporteservice.updateTipoTransporteAndPersona(tipotransporteCreateRequestDTO);
        return Response
                .status(Response.Status.OK)
                .entity(new ActionPayload(200, data, "Tipo transporte actualizado exitosamente"))
                .build();
    }
    
    @DELETE
    @Path("{id}")
    public Response delete(@PathParam("id") int tipotransporteId) {
        TipoTransporteServiceImpl tipotransporteservice = new TipoTransporteServiceImpl();
        tipotransporteservice.borrar(tipotransporteId);
        return Response
                .status(Response.Status.OK)
                .entity(new ActionPayload(200, tipotransporteId, "Tipo transporte eliminado exitosamente"))
                .build();
    }
}
