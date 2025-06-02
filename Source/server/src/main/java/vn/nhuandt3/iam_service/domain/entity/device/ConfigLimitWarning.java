package vn.nhuandt3.iam_service.domain.entity.device;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import vn.nhuandt3.iam_service.domain.value_object.device.DeviceType;
import vn.nhuandt3.iam_service.domain.value_object.device.UnitType;

import java.time.LocalDateTime;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ConfigLimitWarning {
    Long id;
    Long deviceId;
    DeviceType type;
    Float value;
    UnitType unit;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
