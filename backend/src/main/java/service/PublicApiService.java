package service;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class PublicApiService {
    public String sendingOut(String msg){
        return "Message has been sending out to public API";
    }
}
