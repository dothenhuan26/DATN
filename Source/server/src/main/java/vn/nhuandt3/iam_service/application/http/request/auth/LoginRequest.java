package vn.nhuandt3.iam_service.application.http.request.auth;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import vn.nhuandt3.iam_service.application.dto.auth.GetTokenParam;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class LoginRequest {
    @NotNull
    @NotBlank
    String username;
    @NotNull
    @NotBlank
    String password;

    public GetTokenParam getParams() {
        GetTokenParam param = new GetTokenParam();
        param.setUsername(username);
        param.setPassword(password);
        return param;
    }
}
