package service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import model.ChatLog;
import org.eclipse.microprofile.jwt.JsonWebToken;

import java.time.LocalDateTime;

@ApplicationScoped
public class ChatLogService {

    @Inject
    EntityManager em;

    @Inject
    JsonWebToken jwt;

    @Transactional
    public void logChat(String input, String response, boolean blocked) {
        String userEmail = jwt.getSubject();

        if (userEmail == null || userEmail.isBlank()) {
            throw new IllegalStateException("Cannot log chat: missing user identity in JWT.");
        }

        ChatLog log = new ChatLog();
        log.setUserEmail(userEmail);
        log.setInputMessage(input);
        log.setResponseMessage(response);
        log.setBlocked(blocked);
        log.setTimestamp(LocalDateTime.now());

        em.persist(log);
    }
}
