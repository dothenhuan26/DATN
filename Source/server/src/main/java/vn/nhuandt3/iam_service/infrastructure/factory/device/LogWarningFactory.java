package vn.nhuandt3.iam_service.infrastructure.factory.device;

import vn.nhuandt3.iam_service.domain.entity.device.LogWarning;
import vn.nhuandt3.iam_service.domain.value_object.device.UnitType;
import vn.nhuandt3.iam_service.domain.value_object.device.WarningType;
import vn.nhuandt3.iam_service.infrastructure.database.smart_home.entity.LogWarningEntity;

import java.util.Objects;

public class LogWarningFactory {

    public static LogWarning fromRaw(LogWarningEntity entity) {
        LogWarning log = new LogWarning();
        log.setId(entity.getId());
        log.setDeviceId(entity.getDeviceId());
        log.setMessage(entity.getMessage());

        if (Objects.nonNull(entity.getType())) {
            log.setType(WarningType.tryFrom(entity.getType()));
        }
        log.setValue(entity.getValue());

        if (Objects.nonNull(entity.getUnit())) {
            log.setUnit(UnitType.tryFrom(entity.getUnit()));
        }
        log.setCreated(entity.getCreated());

        return log;
    }

}
