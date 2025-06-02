package vn.nhuandt3.iam_service.application.http.request.device;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import vn.nhuandt3.iam_service.application.dto.device.SearchLogWarningParam;
import vn.nhuandt3.iam_service.application.http.request.pagination.CursorBased;
import vn.nhuandt3.iam_service.domain.value_object.common.OrderByType;
import vn.nhuandt3.iam_service.domain.value_object.device.WarningType;

import java.util.Objects;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class GetLogWarningsRequest extends CursorBased {
    String type;

    public SearchLogWarningParam getSearchLogWarningParam() {
        SearchLogWarningParam params = new SearchLogWarningParam();
        params.setCursor(cursor);
        params.setLimit(limit);
        if (Objects.nonNull(order)) {
            params.setOrder(OrderByType.tryFrom(order));
        } else {
            params.setOrder(OrderByType.DESC);
        }
        if (Objects.nonNull(type)) {
            params.setType(WarningType.tryFrom(type));
        }
        try {
            params.setFrom(parseDateTime(from));
            params.setTo(parseDateTime(to));

        } catch (Exception e) {
        }

        return params;
    }
}
