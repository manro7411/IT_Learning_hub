package com.example.api;

public record AuthResponse(String token, long expiresInSeconds) {

}
