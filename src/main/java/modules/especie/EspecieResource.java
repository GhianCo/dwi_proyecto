package modules.especie;

import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.Response;
import modules.especie.dto.EspecieCreateRequestDTO;
import modules.especie.models.Especie;
import modules.especie.services.impl.EspecieServiceImpl;
import shared.ActionPayload;
import shared.PaginationResult;

@Path("especie")
public class EspecieResource {

    @GET
    @Path("getAll")
    public Response getAll(
            @DefaultValue("") @QueryParam("query") String query,
            @DefaultValue("1") @QueryParam("page") String page,
            @DefaultValue("10") @QueryParam("perPage") String perPage
    ) {
        EspecieServiceImpl especieservice = new EspecieServiceImpl();
        PaginationResult data = especieservice.paginate(query, Integer.parseInt(page), Integer.parseInt(perPage));

        return Response
                .status(Response.Status.OK)
                .entity(new ActionPayload(200, data.getData(), "Lista de especies", data.getPagination()))
                .build();
    }

    @GET
    @Path("{id}")
    public Response getOne(@PathParam("id") String especieId) {
        EspecieServiceImpl especieservice = new EspecieServiceImpl();
        Especie especie = especieservice.buscar(especieId);
        return Response
                .status(Response.Status.OK)
                .entity(new ActionPayload(200, especie, "Especie encontrada"))
                .build();
    }

    @POST
    public Response create(EspecieCreateRequestDTO especieCreateRequestDTO) {
        EspecieServiceImpl especieservice = new EspecieServiceImpl();
        Especie data = especieservice.createEspecie(especieCreateRequestDTO);
        return Response
                .status(Response.Status.OK)
                .entity(new ActionPayload(201, data, "Especie creada exitosamente"))
                .build();
    }

    @PUT
    @Path("{id}")
    public Response update(@PathParam("id") int especieId, EspecieCreateRequestDTO especieCreateRequestDTO) {
        EspecieServiceImpl especieservice = new EspecieServiceImpl();
        especieCreateRequestDTO.setId(especieId);
        Especie data = especieservice.updateEspecie(especieCreateRequestDTO);
        return Response
                .status(Response.Status.OK)
                .entity(new ActionPayload(200, data, "Especie actualizada exitosamente"))
                .build();
    }
    
    @DELETE
    @Path("{id}")
    public Response delete(@PathParam("id") int especieId) {
        EspecieServiceImpl especieservice = new EspecieServiceImpl();
        especieservice.borrar(especieId);
        return Response
                .status(Response.Status.OK)
                .entity(new ActionPayload(200, especieId, "Especie eliminada exitosamente"))
                .build();
    }
}
