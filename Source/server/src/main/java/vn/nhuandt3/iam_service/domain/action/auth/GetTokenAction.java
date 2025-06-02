package vn.nhuandt3.iam_service.domain.action.auth;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import vn.nhuandt3.iam_service.application.dto.auth.GetTokenParam;
import vn.nhuandt3.iam_service.domain.contract.auth.IamScopeRepository;
import vn.nhuandt3.iam_service.domain.contract.user.UserRepository;
import vn.nhuandt3.iam_service.domain.dto.user.GenerateTokenDTO;
import vn.nhuandt3.iam_service.domain.dto.user.GetTokenDTO;
import vn.nhuandt3.iam_service.domain.entity.user.User;
import vn.nhuandt3.iam_service.shared.constants.ResponseStatus;
import vn.nhuandt3.iam_service.shared.exceptions.AppException;

import java.util.List;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class GetTokenAction {
    PasswordEncoder passwordEncoder;
    UserRepository userRepository;

    GenerateTokenAction generateTokenAction;
    IamScopeRepository iamScopeRepository;


    public GenerateTokenDTO handle(GetTokenParam param) {
        User user = userRepository.getByUsername(param.getUsername());

        if (user == null) {
            throw new AppException(ResponseStatus.NOT_FOUND);
        }

        boolean authenticated = passwordEncoder.matches(param.getPassword(), user.getPassword());

        if (!authenticated) {
            throw new AppException(ResponseStatus.UNAUTHORIZED);
        }

        List<String> scopes = iamScopeRepository.getScopesByUserId(user.getId());

        GetTokenDTO dto = new GetTokenDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setGroup(user.getGroup());
        dto.setScopes(scopes);
        dto.setIamId(user.getIamId());

        return generateTokenAction.handle(dto);
    }
}
