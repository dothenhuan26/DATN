package vn.nhuandt3.iam_service.domain.value_object.device;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE)
@Getter
@AllArgsConstructor
public enum StateType {

    ;
    String id;
    String name;

    public static StateType tryFrom(String id) {
        for (StateType d : StateType.values()) {
            if (d.id.equals(id)) {
                return d;
            }
        }
        return null;
    }
}
