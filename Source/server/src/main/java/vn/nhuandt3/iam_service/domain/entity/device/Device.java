package vn.nhuandt3.iam_service.domain.entity.device;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import vn.nhuandt3.iam_service.domain.value_object.device.DeviceType;

import java.time.LocalDateTime;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Device {
    Long id;
    String name;
    DeviceType type;
    String port;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
