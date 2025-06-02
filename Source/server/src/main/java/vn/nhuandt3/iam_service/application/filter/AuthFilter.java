package vn.nhuandt3.iam_service.application.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AccessLevel;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import vn.nhuandt3.iam_service.domain.action.auth.VerifyPermissionAction;
import vn.nhuandt3.iam_service.domain.action.auth.VerifyTokenAction;
import vn.nhuandt3.iam_service.domain.contract.user.UserRepository;
import vn.nhuandt3.iam_service.domain.entity.auth.JwtPayload;
import vn.nhuandt3.iam_service.domain.entity.user.User;
import vn.nhuandt3.iam_service.shared.constants.ResponseStatus;
import vn.nhuandt3.iam_service.shared.exceptions.AppException;

import java.io.IOException;
import java.util.Objects;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthFilter extends OncePerRequestFilter {
    public static String BEARER_KEY = "Bearer";
    VerifyPermissionAction verifyPermissionAction;
    VerifyTokenAction verifyTokenAction;
    UserRepository userRepository;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws IOException {
        try {
            String uri = request.getRequestURI();

            if (this.verifyPermissionAction.isUriInWhiteList(uri)) {
                filterChain.doFilter(request, response);
                return;
            }

            String iamToken = getTokenFromRequest(request);

            JwtPayload payload = this.verifyTokenAction.handle(iamToken, false);

            User user = this.getUser(payload);

            if (!this.verifyPermissionAction.isValidPermission(uri, user) && !this.verifyPermissionAction.isValidScope(uri, payload.getScopes())) {
                throw new AppException(ResponseStatus.UNAUTHORIZED);
            }

            filterChain.doFilter(request, response);
        } catch (Exception exception) {
            response.sendError(ResponseStatus.INTERNAL_SERVER_ERROR.getCode(), exception.getMessage());
        }
    }

    protected User getUser(JwtPayload payload) {
        if (Objects.isNull(payload.getType()) || !payload.getType().isOAuthType()) {
            return null;
        }

        return userRepository.getUserByIamId(payload.getSubject());
    }

    protected String getTokenFromRequest(HttpServletRequest request) {
        String token = request.getHeader("Authorization");

        if (Objects.isNull(token)) {
            throw new AppException("Không xác định được token.");
        }

        if (!token.startsWith("Bearer ")) {
            throw new AppException("Token không đúng định dạng.");
        }

        return token.substring("Bearer ".length() - 1).trim();
    }
}