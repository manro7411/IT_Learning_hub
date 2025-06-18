package util;

import io.smallrye.jwt.build.Jwt;

import java.io.InputStream;
import java.time.Duration;
import java.util.Map;
import java.util.Set;

public class JwtUtil {

    public static String generateToken(String email, String role) {

        InputStream in = Thread.currentThread().getContextClassLoader().getResourceAsStream("privateKey-pkcs8.pem");
        System.out.println("✅ Found privateKey-pkcs8.pem: " + (in != null));
        System.out.println("🧪 Path: " + JwtUtil.class.getClassLoader().getResource("privateKey-pkcs8.pem"));

        String keyLocation = System.getProperty("smallrye.jwt.sign.key-location");
        System.out.println("🔍 system property 'key-location': " + keyLocation);
        System.out.println("Path found: " + JwtUtil.class.getClassLoader().getResource("privateKey-pkcs8.pem"));


        return Jwt.claims(Map.of(
                        "email", email,
                        "role", role,
                        "custom", "value"
                ))
                .issuer("https://example.com/issuer")
                .subject(email)
                .groups(Set.of(role))
                .expiresIn(Duration.ofHours(2))
                .sign();
    }
}
