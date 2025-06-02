package vn.nhuandt3.iam_service.domain.contract.device;

import vn.nhuandt3.iam_service.domain.entity.device.Device;

import java.util.List;

public interface DeviceRepository {
    List<Device> findAll();
}
