package vn.nhuandt3.iam_service.application.http.response.device;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import vn.nhuandt3.iam_service.domain.entity.device.TemperatureSensorDeviceLog;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Slf4j
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class GetTemperatureSensorLogsResponse extends BaseResponse {
    Long nextCursor;
    List<TemperatureSensorLogResponse> logs;

    @Getter
    @Setter
    @FieldDefaults(level = AccessLevel.PRIVATE)
    @JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
    public static class TemperatureSensorLogResponse extends BaseResponse {
        Long id;
        Long deviceId;
        String action;
        Float temperature;
        Float humidity;
        String description;
        String created;
    }

    public static GetTemperatureSensorLogsResponse format(List<TemperatureSensorDeviceLog> data) {
        GetTemperatureSensorLogsResponse response = new GetTemperatureSensorLogsResponse();

        List<TemperatureSensorLogResponse> logs = new ArrayList<>();

        data.forEach(item -> {
            TemperatureSensorLogResponse log = new TemperatureSensorLogResponse();
            log.setId(item.getId());
            log.setDeviceId(item.getDeviceId());
            log.setAction(item.getAction());
            log.setTemperature(item.getTemperature());
            log.setHumidity(item.getHumidity());
            log.setDescription(item.getDescription());
            if (Objects.nonNull(item.getCreated())) {
                log.setCreated(item.getCreated().format(formatter));
            }
            logs.add(log);
        });

        response.setLogs(logs);

        if (logs.isEmpty()) {
            response.setNextCursor(0L);
        } else {
            response.setNextCursor(data.getLast().getId());
        }

        return response;
    }
}
