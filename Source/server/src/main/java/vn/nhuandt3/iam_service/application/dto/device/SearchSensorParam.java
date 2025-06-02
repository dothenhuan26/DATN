package vn.nhuandt3.iam_service.application.dto.device;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import vn.nhuandt3.iam_service.domain.value_object.common.OrderByType;

import java.time.LocalDateTime;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SearchSensorParam {
    Long cursor;
    Integer limit;
    LocalDateTime from;
    LocalDateTime to;
    OrderByType order;
}
