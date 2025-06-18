package model;
import jakarta.persistence.Entity;

@Entity
public class User {
    @Id
    @GeneratedVaue
    private Long id;
    private String username;
    private String password;
    private String email;
    private String role;


}
