package vn.nhuandt3.iam_service.domain.action.device;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import vn.nhuandt3.iam_service.application.dto.device.SearchLogWarningParam;
import vn.nhuandt3.iam_service.domain.contract.device.LogWarningRepository;
import vn.nhuandt3.iam_service.domain.entity.device.LogWarning;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Component
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class GetLogWarningsAction {
    LogWarningRepository logWarningRepository;

    @NonFinal
    @Value("${common.list.paginate.limit}")
    protected Integer LIMIT;

    public List<LogWarning> handle(SearchLogWarningParam params) {
        Long cursor = params.getCursor();
        Integer limit = params.getLimit();

        if (Objects.isNull(cursor) || limit < 1) {
            params.setCursor(0L);
        }

        if (Objects.isNull(limit) || limit < 1) {
            params.setLimit(LIMIT);
        }

        return logWarningRepository.getLogs(params);
    }

}
