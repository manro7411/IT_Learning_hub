package dto;

public class ProfileDto {

    public String id;
    public String name;
    public String email;
    public String avatarUrl;

    public ProfileDto() {}

    public ProfileDto(String id, String name, String email, String avatarUrl) {
        this.id    = id;
        this.name  = name;
        this.email = email;
        this.avatarUrl = avatarUrl;
    }

}