package vn.nhuandt3.iam_service.application.http.controller.device;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.nhuandt3.iam_service.application.http.request.device.GetLogWarningsRequest;
import vn.nhuandt3.iam_service.application.http.response.device.GetLogWarningsResponse;
import vn.nhuandt3.iam_service.domain.action.device.GetLogWarningsAction;
import vn.nhuandt3.iam_service.shared.common.http.response.ApiResponse;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/log-warning")
public class GetLogWarningsController {
    GetLogWarningsAction getLogWarningsAction;

    @GetMapping("/logs")
    ApiResponse<Object> handle(@Valid @ModelAttribute GetLogWarningsRequest request) {

        return ApiResponse.builder()
                .message("Lấy logs khí Gas thành công!")
                .data(GetLogWarningsResponse
                        .format(getLogWarningsAction.handle(request.getSearchLogWarningParam())))
                .build();
    }
}
