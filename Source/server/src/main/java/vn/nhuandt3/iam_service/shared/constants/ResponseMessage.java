package vn.nhuandt3.iam_service.shared.constants;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

@Getter
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public enum ResponseMessage {
    SUCCESSFUL("successful!"),
    NOT_FOUND("Not found!"),
    UNAUTHORIZED("Unauthorized!"),
    FORBIDDEN("Forbidden!"),
    UNCATEGORIZED("Uncategorized!"),
    BAD_REQUEST("Bad Request!"),
    INTERNAL_SERVER_ERROR("Internal Server Error!"),
    ;

    ResponseMessage(String message) {
        this.message = message;
    }

    String message;
}
