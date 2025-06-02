package vn.nhuandt3.iam_service.application.http.controller.device;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.nhuandt3.iam_service.application.http.request.device.UpdateConfigLimitWarningRequest;
import vn.nhuandt3.iam_service.application.http.response.device.GetConfigLimitWarningResponse;
import vn.nhuandt3.iam_service.domain.action.device.UpdateConfigLimitWarningAction;
import vn.nhuandt3.iam_service.shared.common.http.response.ApiResponse;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/config-limit")
public class UpdateConfigLimitWarningController {
    UpdateConfigLimitWarningAction updateConfigLimitWarningAction;

    @PostMapping("/save")
    ApiResponse<Object> handle(@Valid @RequestBody UpdateConfigLimitWarningRequest request) {

        return ApiResponse.builder()
                .message("Cập nhật giới hạn thành công!")
                .data(GetConfigLimitWarningResponse.format(updateConfigLimitWarningAction.handle(request.getParams())))
                .build();
    }
}
