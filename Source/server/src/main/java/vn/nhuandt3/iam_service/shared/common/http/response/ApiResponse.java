package vn.nhuandt3.iam_service.shared.common.http.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import vn.nhuandt3.iam_service.shared.constants.ResponseStatus;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
@Builder
public class ApiResponse<T> {
    @Builder.Default
    Boolean success = Boolean.TRUE;
    @Builder.Default
    String message = ResponseStatus.SUCCESSFUL.getMessage();
    T data;
}
