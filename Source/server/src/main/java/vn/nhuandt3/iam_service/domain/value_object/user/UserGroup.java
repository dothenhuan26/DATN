package vn.nhuandt3.iam_service.domain.value_object.user;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;

@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Getter
@AllArgsConstructor
public enum UserGroup implements Serializable {
    UNDEFINED(0, ""),
    SUPER_ADMIN(1, "Super Administrator"),
    ADMIN(2, "Administrator"),
    USER(3, "User"),
    ;
    int id;
    String name;

    public static UserGroup tryFrom(int id) {
        for (UserGroup d : UserGroup.values()) {
            if (d.id == id) {
                return d;
            }
        }
        return null;
    }
}