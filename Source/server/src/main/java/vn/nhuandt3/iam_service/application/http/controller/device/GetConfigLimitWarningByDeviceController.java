package vn.nhuandt3.iam_service.application.http.controller.device;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import vn.nhuandt3.iam_service.application.http.response.device.GetConfigLimitWarningResponse;
import vn.nhuandt3.iam_service.domain.action.device.GetConfigLimitWarningByDeviceAction;
import vn.nhuandt3.iam_service.shared.common.http.response.ApiResponse;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/config-limit")
public class GetConfigLimitWarningByDeviceController {
    GetConfigLimitWarningByDeviceAction getConfigLimitWarningByDeviceAction;

    @GetMapping("/get-by-device")
    ApiResponse<Object> handle(@RequestParam(name = "device_id") Long deviceId) {

        return ApiResponse.builder()
                .message("Cập nhật giới hạn thành công!")
                .data(GetConfigLimitWarningResponse.format(getConfigLimitWarningByDeviceAction.handle(deviceId)))
                .build();
    }
}
