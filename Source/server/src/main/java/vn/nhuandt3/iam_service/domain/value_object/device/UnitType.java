package vn.nhuandt3.iam_service.domain.value_object.device;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE)
@Getter
@AllArgsConstructor
public enum UnitType {
    CELSIUS("celsius", "Độ C"),
    PERCENT("percent", "Phần trăm"),
    CONCENTRATION("concentration", "Nồng độ"),
    ;
    String id;
    String name;

    public static UnitType tryFrom(String id) {
        for (UnitType d : UnitType.values()) {
            if (d.id.equals(id)) {
                return d;
            }
        }
        return null;
    }

}
