package vn.nhuandt3.iam_service.domain.entity.auth;

import com.nimbusds.jwt.JWTClaimsSet;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import vn.nhuandt3.iam_service.domain.value_object.auth.AuthType;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class JwtPayload {
    JWTClaimsSet claims;
    String subject;
    AuthType type;
    List<String> scopes;


    public JwtPayload(JWTClaimsSet claims) {
        this.claims = claims;
    }

    public String getSubject() {
        if (!Objects.isNull(subject)) {
            return this.subject;
        }
        return this.claims.getSubject();
    }

    public AuthType getType() {
        if (!Objects.isNull(this.type)) {
            return this.type;
        }
        return AuthType.tryFrom((String) this.claims.getClaim("type"));
    }

    public List<String> getScopes() {
        if (Objects.isNull(this.scopes) || !(this.scopes instanceof ArrayList<String>) || this.scopes.isEmpty()) {
            return Arrays.asList(((String) this.claims.getClaim("scope")).split(" "));
        }
        return this.scopes;
    }
}
