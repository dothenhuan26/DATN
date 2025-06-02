package vn.nhuandt3.iam_service.application.http.controller.device;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import vn.nhuandt3.iam_service.application.http.response.device.GetLogWarningsResponse;
import vn.nhuandt3.iam_service.domain.action.device.GetTopLogWarningAction;
import vn.nhuandt3.iam_service.shared.common.http.response.ApiResponse;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/log-warning")
public class GetTopLogWarningController {
    GetTopLogWarningAction getTopLogWarningAction;

    @GetMapping("/logs/top")
    ApiResponse<Object> handle(@RequestParam(value = "limit", required = false) Integer limit) {

        return ApiResponse.builder()
                .message("Lấy logs khí Gas thành công!")
                .data(GetLogWarningsResponse
                        .format(getTopLogWarningAction.handle(limit)))
                .build();
    }
}
