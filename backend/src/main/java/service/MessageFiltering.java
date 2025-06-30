package service;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import model.ErrorResponse;
import model.MessageRequest;
import java.util.HashMap;
import java.util.Map;

@Path("/filtering")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class MessageFiltering {

    @Inject
    MessageFilteringService filteringService;

    @Inject
    PublicApiService publicApiService;

    @POST
    public Response filter(MessageRequest request) {
        Map<String, String> result = new HashMap<>();

        if (request == null || request.getMsg() == null || request.getMsg().isBlank()) {
            result.put("message", "กรุณากรอกข้อความ");
            return Response.ok(result).build();
        }

        System.out.println("🔍 Checking message: " + request.getMsg());

        if (!filteringService.isValid(request.getMsg())) {
            System.out.println("❌ Blocked by filter");
            result.put("message", "ข้อความนี้ไม่เหมาะสม");
            return Response.ok(result).build();
        }

        try {
            var reply = publicApiService.sendingOut(request.getMsg());
            result.put("content", reply);
            return Response.ok(result).build();
        } catch (Exception e) {
            e.printStackTrace();
            result.put("message", "ไม่สามารถติดต่อ AI ได้ในขณะนี้");
            return Response.ok(result).build();
        }
    }
}
