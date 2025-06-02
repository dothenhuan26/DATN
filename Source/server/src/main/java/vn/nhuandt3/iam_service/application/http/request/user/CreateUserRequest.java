package vn.nhuandt3.iam_service.application.http.request.user;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import vn.nhuandt3.iam_service.application.dto.user.CreateUserParam;
import vn.nhuandt3.iam_service.shared.validator.contracts.MatchPassword;

import java.time.LocalDate;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
@MatchPassword
public class CreateUserRequest {
    @NotNull
    @NotBlank
    String email;
    @NotNull
    @NotBlank
    String username;
    @NotNull
    @NotBlank
    String phone;
    @NotNull
    @NotBlank
    String password;
    @NotNull
    @NotBlank
    String confirmPassword;
    @NotNull
    @NotBlank
    String firstName;
    @NotNull
    @NotBlank
    String lastName;
    @NotNull
    LocalDate birthday;

    public CreateUserParam getParam() {
        CreateUserParam param = new CreateUserParam();
        param.setEmail(email);
        param.setPhone(phone);
        param.setUsername(username);
        param.setPassword(password);
        param.setFirstName(firstName);
        param.setLastName(lastName);
        param.setBirthday(birthday);
        return param;
    }

}
