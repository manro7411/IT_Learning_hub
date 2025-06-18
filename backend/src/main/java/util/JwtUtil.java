package util;

import io.smallrye.jwt.build.Jwt;

import java.time.Duration;
import java.util.HashSet;
import java.util.Set;
import java.io.InputStream;

public class JwtUtil {

    public static String generateToken(String email, String role) {
        Set<String> roles = new HashSet<>();
        roles.add(role);

        InputStream in = Thread.currentThread()
                .getContextClassLoader()
                .getResourceAsStream("privateKey-pkcs8.pem");
        System.out.println(in == null ? " NOT FOUND privateKey-pkcs8.pem" : " FOUND privateKey-pkcs8.pem");

        String keyLocation = System.getProperty("smallrye.jwt.sign.key-location");
        System.out.println("🔍 key location: " + keyLocation);

        System.out.println("✅ FOUND: " + Jwt.class.getResource("/privateKey-pkcs8.pem"));
        System.out.println(">>> Key Location: " + Jwt.class.getResource("/privatePem.key"));
        System.out.println(Jwt.class.getResource("/privateKey-pkcs8.pem"));




        return Jwt.issuer("https://example.com/issuer")
                .subject(email)
                .groups(roles)
                .expiresIn(Duration.ofHours(2))
                .sign();
    }
}
