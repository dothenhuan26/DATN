package vn.nhuandt3.iam_service.domain.value_object.common;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE)
@Getter
@AllArgsConstructor
public enum OrderByType {
    ASC("asc", "asc"),
    DESC("desc", "desc");
    String id;
    String name;

    public static OrderByType tryFrom(String id) {
        for (OrderByType d : OrderByType.values()) {
            if (d.id.equals(id)) {
                return d;
            }
        }
        return null;
    }
}
