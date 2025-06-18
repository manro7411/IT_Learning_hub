package com.example.api;

import com.example.domain.User;
import com.example.domain.UserRepository;
import com.example.security.JwtService;
import com.example.security.PasswordService;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/auth")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class AuthResource {

    @Inject
    UserRepository userRepo;

    @Inject
    PasswordService passwordService;

    @Inject
    JwtService jwtService;

    @POST
    @Path("/login")
    public Response login(AuthRequest request) {
        User user = userRepo.findByEmail(request.email()).orElse(null);

        if (user == null || !passwordService.verify(request.password(), user.passwordHash)) {
            return Response.status(Response.Status.UNAUTHORIZED).entity("Invalid credentials").build();
        }

        String token = jwtService.generateToken(user);
        return Response.ok(new AuthResponse(token, 3600)).build();
    }
}
