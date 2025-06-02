package vn.nhuandt3.iam_service.application.http.controller.device;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.nhuandt3.iam_service.application.http.response.device.GetConfigLimitWarningResponse;
import vn.nhuandt3.iam_service.domain.action.device.GetConfigLimitWarningAction;
import vn.nhuandt3.iam_service.shared.common.http.response.ApiResponse;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/config-limit")
public class GetConfigLimitWarningController {
    GetConfigLimitWarningAction getConfigLimitWarningAction;

    @GetMapping("/get")
    ApiResponse<Object> handle() {

        return ApiResponse.builder()
                .message("Cập nhật giới hạn thành công!")
                .data(GetConfigLimitWarningResponse.format(getConfigLimitWarningAction.handle()))
                .build();
    }
}
