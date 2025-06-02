package vn.nhuandt3.iam_service.infrastructure.factory.device;

import vn.nhuandt3.iam_service.domain.entity.device.GasSensorDeviceLog;
import vn.nhuandt3.iam_service.infrastructure.database.smart_home.entity.GasSensorDeviceLogEntity;

public class GasSensorDeviceLogFactory {
    public static GasSensorDeviceLog fromRaw(GasSensorDeviceLogEntity entity) {
        GasSensorDeviceLog log = new GasSensorDeviceLog();
        log.setId(entity.getId());
        log.setDeviceId(entity.getDeviceId());
        log.setAction(entity.getAction());
        log.setConcentrations(entity.getConcentrations());
        log.setDescription(entity.getDescription());
        log.setCreated(entity.getCreated());

        return log;
    }
}