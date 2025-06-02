package vn.nhuandt3.iam_service.domain.entity.auth;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.util.Date;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class IamToken {
    Long id;
    String jwtId;
    String token;
    Date expiresAt;
}
