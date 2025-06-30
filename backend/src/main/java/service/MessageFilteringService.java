package service;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;
import java.io.InputStream;
import java.util.Collections;
import java.util.List;
import java.util.Map;
@ApplicationScoped
public class MessageFilteringService {
    private List<String> bannedWords = Collections.emptyList();
    @PostConstruct
    void init() {
        try (InputStream is = getClass().getClassLoader().getResourceAsStream("banned-words.json")) {
            if (is != null) {
                ObjectMapper mapper = new ObjectMapper();
                Map<String, List<String>> json = mapper.readValue(is, Map.class);
                bannedWords = json.getOrDefault("bannedWords", List.of());
                System.out.println("✅ Loaded banned words: " + bannedWords);
            } else {
                System.err.println("⚠️ File banned-words.json not found");
            }
        } catch (Exception e) {
            System.err.println("❌ Failed to load banned words: " + e.getMessage());
        }
    }
    public boolean isValid(String msg) {
        if (msg == null || msg.isBlank()) return false;
        return bannedWords.stream().noneMatch(msg.toLowerCase()::contains);
    }
}
