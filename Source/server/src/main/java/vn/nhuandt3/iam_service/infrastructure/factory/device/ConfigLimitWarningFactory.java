package vn.nhuandt3.iam_service.infrastructure.factory.device;

import vn.nhuandt3.iam_service.domain.entity.device.ConfigLimitWarning;
import vn.nhuandt3.iam_service.domain.value_object.device.DeviceType;
import vn.nhuandt3.iam_service.domain.value_object.device.UnitType;
import vn.nhuandt3.iam_service.infrastructure.database.smart_home.entity.ConfigLimitWarningEntity;

import java.util.Objects;

public class ConfigLimitWarningFactory {
    public static ConfigLimitWarning fromRaw(ConfigLimitWarningEntity entity) {
        ConfigLimitWarning config = new ConfigLimitWarning();
        config.setId(entity.getId());
        config.setDeviceId(entity.getDeviceId());
        if (Objects.nonNull(entity.getType())) {
            config.setType(DeviceType.tryFrom(entity.getType()));
        }
        if (Objects.nonNull(entity.getUnit())) {
            config.setUnit(UnitType.tryFrom(entity.getUnit()));
        }
        config.setValue(entity.getValue());
        config.setCreatedAt(entity.getCreatedAt());
        config.setUpdatedAt(entity.getUpdatedAt());

        return config;
    }

    public static ConfigLimitWarningEntity toRaw(ConfigLimitWarning config) {
        ConfigLimitWarningEntity entity = new ConfigLimitWarningEntity();
        entity.setId(config.getId());
        entity.setDeviceId(config.getDeviceId());
        if (Objects.nonNull(config.getType())) {
            entity.setType(config.getType().getId());
        }
        if (Objects.nonNull(config.getUnit())) {
            entity.setType(config.getUnit().getId());
        }
        entity.setValue(config.getValue());
        entity.setCreatedAt(config.getCreatedAt());
        entity.setUpdatedAt(config.getUpdatedAt());

        return entity;
    }

    public static ConfigLimitWarningEntity toRawWithBeforeFields(ConfigLimitWarning after, ConfigLimitWarningEntity before) {
        ConfigLimitWarningEntity entity = new ConfigLimitWarningEntity();
        entity.setId(before.getId());
        entity.setCreatedAt(Objects.nonNull(after.getCreatedAt()) ? after.getCreatedAt() : before.getCreatedAt());
        entity.setUpdatedAt(Objects.nonNull(after.getUpdatedAt()) ? after.getUpdatedAt() : before.getUpdatedAt());
        entity.setDeviceId(Objects.nonNull(after.getDeviceId()) ? after.getDeviceId() : before.getDeviceId());
        entity.setType(Objects.nonNull(after.getType()) ? after.getType().getId() : before.getType());
        entity.setValue(Objects.nonNull(after.getValue()) ? after.getValue() : before.getValue());
        entity.setUnit(Objects.nonNull(after.getUnit()) ? after.getUnit().getId() : before.getUnit());

        return entity;
    }

}
