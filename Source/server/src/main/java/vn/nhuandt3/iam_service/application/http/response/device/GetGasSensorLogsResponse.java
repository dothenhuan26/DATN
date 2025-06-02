package vn.nhuandt3.iam_service.application.http.response.device;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import vn.nhuandt3.iam_service.domain.entity.device.GasSensorDeviceLog;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class GetGasSensorLogsResponse extends BaseResponse {
    Long nextCursor;
    List<GasSensorLogResponse> logs;

    @Getter
    @Setter
    @FieldDefaults(level = AccessLevel.PRIVATE)
    @JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
    public static class GasSensorLogResponse {
        Long id;
        Long deviceId;
        String action;
        Float concentrations;
        String description;
        String created;
    }

    public static GetGasSensorLogsResponse format(List<GasSensorDeviceLog> data) {
        GetGasSensorLogsResponse response = new GetGasSensorLogsResponse();

        List<GasSensorLogResponse> logs = new ArrayList<>();

        data.forEach(item -> {
            GasSensorLogResponse log = new GasSensorLogResponse();
            log.setId(item.getId());
            log.setDeviceId(item.getDeviceId());
            log.setAction(item.getAction());
            log.setConcentrations(item.getConcentrations());
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
