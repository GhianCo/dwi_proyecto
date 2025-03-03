package modules.destino;

import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.Response;
import modules.destino.dto.DestinoCreateRequestDTO;
import modules.destino.models.Destino;
import modules.destino.services.impl.DestinoServiceImpl;
import shared.ActionPayload;
import shared.PaginationResult;

@Path("destino")
public class DestinoResource {
    
    @GET
    @Path("getAll")
    public Response getAll(
            @DefaultValue("") @QueryParam("query") String query,
            @DefaultValue("1") @QueryParam("page") String page,
            @DefaultValue("10") @QueryParam("perPage") String perPage
    ) {
        DestinoServiceImpl destinoservice = new DestinoServiceImpl();
        PaginationResult data = destinoservice.paginate(query, Integer.parseInt(page), Integer.parseInt(perPage));

        return Response
                .status(Response.Status.OK)
                .entity(new ActionPayload(200, data.getData(), "Lista de tipo destinos", data.getPagination()))
                .build();
    }

    @GET
    @Path("{id}")
    public Response getOne(@PathParam("id") String destinoId) {
        DestinoServiceImpl destinoservice = new DestinoServiceImpl();
        Destino destino = destinoservice.buscar(destinoId);
        return Response
                .status(Response.Status.OK)
                .entity(new ActionPayload(200, destino, "Tipo destino encontrado"))
                .build();
    }

    @POST
    public Response create(DestinoCreateRequestDTO destinoCreateRequestDTO) {
        DestinoServiceImpl destinoservice = new DestinoServiceImpl();
        Destino data = destinoservice.createDestino(destinoCreateRequestDTO);
        return Response
                .status(Response.Status.OK)
                .entity(new ActionPayload(201, data, "Tipo destino creado exitosamente"))
                .build(); 
    }

    @POST
    @Path("{id}")
    public Response update(@PathParam("id") int destinoId, DestinoCreateRequestDTO destinoCreateRequestDTO) {
        DestinoServiceImpl destinoservice = new DestinoServiceImpl();
        destinoCreateRequestDTO.setId(destinoId);
        Destino data = destinoservice.updateDestino(destinoCreateRequestDTO);
        return Response
                .status(Response.Status.OK)
                .entity(new ActionPayload(200, data, "Tipo destino actualizado exitosamente"))
                .build();
    }
    
    @DELETE
    @Path("{id}")
    public Response delete(@PathParam("id") int destinoId) {
        DestinoServiceImpl destinoservice = new DestinoServiceImpl();
        destinoservice.borrar(destinoId);
        return Response
                .status(Response.Status.OK)
                .entity(new ActionPayload(200, destinoId, "Tipo destino eliminado exitosamente"))
                .build();
    }
}
