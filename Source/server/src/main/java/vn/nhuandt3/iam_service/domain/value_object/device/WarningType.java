package vn.nhuandt3.iam_service.domain.value_object.device;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE)
@Getter
@AllArgsConstructor
public enum WarningType {
    GAS_CONCENTRATION("gas_concentration", "Nồng độ khí Gas"),
    TEMPERATURE("temperature", "Nhiệt độ"),
    HUMIDITY("humidity", "Độ ẩm");
    String id;
    String name;

    public static WarningType tryFrom(String id) {
        for (WarningType d : WarningType.values()) {
            if (d.id.equals(id)) {
                return d;
            }
        }
        return null;
    }
}
