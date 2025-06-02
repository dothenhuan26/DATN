package vn.nhuandt3.iam_service.domain.dto.user;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import vn.nhuandt3.iam_service.domain.value_object.user.UserGroup;

import java.util.List;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class GetTokenDTO {
    Long id;
    String username;
    UserGroup group;
    List<String> scopes;
    String iamId;
}
