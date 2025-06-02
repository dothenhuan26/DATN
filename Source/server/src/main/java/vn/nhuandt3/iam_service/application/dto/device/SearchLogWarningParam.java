package vn.nhuandt3.iam_service.application.dto.device;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import vn.nhuandt3.iam_service.domain.value_object.device.WarningType;
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SearchLogWarningParam extends SearchSensorParam {
    WarningType type;
}
