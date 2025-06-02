package vn.nhuandt3.iam_service.domain.contract.device;

import vn.nhuandt3.iam_service.application.dto.device.SearchLogWarningParam;
import vn.nhuandt3.iam_service.application.dto.device.SearchSensorParam;
import vn.nhuandt3.iam_service.domain.entity.device.LogWarning;

import java.util.List;

public interface LogWarningRepository {
    List<LogWarning> getLogs(SearchLogWarningParam params);

    List<LogWarning> getTopLogs(Integer limit);
}
