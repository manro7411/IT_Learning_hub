package util;

import io.smallrye.jwt.algorithm.SignatureAlgorithm;
import io.smallrye.jwt.build.Jwt;
import io.smallrye.jwt.util.KeyUtils;
import java.security.PrivateKey;
import java.time.Duration;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

public class JwtUtil {

    public static String generateToken(String email, String role, String name,UUID uuid) {
        try {
            return Jwt.claims(Map.of(
                            "email", email,
                            "role", role,
                            "name", name,
                            "UUID",uuid,
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
    public static String refreshToken(String email, String role, String name, UUID uuid) {
        try {
            return Jwt.claims(Map.of(
                            "email", email,
                            "role", role,
                            "name", name,
                            "UUID",uuid,
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
}
