package vn.nhuandt3.iam_service.domain.action.auth;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class IntrospectTokenAction {
    VerifyTokenAction verifyTokenAction;

    public boolean handle(String token) {
        try {
            verifyTokenAction.handle(token, false);
        } catch (Exception exception) {
            return false;
        }
        return true;
    }
}
