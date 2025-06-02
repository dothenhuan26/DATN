package vn.nhuandt3.iam_service.domain.action.auth;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSVerifier;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import vn.nhuandt3.iam_service.domain.contract.auth.IamTokenRepository;
import vn.nhuandt3.iam_service.domain.entity.auth.IamToken;
import vn.nhuandt3.iam_service.domain.entity.auth.JwtPayload;
import vn.nhuandt3.iam_service.domain.value_object.auth.AuthType;
import vn.nhuandt3.iam_service.shared.constants.ResponseStatus;
import vn.nhuandt3.iam_service.shared.exceptions.AppException;

import java.text.ParseException;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class VerifyTokenAction {
    IamTokenRepository iamTokenRepository;

    @NonFinal
    @Value("${security.jwt.sign-key}")
    protected String SIGN_KEY;

    @NonFinal
    @Value("${security.jwt.valid-duration}")
    protected Long VALID_DURATION;

    @NonFinal
    @Value("${security.jwt.refresh-duration}")
    protected Long REFRESH_DURATION;

    public JwtPayload handle(String token, boolean isRefresh) throws JOSEException, ParseException {
        JWSVerifier verifier = new MACVerifier(SIGN_KEY.getBytes());

        SignedJWT signedJWT = SignedJWT.parse(token);

        Date expiryTime = (isRefresh)
                ? new Date(signedJWT
                .getJWTClaimsSet()
                .getIssueTime()
                .toInstant()
                .plus(REFRESH_DURATION, ChronoUnit.SECONDS)
                .toEpochMilli())
                : signedJWT.getJWTClaimsSet().getExpirationTime();

        var verified = signedJWT.verify(verifier);

        if (!(verified && expiryTime.after(new Date()))) throw new AppException(ResponseStatus.UNAUTHORIZED);

        IamToken iamToken = iamTokenRepository.getByToken(signedJWT.getJWTClaimsSet().getJWTID());

        if (iamToken != null) {
            throw new AppException(ResponseStatus.UNAUTHORIZED);
        }

        JWTClaimsSet claims = signedJWT.getJWTClaimsSet();
        JwtPayload payload = new JwtPayload(claims);
        payload.setType(AuthType.tryFrom((String) claims.getClaim("type")));
        payload.setSubject(claims.getSubject());

        String scopeCliams = (String) claims.getClaim("scope");

        List<String> scopes = Arrays.asList(scopeCliams.split(" "));

        payload.setScopes(scopes);

        return payload;
    }
}