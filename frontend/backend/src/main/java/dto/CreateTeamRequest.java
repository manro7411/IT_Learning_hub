package dto;

import java.util.List;

public class CreateTeamRequest {

    public String name;
    public String description;
    public String createBy;
    public List<CreateMemberRequest> members;

}
