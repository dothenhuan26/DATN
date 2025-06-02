package vn.nhuandt3.iam_service.application.http.controller.device;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;
import vn.nhuandt3.iam_service.application.http.response.device.GetGasSensorLogsResponse;
import vn.nhuandt3.iam_service.domain.action.device.GetTopGasSensorLogsAction;
import vn.nhuandt3.iam_service.shared.common.http.response.ApiResponse;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/gas-sensor")
public class GetTopGasSensorLogsController {
    GetTopGasSensorLogsAction getTopGasSensorLogsAction;

    @GetMapping("/logs/top")
    ApiResponse<Object> handle(@RequestParam(value = "limit", required = false) Integer limit) {

        return ApiResponse.builder()
                .message("Lấy logs khí Gas thành công!")
                .data(GetGasSensorLogsResponse
                        .format(getTopGasSensorLogsAction.handle(limit)))
                .build();
    }
}
