package vn.nhuandt3.iam_service.infrastructure.factory.device;

import vn.nhuandt3.iam_service.domain.entity.device.Device;
import vn.nhuandt3.iam_service.domain.value_object.device.DeviceType;
import vn.nhuandt3.iam_service.infrastructure.database.smart_home.entity.DeviceEntity;
import vn.nhuandt3.iam_service.infrastructure.database.smart_home.entity.UserEntity;

import java.util.Objects;

public class DeviceFactory {
    public static Device fromRaw(DeviceEntity entity) {
        Device device = new Device();
        device.setId(entity.getId());
        device.setName(entity.getName());
        if (!Objects.isNull(entity.getType())) {
            device.setType(DeviceType.tryFrom(entity.getType()));
        }
        device.setPort(entity.getPort());
        device.setCreatedAt(entity.getCreatedAt());
        device.setUpdatedAt(entity.getUpdatedAt());

        return device;
    }

    public static DeviceEntity toRaw(Device device) {
        DeviceEntity entity = new DeviceEntity();
        entity.setId(device.getId());
        entity.setName(device.getName());
        entity.setPort(device.getPort());
        if (Objects.nonNull(device.getType())) {
            entity.setType(device.getType().getId());
        }
        entity.setCreatedAt(device.getCreatedAt());
        entity.setUpdatedAt(device.getUpdatedAt());

        return entity;
    }

    public static DeviceEntity toRawWithBeforeFields(Device after, DeviceEntity before) {
        DeviceEntity entity = new DeviceEntity();
        entity.setId(before.getId());
        entity.setName(Objects.nonNull(after.getName()) ? after.getName() : before.getName());
        entity.setPort(Objects.nonNull(after.getPort()) ? after.getPort() : before.getPort());
        entity.setCreatedAt(Objects.nonNull(after.getCreatedAt()) ? after.getCreatedAt() : before.getCreatedAt());
        entity.setUpdatedAt(Objects.nonNull(after.getUpdatedAt()) ? after.getUpdatedAt() : before.getUpdatedAt());
        entity.setType(Objects.nonNull(after.getType()) ? after.getType().getId() : before.getType());

        return entity;
    }

}
