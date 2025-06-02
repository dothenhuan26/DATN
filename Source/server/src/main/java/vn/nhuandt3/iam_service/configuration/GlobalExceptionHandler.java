package vn.nhuandt3.iam_service.configuration;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import vn.nhuandt3.iam_service.shared.common.http.response.ApiResponse;
import vn.nhuandt3.iam_service.shared.constants.ResponseStatus;
import vn.nhuandt3.iam_service.shared.exceptions.AppException;

@ControllerAdvice
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class GlobalExceptionHandler {

    @ExceptionHandler(AppException.class)
    ResponseEntity<ApiResponse> handleAppException(AppException exception) {

        ResponseStatus status = exception.getResponseStatus();

        return ResponseEntity.status(status.getCode()).body(
                ApiResponse.builder()
                        .success(false)
                        .message(exception.getMessage())
                        .build()
        );
    }

    @ExceptionHandler(Exception.class)
    ResponseEntity<ApiResponse> handleException(Exception exception) {

        ResponseStatus status = ResponseStatus.UNCATEGORIZED;

        return ResponseEntity.status(status.getCode()).body(
                ApiResponse.builder()
                        .success(false)
                        .message(exception.getMessage())
                        .build()
        );
    }

    @ExceptionHandler(value = AccessDeniedException.class)
    ResponseEntity<ApiResponse> handleAccessDeniedException(AccessDeniedException exception) {

        ResponseStatus status = ResponseStatus.UNAUTHORIZED;

        return ResponseEntity.status(status.getCode()).body(
                ApiResponse.builder()
                        .success(false)
                        .message(exception.getMessage())
                        .build()
        );
    }
}