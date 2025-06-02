package vn.nhuandt3.iam_service.domain.value_object.device;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE)
@Getter
@AllArgsConstructor
public enum ActionType {
    READ_GAS("read_gas", "Read Gas"),
    READ_TEMP("read_temp", "Read Temp"),
    ;
    String id;
    String name;

    public static ActionType tryFrom(String id) {
        for (ActionType d : ActionType.values()) {
            if (d.id.equals(id)) {
                return d;
            }
        }
        return null;
    }
}
