package vn.nhuandt3.iam_service.domain.entity.device;

import jakarta.persistence.Column;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import vn.nhuandt3.iam_service.domain.value_object.device.UnitType;
import vn.nhuandt3.iam_service.domain.value_object.device.WarningType;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LogWarning {
    Long id;
    Long deviceId;
    String message;
    WarningType type;
    Float value;
    UnitType unit;
    LocalDateTime created;
}
