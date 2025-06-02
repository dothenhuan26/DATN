package vn.nhuandt3.iam_service.domain.dto.user;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class GenerateTokenDTO {
    String tokenType;
    String scope;
    Long expiresIn;
    String accessToken;
    String refreshToken;
    Long sessionExpireAt;
}
