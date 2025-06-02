package vn.nhuandt3.iam_service.application.http.controller.device;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.nhuandt3.iam_service.application.http.request.device.GetTemperatureSensorLogsRequest;
import vn.nhuandt3.iam_service.application.http.response.device.GetTemperatureSensorLogsResponse;
import vn.nhuandt3.iam_service.domain.action.device.GetTemperatureSensorLogsAction;
import vn.nhuandt3.iam_service.shared.common.http.response.ApiResponse;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/temperature-sensor")
public class GetTemperatureSensorLogsController {
    GetTemperatureSensorLogsAction getTemperatureSensorLogsAction;

    @GetMapping("/logs")
    ApiResponse<Object> handle(@Valid @ModelAttribute GetTemperatureSensorLogsRequest request) {

        return ApiResponse.builder()
                .message("Lấy logs khí Gas thành công!")
                .data(GetTemperatureSensorLogsResponse
                        .format(getTemperatureSensorLogsAction.handle(request.getSearchParams())))
                .build();
    }
}
