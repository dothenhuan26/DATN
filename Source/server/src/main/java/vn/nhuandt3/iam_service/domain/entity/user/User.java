package vn.nhuandt3.iam_service.domain.entity.user;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import vn.nhuandt3.iam_service.domain.value_object.user.UserGroup;

import java.time.LocalDate;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class User {
    Long id;
    String iamId;
    String email;
    String username;
    String firstName;
    String lastName;
    String password;
    String phone;
    LocalDate birthday;
    UserGroup group;
}
