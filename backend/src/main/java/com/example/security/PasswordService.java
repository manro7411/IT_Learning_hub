package com.example.security;

import jakarta.enterprise.context.ApplicationScoped;
import org.mindrot.jbcrypt.BCrypt;

@ApplicationScoped
public class PasswordService {
    public String hash(String plain) {
        return BCrypt.hashpw(plain, BCrypt.gensalt());
    }

    public boolean verify(String plain, String hash) {
        return BCrypt.checkpw(plain, hash);
    }
}
