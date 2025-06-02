package vn.nhuandt3.iam_service.application.dto.device;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import vn.nhuandt3.iam_service.domain.entity.device.ConfigLimitWarning;
import vn.nhuandt3.iam_service.domain.value_object.device.DeviceType;
import vn.nhuandt3.iam_service.domain.value_object.device.UnitType;

import java.time.LocalDateTime;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ConfigLimitWarningParam {
    Long id;
    Long deviceId;
    DeviceType type;
    Float value;
    UnitType unit;

    public ConfigLimitWarning toEntity() {
        ConfigLimitWarning entity = new ConfigLimitWarning();
        entity.setId(id);
        entity.setDeviceId(deviceId);
        entity.setType(type);
        entity.setValue(value);
        entity.setUnit(unit);
        entity.setUpdatedAt(LocalDateTime.now());

        return entity;
    }
}
