package vn.nhuandt3.iam_service.domain.contract.device;

import vn.nhuandt3.iam_service.application.dto.device.SearchSensorParam;
import vn.nhuandt3.iam_service.domain.entity.device.GasSensorDeviceLog;

import java.util.List;

public interface GasSensorDeviceLogRepository {
    List<GasSensorDeviceLog> getLogs(SearchSensorParam params);

    List<GasSensorDeviceLog> getTopLogs(Integer limit);
}
