package vn.nhuandt3.iam_service.shared.exceptions;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import vn.nhuandt3.iam_service.shared.constants.ResponseStatus;

@FieldDefaults(level = AccessLevel.PRIVATE)
@Getter
@Setter
public class AppException extends RuntimeException {
    String message;
    ResponseStatus responseStatus;

    public AppException() {
        this.responseStatus = ResponseStatus.BAD_REQUEST;
        this.message = ResponseStatus.BAD_REQUEST.getMessage();
    }

    public AppException(ResponseStatus responseStatus, String message) {
        this.responseStatus = responseStatus;
        this.message = message;
    }

    public AppException(String message, ResponseStatus responseStatus) {
        this.responseStatus = responseStatus;
        this.message = message;
    }

    public AppException(String message) {
        this.message = message;
        this.responseStatus = ResponseStatus.BAD_REQUEST;
    }

    public AppException(ResponseStatus responseStatus) {
        this.responseStatus = responseStatus;
        this.message = responseStatus.getMessage();
    }
}
