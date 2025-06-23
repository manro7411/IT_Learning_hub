package dto;

public class ProfileDto {

    public String id;
    public String name;
    public String email;

    public ProfileDto() {}

    public ProfileDto(String id, String name, String email) {
        this.id    = id;
        this.name  = name;
        this.email = email;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
