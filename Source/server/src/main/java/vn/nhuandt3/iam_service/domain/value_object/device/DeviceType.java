package vn.nhuandt3.iam_service.domain.value_object.device;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE)
@Getter
@AllArgsConstructor
public enum DeviceType {
    MQ2("MQ2", "Cảm biến khí Gas MQ2"),
    DHT11("DHT11", "Cảm biến nhiệt độ, độ ẩm DHT11");
    String id;
    String name;

    public static DeviceType tryFrom(String id) {
        for (DeviceType d : DeviceType.values()) {
            if (d.id.equals(id)) {
                return d;
            }
        }
        return null;
    }
}
