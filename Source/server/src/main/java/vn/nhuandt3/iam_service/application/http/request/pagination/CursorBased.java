package vn.nhuandt3.iam_service.application.http.request.pagination;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Null;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import vn.nhuandt3.iam_service.application.dto.device.SearchSensorParam;
import vn.nhuandt3.iam_service.domain.value_object.common.OrderByType;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Objects;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PROTECTED)
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public abstract class CursorBased {
    Long cursor;

    @Min(1)
    Integer limit;

    String from;

    String to;

    String order;

    public SearchSensorParam getSearchParams() {
        SearchSensorParam params = new SearchSensorParam();
        params.setCursor(cursor);
        params.setLimit(limit);
        try {
            params.setFrom(parseDateTime(from));
            params.setTo(parseDateTime(to));
            if (Objects.nonNull(order)) {
                params.setOrder(OrderByType.tryFrom(order));
            } else {
                params.setOrder(OrderByType.ASC);
            }

        } catch (Exception e) {
            params.setOrder(OrderByType.ASC);
        }
        return params;
    }

    protected LocalDateTime parseDateTime(String value) {
        if (value == null || value.isBlank()) return null;
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            return LocalDateTime.parse(value, formatter);
        } catch (Exception e) {
            return null;
        }
    }
}
