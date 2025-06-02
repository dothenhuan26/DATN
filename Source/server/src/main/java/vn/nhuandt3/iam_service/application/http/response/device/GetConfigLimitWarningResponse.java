package vn.nhuandt3.iam_service.application.http.response.device;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import vn.nhuandt3.iam_service.domain.entity.device.ConfigLimitWarning;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Slf4j
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class GetConfigLimitWarningResponse extends BaseResponse {
    Long id;
    Long deviceId;
    String type;
    Float value;
    String unit;
    String createdAt;
    String updatedAt;

    public static List<GetConfigLimitWarningResponse> format(List<ConfigLimitWarning> data) {
        List<GetConfigLimitWarningResponse> response = new ArrayList<>();

        data.forEach(item -> {
            GetConfigLimitWarningResponse config = new GetConfigLimitWarningResponse();
            config.setId(item.getId());
            config.setDeviceId(item.getDeviceId());
            if (Objects.nonNull(item.getType())) {
                config.setType(item.getType().getId());
            }
            config.setValue(item.getValue());
            if (Objects.nonNull(item.getUnit())) {
                config.setUnit(item.getUnit().getId());
            }
            if (Objects.nonNull(item.getCreatedAt())) {
                config.setCreatedAt(item.getCreatedAt().format(formatter));
            }
            if (Objects.nonNull(item.getUpdatedAt())) {
                config.setUpdatedAt(item.getUpdatedAt().format(formatter));
            }

            response.add(config);
        });

        return response;
    }

    public static GetConfigLimitWarningResponse format(ConfigLimitWarning item) {
        if (Objects.isNull(item)) {
            return null;
        }

        GetConfigLimitWarningResponse response = new GetConfigLimitWarningResponse();

        response.setId(item.getId());
        response.setDeviceId(item.getDeviceId());
        if (Objects.nonNull(item.getType())) {
            response.setType(item.getType().getId());
        }
        response.setValue(item.getValue());
        if (Objects.nonNull(item.getUnit())) {
            response.setUnit(item.getUnit().getId());
        }
        if (Objects.nonNull(item.getCreatedAt())) {
            response.setCreatedAt(item.getCreatedAt().format(formatter));
        }
        if (Objects.nonNull(item.getUpdatedAt())) {
            response.setUpdatedAt(item.getUpdatedAt().format(formatter));
        }

        return response;
    }
}
