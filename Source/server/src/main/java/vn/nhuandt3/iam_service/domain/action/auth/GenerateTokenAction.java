package vn.nhuandt3.iam_service.domain.action.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jwt.JWTClaimsSet;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import vn.nhuandt3.iam_service.domain.dto.user.GenerateTokenDTO;
import vn.nhuandt3.iam_service.domain.dto.user.GetTokenDTO;
import vn.nhuandt3.iam_service.domain.value_object.auth.AuthType;
import vn.nhuandt3.iam_service.shared.constants.ResponseStatus;
import vn.nhuandt3.iam_service.shared.exceptions.AppException;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;
import java.util.StringJoiner;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class GenerateTokenAction {
    PasswordEncoder passwordEncoder;
    ObjectMapper objectMapper;

    @NonFinal
    @Value("${security.jwt.sign-key}")
    protected String SIGN_KEY;

    @NonFinal
    @Value("${security.jwt.valid-duration}")
    protected Long VALID_DURATION;

    @NonFinal
    @Value("${security.jwt.refresh-duration}")
    protected Long REFRESH_DURATION;

    public GenerateTokenDTO handle(GetTokenDTO data) {
        try {
            JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

            String scope = buildScope(data.getScopes());

            String type = AuthType.OAUTH.getId();

            Date expiresAt = new Date(
                    Instant.now().plus(VALID_DURATION, ChronoUnit.SECONDS).toEpochMilli());

            String iss = "nhuandt3";

            JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                    .subject(data.getIamId())
                    .issuer(iss)
                    .issueTime(new Date())
                    .expirationTime(expiresAt)
                    .jwtID(UUID.randomUUID().toString())
                    .claim("scope", scope)
                    .claim("type", type)
                    .build();

            Payload payload = new Payload(jwtClaimsSet.toJSONObject());

            JWSObject jwsObject = new JWSObject(header, payload);

            jwsObject.sign(new MACSigner(SIGN_KEY.getBytes()));

            String token = jwsObject.serialize();

            return GenerateTokenDTO.builder()
                    .tokenType(type)
                    .scope(scope)
                    .expiresIn(VALID_DURATION)
                    .accessToken(token)
                    .refreshToken(token)
                    .sessionExpireAt(expiresAt.getTime())
                    .build();
        } catch (JOSEException e) {
            throw new AppException("Cannot create token!", ResponseStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private String buildScope(List<String> scopes) {
        StringJoiner stringJoiner = new StringJoiner(" ");

        if (!CollectionUtils.isEmpty(scopes)) {
            scopes.forEach(stringJoiner::add);
        }

        return stringJoiner.toString();
    }
}