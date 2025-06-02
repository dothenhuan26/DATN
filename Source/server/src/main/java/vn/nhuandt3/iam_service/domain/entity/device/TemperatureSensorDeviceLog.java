package vn.nhuandt3.iam_service.domain.entity.device;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TemperatureSensorDeviceLog {
    Long id;
    Long deviceId;
    String action;
    Float temperature;
    Float humidity;
    String description;
    LocalDateTime created;
}
