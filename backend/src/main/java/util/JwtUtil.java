package util;

import io.smallrye.jwt.build.Jwt;

import java.time.Duration;
import java.util.Map;
import java.util.Set;

public class JwtUtil {
    public static String generateToken(String email, String role, String name) {
        try {
            return Jwt.claims(Map.of(
                            "email", email,
                            "role", role,
                            "name", name,
                            "upn", email
                    ))
                    .issuer("https://example.com/issuer")
                    .subject(email)
                    .groups(Set.of(role))
                    .expiresIn(Duration.ofHours(2))
                    .sign();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate JWT token: " + e.getMessage(), e);
        }
    }
    public static String generateRefreshToken(String email) {
        try {
            return Jwt.claims(Map.of(
                            "email", email,
                            "type", "refresh"
                    ))
                    .issuer("https://example.com/issuer")
                    .subject(email)
                    .expiresIn(Duration.ofDays(7))
                    .sign();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate refresh token: " + e.getMessage(), e);
        }
    }

}
