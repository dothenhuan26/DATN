package vn.nhuandt3.iam_service.application.http.response.device;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import vn.nhuandt3.iam_service.domain.entity.device.LogWarning;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class GetLogWarningsResponse extends BaseResponse {
    Long nextCursor;
    List<LogWarningResponse> logs;

    @Getter
    @Setter
    @FieldDefaults(level = AccessLevel.PRIVATE)
    @JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
    public static class LogWarningResponse {
        Long id;
        Long deviceId;
        String message;
        String type;
        Float value;
        String unit;
        String created;
    }

    public static GetLogWarningsResponse format(List<LogWarning> data) {
        GetLogWarningsResponse response = new GetLogWarningsResponse();

        if (data.isEmpty()) {
            return response;
        }

        List<LogWarningResponse> logs = new ArrayList<>();

        data.forEach(item -> {
            LogWarningResponse log = new LogWarningResponse();
            log.setId(item.getId());
            log.setDeviceId(item.getDeviceId());
            log.setMessage(item.getMessage());
            if (Objects.nonNull(item.getType())) {
                log.setType(item.getType().getId());
            }
            log.setValue(item.getValue());
            if (Objects.nonNull(item.getUnit())) {
                log.setUnit(item.getUnit().getId());
            }
            if (Objects.nonNull(item.getCreated())) {
                log.setCreated(item.getCreated().format(formatter));
            }
            logs.add(log);
        });

        response.setLogs(logs);
        response.setNextCursor(data.getLast().getId());

        return response;
    }
}
