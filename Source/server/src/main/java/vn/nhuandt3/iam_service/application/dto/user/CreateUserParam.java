package vn.nhuandt3.iam_service.application.dto.user;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import vn.nhuandt3.iam_service.domain.entity.user.User;

import java.time.LocalDate;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateUserParam {
    String email;
    String phone;
    String username;
    String password;
    String firstName;
    String lastName;
    LocalDate birthday;

    public User toEntity() {
        User user = new User();
        user.setEmail(email);
        user.setUsername(username);
        user.setPhone(phone);
        user.setPassword(password);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setBirthday(birthday);
        return user;
    }
}