package vn.nhuandt3.iam_service.infrastructure.repository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Component;
import vn.nhuandt3.iam_service.domain.contract.device.DeviceRepository;
import vn.nhuandt3.iam_service.domain.entity.device.Device;
import vn.nhuandt3.iam_service.infrastructure.database.smart_home.repository.DeviceJpaRepository;
import vn.nhuandt3.iam_service.infrastructure.factory.device.DeviceFactory;

import java.util.List;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DeviceRepositoryImpl implements DeviceRepository {
    DeviceJpaRepository deviceTable;

    @Override
    public List<Device> findAll() {
        return deviceTable.findAll().stream().map(DeviceFactory::fromRaw).toList();
    }
}
