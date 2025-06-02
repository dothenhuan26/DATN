package vn.nhuandt3.iam_service.application.http.response.auth;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import vn.nhuandt3.iam_service.domain.dto.user.GenerateTokenDTO;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class GetTokenResponse {
    String tokenType;
    String scope;
    Long expiresIn;
    String accessToken;
    String refreshToken;
    Long sessionExpireAt;

    public static GetTokenResponse format(GenerateTokenDTO data) {
        GetTokenResponse response = new GetTokenResponse();
        response.setTokenType(data.getTokenType());
        response.setScope(data.getScope());
        response.setExpiresIn(data.getExpiresIn());
        response.setAccessToken(data.getAccessToken());
        response.setRefreshToken(data.getRefreshToken());
        response.setSessionExpireAt(data.getSessionExpireAt());

        return response;
    }

}
