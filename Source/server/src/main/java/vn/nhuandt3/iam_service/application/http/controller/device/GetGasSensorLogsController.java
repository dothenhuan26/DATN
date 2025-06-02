package vn.nhuandt3.iam_service.application.http.controller.device;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;
import vn.nhuandt3.iam_service.application.http.request.device.GetGasSensorLogsRequest;
import vn.nhuandt3.iam_service.application.http.response.device.GetGasSensorLogsResponse;
import vn.nhuandt3.iam_service.domain.action.device.GetGasSensorLogsAction;
import vn.nhuandt3.iam_service.shared.common.http.response.ApiResponse;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/gas-sensor")
public class GetGasSensorLogsController {
    GetGasSensorLogsAction getGasSensorLogsAction;

    @GetMapping("/logs")
    ApiResponse<Object> handle(@Valid @ModelAttribute GetGasSensorLogsRequest request) {

        return ApiResponse.builder()
                .message("Lấy logs khí Gas thành công!")
                .data(GetGasSensorLogsResponse
                        .format(getGasSensorLogsAction.handle(request.getSearchParams())))
                .build();
    }
}
