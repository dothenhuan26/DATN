package vn.nhuandt3.iam_service.domain.action.auth;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Component;
import vn.nhuandt3.iam_service.domain.contract.auth.IamTokenRepository;
import vn.nhuandt3.iam_service.domain.entity.auth.IamToken;
import vn.nhuandt3.iam_service.domain.entity.auth.JwtPayload;
import vn.nhuandt3.iam_service.shared.exceptions.AppException;

import java.util.Date;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RemoveTokenAction {
    VerifyTokenAction verifyTokenAction;
    IamTokenRepository iamTokenRepository;

    public void handle(String token) {

        try {
            JwtPayload signToken = verifyTokenAction.handle(token, true);

            IamToken iamToken = new IamToken();

            String jti = signToken.getClaims().getJWTID();

            Date expiresAt = signToken.getClaims().getExpirationTime();

            iamToken.setToken(token);
            iamToken.setJwtId(jti);
            iamToken.setExpiresAt(expiresAt);

            iamTokenRepository.save(iamToken);
        } catch (Exception exception) {
            throw new AppException("Token already expired!");
        }
    }
}
