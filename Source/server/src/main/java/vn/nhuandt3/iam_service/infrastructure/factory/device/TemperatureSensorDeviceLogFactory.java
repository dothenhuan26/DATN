package vn.nhuandt3.iam_service.infrastructure.factory.device;

import vn.nhuandt3.iam_service.domain.entity.device.TemperatureSensorDeviceLog;
import vn.nhuandt3.iam_service.infrastructure.database.smart_home.entity.TemperatureSensorDeviceLogEntity;

public class TemperatureSensorDeviceLogFactory {
    public static TemperatureSensorDeviceLog fromRaw(TemperatureSensorDeviceLogEntity entity) {
        TemperatureSensorDeviceLog log = new TemperatureSensorDeviceLog();
        log.setId(entity.getId());
        log.setDeviceId(entity.getDeviceId());
        log.setAction(entity.getAction());
        log.setTemperature(entity.getTemperature());
        log.setHumidity(entity.getHumidity());
        log.setDescription(entity.getDescription());
        log.setCreated(entity.getCreated());

        return log;
    }
}