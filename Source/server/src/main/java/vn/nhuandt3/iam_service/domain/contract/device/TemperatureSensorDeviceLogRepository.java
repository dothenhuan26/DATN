package vn.nhuandt3.iam_service.domain.contract.device;

import vn.nhuandt3.iam_service.application.dto.device.SearchSensorParam;
import vn.nhuandt3.iam_service.domain.entity.device.TemperatureSensorDeviceLog;

import java.util.List;

public interface TemperatureSensorDeviceLogRepository {
    List<TemperatureSensorDeviceLog> getLogs(SearchSensorParam params);

    List<TemperatureSensorDeviceLog> getTopLogs(Integer limit);
}
