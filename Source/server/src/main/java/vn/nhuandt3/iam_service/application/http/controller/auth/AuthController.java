package vn.nhuandt3.iam_service.application.http.controller.auth;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.nhuandt3.iam_service.application.dto.auth.GetTokenParam;
import vn.nhuandt3.iam_service.application.http.request.auth.LoginRequest;
import vn.nhuandt3.iam_service.application.http.response.auth.GetTokenResponse;
import vn.nhuandt3.iam_service.domain.action.auth.GetTokenAction;
import vn.nhuandt3.iam_service.domain.dto.user.GenerateTokenDTO;
import vn.nhuandt3.iam_service.shared.common.http.response.ApiResponse;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/v1/oauth2")
public class AuthController {
    GetTokenAction getTokenAction;

    @PostMapping("/token")
    public ApiResponse<Object> token(@Valid @RequestBody LoginRequest request) {
        GetTokenParam param = request.getParams();

        GenerateTokenDTO response = getTokenAction.handle(param);

        return ApiResponse.builder()
                .data(GetTokenResponse.format(response))
                .build();
    }
}