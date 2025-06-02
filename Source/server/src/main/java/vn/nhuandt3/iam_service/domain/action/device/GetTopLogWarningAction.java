package vn.nhuandt3.iam_service.domain.action.device;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import vn.nhuandt3.iam_service.domain.contract.device.LogWarningRepository;
import vn.nhuandt3.iam_service.domain.entity.device.GasSensorDeviceLog;
import vn.nhuandt3.iam_service.domain.entity.device.LogWarning;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;

@Component
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class GetTopLogWarningAction {
    LogWarningRepository logWarningRepository;

    @NonFinal
    @Value("${common.list.limit.top}")
    protected Integer LIMIT;

    public List<LogWarning> handle(Integer limit) {
        if (Objects.isNull(limit) || limit < 1) {
            limit = LIMIT;
        }

        List<LogWarning> data = new ArrayList<>(logWarningRepository.getTopLogs(limit));

        if (data.isEmpty()) {
            return new ArrayList<>();
        }

        data.sort(Comparator.comparing(LogWarning::getCreated));

        return data;
    }
}
