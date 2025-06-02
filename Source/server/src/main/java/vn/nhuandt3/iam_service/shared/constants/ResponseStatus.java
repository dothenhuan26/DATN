package vn.nhuandt3.iam_service.shared.constants;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;

@Getter
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public enum ResponseStatus {
    NOT_FOUND(HttpStatus.NOT_FOUND.value(), ResponseMessage.NOT_FOUND.getMessage()),
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED.value(), ResponseMessage.UNAUTHORIZED.getMessage()),
    FORBIDDEN(HttpStatus.FORBIDDEN.value(), ResponseMessage.FORBIDDEN.getMessage()),
    SUCCESSFUL(HttpStatus.OK.value(), ResponseMessage.SUCCESSFUL.getMessage()),
    UNCATEGORIZED(HttpStatus.INTERNAL_SERVER_ERROR.value(), ResponseMessage.UNAUTHORIZED.getMessage()),
    BAD_REQUEST(HttpStatus.BAD_REQUEST.value(), ResponseMessage.BAD_REQUEST.getMessage()),
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR.value(), ResponseMessage.INTERNAL_SERVER_ERROR.getMessage()),
    ;

    ResponseStatus(int code, String message) {
        this.code = code;
        this.message = message;
    }

    int code;
    String message;
}