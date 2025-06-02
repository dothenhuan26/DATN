package vn.nhuandt3.iam_service.application.http.request.device;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import vn.nhuandt3.iam_service.application.dto.device.ConfigLimitWarningParam;
import vn.nhuandt3.iam_service.domain.value_object.device.DeviceType;
import vn.nhuandt3.iam_service.domain.value_object.device.UnitType;

import java.util.Objects;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class UpdateConfigLimitWarningRequest {
    Long id;

    @NotNull
    @Min(1)
    Long deviceId;

    @NotNull
    String type;

    @NotNull
    @Min(0)
    Float value;

    @NotNull
    String unit;

    public ConfigLimitWarningParam getParams() {
        ConfigLimitWarningParam params = new ConfigLimitWarningParam();
        params.setId(id);
        params.setDeviceId(deviceId);
        if (!Objects.isNull(type)) {
            params.setType(DeviceType.tryFrom(type));
        }
        params.setValue(value);
        if (!Objects.isNull(unit)) {
            params.setUnit(UnitType.tryFrom(unit));
        }

        return params;
    }
}
