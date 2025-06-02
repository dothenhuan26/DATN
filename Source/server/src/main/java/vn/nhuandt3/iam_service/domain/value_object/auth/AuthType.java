package vn.nhuandt3.iam_service.domain.value_object.auth;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE)
@Getter
@AllArgsConstructor
public enum AuthType {
    OAUTH("oauth"),
    LOGIN_AS("login_as"),
    DIRECT("direct"),
    ;

    String id;

    public static AuthType tryFrom(String id) {
        for (AuthType d : AuthType.values()) {
            if (d.id.equals(id)) {
                return d;
            }
        }
        return null;
    }

    public boolean isOAuthType() {
        return this == OAUTH || this == LOGIN_AS;
    }

}
