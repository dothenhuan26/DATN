package vn.nhuandt3.iam_service.domain.entity.auth;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class IamScope {
    Long id;
    String scope;
}
