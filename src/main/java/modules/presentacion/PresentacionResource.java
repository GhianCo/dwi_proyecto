package modules.presentacion;

import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.Response;
import modules.presentacion.dto.PresentacionCreateRequestDTO;
import modules.presentacion.models.Presentacion;
import modules.presentacion.services.impl.PresentacionServiceImpl;
import shared.ActionPayload;
import shared.PaginationResult;

@Path("presentacion")
public class PresentacionResource {
    
    @GET
    @Path("getAll")
    public Response getAll(
            @DefaultValue("") @QueryParam("query") String query,
            @DefaultValue("1") @QueryParam("page") String page,
            @DefaultValue("10") @QueryParam("perPage") String perPage
    ) {
        PresentacionServiceImpl presentacionservice = new PresentacionServiceImpl();
        PaginationResult data = presentacionservice.paginate(query, Integer.parseInt(page), Integer.parseInt(perPage));

        return Response
                .status(Response.Status.OK)
                .entity(new ActionPayload(200, data.getData(), "Lista de tipo presentaciones", data.getPagination()))
                .build();
    }

    @GET
    @Path("{id}")
    public Response getOne(@PathParam("id") String presentacionId) {
        PresentacionServiceImpl presentacionservice = new PresentacionServiceImpl();
        Presentacion presentacion = presentacionservice.buscar(presentacionId);
        return Response
                .status(Response.Status.OK)
                .entity(new ActionPayload(200, presentacion, "Tipo presentacion encontrado"))
                .build();
    }

    @POST
    public Response create(PresentacionCreateRequestDTO presentacionCreateRequestDTO) {
        PresentacionServiceImpl presentacionservice = new PresentacionServiceImpl();
        Presentacion data = presentacionservice.createPresentacion(presentacionCreateRequestDTO);
        return Response
                .status(Response.Status.OK)
                .entity(new ActionPayload(201, data, "Tipo presentacion creado exitosamente"))
                .build(); 
    }

    @POST
    @Path("{id}")
    public Response update(@PathParam("id") int presentacionId, PresentacionCreateRequestDTO presentacionCreateRequestDTO) {
        PresentacionServiceImpl presentacionservice = new PresentacionServiceImpl();
        presentacionCreateRequestDTO.setId(presentacionId);
        Presentacion data = presentacionservice.updatePresentacion(presentacionCreateRequestDTO);
        return Response
                .status(Response.Status.OK)
                .entity(new ActionPayload(200, data, "Tipo presentacion actualizado exitosamente"))
                .build();
    }
    
    @DELETE
    @Path("{id}")
    public Response delete(@PathParam("id") int presentacionId) {
        PresentacionServiceImpl presentacionservice = new PresentacionServiceImpl();
        presentacionservice.borrar(presentacionId);
        return Response
                .status(Response.Status.OK)
                .entity(new ActionPayload(200, presentacionId, "Tipo presentacion eliminado exitosamente"))
                .build();
    }
}

