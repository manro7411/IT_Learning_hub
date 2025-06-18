package com.example.security;

import com.example.domain.User;
import io.smallrye.jwt.build.Jwt;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class JwtService {

    public String generateToken(User user) {
        return Jwt.issuer("it-learning-platform")
                .subject(user.email)
                .upn(user.email)
                .claim("groups", user.role.name())
                .expiresAt(System.currentTimeMillis() / 1000 + 3600)
                .sign();
    }
}
