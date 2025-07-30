package util;

import io.smallrye.jwt.build.Jwt;
import java.time.Duration;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

public class JwtUtil {

    public static String generateAccessToken(String email, String role, String name, UUID accessUUID) {
        try {
            return Jwt.claims(Map.of(
                            "email", email,
                            "role", role,
                            "name", name,
                            "upn", email,
                            "accessUUID", accessUUID
                    ))
                    .issuer("https://example.com/issuer")
                    .subject(email)
                    .groups(Set.of(role))
                    .expiresIn(Duration.ofHours(2))
                    .sign();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate access token: " + e.getMessage(), e);
        }
    }

    public static String generateRefreshToken(String email,UUID refreshUUID) {
        try {
            return Jwt.claims(Map.of(
                            "email", email,
                            "refreshUUID",refreshUUID,
                            "type", "refresh"
                    ))
                    .issuer("https://example.com/issuer")
                    .subject(email)
                    .expiresIn(Duration.ofDays(ึ))
                    .sign();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate refresh token: " + e.getMessage(), e);
        }
    }
}
