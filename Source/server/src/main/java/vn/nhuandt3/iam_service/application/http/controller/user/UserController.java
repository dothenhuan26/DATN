package vn.nhuandt3.iam_service.application.http.controller.user;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;
import vn.nhuandt3.iam_service.application.dto.user.CreateUserParam;
import vn.nhuandt3.iam_service.application.http.request.user.CreateUserRequest;
import vn.nhuandt3.iam_service.application.http.request.user.GetUsersRequest;
import vn.nhuandt3.iam_service.domain.action.user.CreateUserAction;
import vn.nhuandt3.iam_service.domain.action.user.GetUsersAction;
import vn.nhuandt3.iam_service.shared.common.http.response.ApiResponse;

@RequestMapping("/user")
@RestController
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class UserController {
    CreateUserAction createUserAction;
    GetUsersAction getUsersAction;

    @PostMapping("/create")
    ApiResponse<Object> create(@Valid @RequestBody CreateUserRequest request) {

        CreateUserParam param = request.getParam();

        return ApiResponse.builder()
                .message("User created successfully!")
                .data(createUserAction.handle(param))
                .build();
    }

    @GetMapping("/get-users")
    ApiResponse<Object> getUserPagination(@Valid @RequestBody GetUsersRequest request) {
        return ApiResponse.builder()
                .message("Get users successfully!")
                .data(getUsersAction.handle(request.getPage(), request.getLimit()))
                .build();
    }

}