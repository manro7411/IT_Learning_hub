package service;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;

@ApplicationScoped
public class MessageFilteringService {
    private static final List<String> bannedWords = List.of("spam");

    public boolean isValid(String msg){

        if(msg == null || msg.isBlank()){
            return false;
        }
        return bannedWords.stream().noneMatch(msg.toLowerCase()::contains);
    }
}
