package util;

import io.smallrye.jwt.algorithm.SignatureAlgorithm;
import io.smallrye.jwt.build.Jwt;
import io.smallrye.jwt.util.KeyUtils;
import java.security.PrivateKey;
import java.time.Duration;
import java.util.Map;
import java.util.Set;

public class JwtUtil {

    public static String generateToken(String email, String role, String name) {
        try {
            // หากใช้ privateKey แบบไฟล์ ให้ใช้แบบนี้:
            // PrivateKey key = KeyUtils.decodePrivateKey("META-INF/privateKey.pem", SignatureAlgorithm.RS256);

            return Jwt.claims(Map.of(
                            "email", email,
                            "role", role,
                            "name", name,
                            "upn", email // สำรองไว้ใช้ชื่อผู้ใช้ใน frontend ได้เช่นกัน
                    ))
                    .issuer("https://example.com/issuer")
                    .subject(email)
                    .groups(Set.of(role))
                    .expiresIn(Duration.ofHours(2))
                    .sign(); // ถ้าใช้ default จะใช้ private key จาก config
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate JWT token: " + e.getMessage(), e);
        }
    }
}
