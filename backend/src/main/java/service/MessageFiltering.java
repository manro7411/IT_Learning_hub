package service;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Request;
import jakarta.ws.rs.core.Response;
import model.ErrorResponse;
import model.MessageRequest;

@Path("/filtering")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class MessageFiltering {

    @Inject
    MessageFilteringService filteringService;
    @Inject
    PublicApiService publicApiService;
    @Inject
    Request request;

    @POST
    public Response filter(MessageRequest request){
        if (!filteringService.isValid(request.getMsg())){
            return Response.status(Response.Status.BAD_REQUEST).entity(new ErrorResponse("Message contains inappropriate content")).build();
        }
        var apiResponse = publicApiService.sendingOut(request.getMsg());

        System.out.println("Received message: " + request.getMsg());
        return Response.ok(apiResponse).build();
    }


}
