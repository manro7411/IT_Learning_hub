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

}
//Data Transfer Object