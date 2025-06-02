package vn.nhuandt3.iam_service.application.http.controller.device;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.nhuandt3.iam_service.application.http.response.device.GetDevicesResponse;
import vn.nhuandt3.iam_service.domain.action.device.GetDevicesAction;
import vn.nhuandt3.iam_service.shared.common.http.response.ApiResponse;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/device")
public class GetDevicesController {
    GetDevicesAction getDevicesAction;

    @GetMapping("/all")
    ApiResponse<Object> handle() {
        return ApiResponse.builder()
                .message("Lấy thông tin thành công!")
                .data(GetDevicesResponse
                        .format(getDevicesAction.handle()))
                .build();
    }
}
