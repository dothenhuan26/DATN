package vn.nhuandt3.iam_service.domain.action.device;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import vn.nhuandt3.iam_service.domain.contract.device.GasSensorDeviceLogRepository;
import vn.nhuandt3.iam_service.domain.contract.device.TemperatureSensorDeviceLogRepository;
import vn.nhuandt3.iam_service.domain.entity.device.GasSensorDeviceLog;
import vn.nhuandt3.iam_service.domain.entity.device.TemperatureSensorDeviceLog;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;

@Component
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class GetTopTemperatureSensorLogsAction {
    TemperatureSensorDeviceLogRepository temperatureSensorDeviceLogRepository;

    @NonFinal
    @Value("${common.list.limit.top}")
    protected Integer LIMIT;

    public List<TemperatureSensorDeviceLog> handle(Integer limit) {
        if (Objects.isNull(limit) || limit < 1) {
            limit = LIMIT;
        }

        List<TemperatureSensorDeviceLog> data = new ArrayList<>(temperatureSensorDeviceLogRepository.getTopLogs(limit));

        if (data.isEmpty()) {
            return new ArrayList<>();
        }

        data.sort(Comparator.comparing(TemperatureSensorDeviceLog::getCreated));

        return data;
    }

}
